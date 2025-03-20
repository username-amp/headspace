<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use App\Models\MeditationSession;
use App\Models\FocusSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get user stats
        $stats = $this->getUserStats($user);
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities($user);
        
        // Get recommended content
        $recommendedContent = $this->getRecommendedContent($user);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'recommendedContent' => $recommendedContent,
        ]);
    }

    private function getUserStats($user)
    {
        // Force refresh user relationship to prevent stale data
        $user->refresh();
        
        $now = Carbon::now();
        
        // Calculate current streak with fresh data
        $streak = $this->calculateStreak($user);

        // Calculate total minutes including both play and pause actions
        $totalMinutes = UserActivity::where('user_id', $user->id)
            ->where(function ($query) {
                $query->where('action', 'play')
                    ->orWhere(function ($q) {
                        $q->where('action', 'pause')
                            ->whereNotNull('duration')
                            ->where('duration', '>', 0);
                    });
            })
            ->sum('duration') / 60;

        // Get total sessions counting completed sessions
        $totalSessions = UserActivity::where('user_id', $user->id)
            ->where('action', 'pause')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->count();

        // Get today's recommended practice
        $todaysPractice = $this->getTodaysPractice($user);

        // Calculate achievements based on fresh data
        $meditationSessions = UserActivity::where('user_id', $user->id)
            ->where('action', 'pause')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->whereHasMorph('trackable', [MeditationSession::class])
            ->distinct('trackable_id')
            ->count();

        $focusHours = UserActivity::where('user_id', $user->id)
            ->where('action', 'pause')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->whereHasMorph('trackable', [FocusSession::class])
            ->sum('duration') / 3600; // Convert seconds to hours

        // Calculate completed hours (rounded down)
        $completedFocusHours = floor($focusHours);

        // Calculate total achievements progress
        $achievementsProgress = min($meditationSessions, 10) + min($completedFocusHours, 3);

        // Define achievements with real progress
        $achievements = [
            'items' => [
                [
                    'title' => 'Meditation Master',
                    'description' => 'Complete 10 meditation sessions',
                    'progress' => min($meditationSessions, 10),
                    'total' => 10,
                    'color' => 'text-violet-500',
                    'icon' => 'Flower2',
                ],
                [
                    'title' => 'Focus Master',
                    'description' => 'Complete 3 hours of focus sessions',
                    'progress' => $completedFocusHours,
                    'total' => 3,
                    'color' => 'text-indigo-500',
                    'icon' => 'Brain',
                ]
            ],
            'count' => $achievementsProgress,
            'total' => 13,
            'message' => $achievementsProgress > 0 
                ? 'Keep going! You\'re making great progress!' 
                : 'Complete sessions to unlock achievements'
        ];

        return [
            'currentStreak' => [
                'days' => $streak,
                'message' => 'Keep up the great work!',
            ],
            'totalMinutes' => [
                'minutes' => (int) $totalMinutes,
                'message' => floor($totalMinutes / 60) . ' hours of mindfulness',
            ],
            'totalSessions' => [
                'count' => $totalSessions,
                'message' => 'Sessions completed',
            ],
            'achievements' => $achievements,
            'todaysPractice' => $todaysPractice,
        ];
    }

    private function calculateStreak($user)
    {
        $activities = UserActivity::where('user_id', $user->id)
            ->where('action', 'play')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($activity) {
                return $activity->created_at->format('Y-m-d');
            });

        $streak = 0;
        $today = Carbon::today();

        foreach ($activities as $date => $activity) {
            if ($today->diffInDays(Carbon::parse($date)) > $streak) {
                break;
            }
            $streak++;
            $today = $today->subDay();
        }

        return $streak;
    }

    private function getRecentActivities($user)
    {
        return UserActivity::with(['trackable' => function ($query) {
            $query->withoutTrashed();
        }])
            ->where('user_id', $user->id)
            ->where(function ($query) {
                $query->where('action', 'play')
                    ->orWhere(function ($q) {
                        $q->where('action', 'pause')
                            ->whereNotNull('duration')
                            ->where('duration', '>', 0);
                    });
            })
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($activity) {
                $content = $activity->trackable;
                if (!$content) return null;

                // Use the trackable_type directly for type determination
                $type = $activity->trackable_type === 'meditation' ? 'Meditation' : 'Focus';
                
                // Ensure duration is numeric and handle null/invalid values
                $duration = 0;
                if ($activity->action === 'play') {
                    // For play actions, use content duration if activity duration is not valid
                    $duration = is_numeric($activity->duration) && $activity->duration > 0 
                        ? (int)$activity->duration 
                        : (is_numeric($content->duration) ? (int)$content->duration * 60 : 0);
                } else {
                    // For pause actions, use activity duration if valid
                    $duration = is_numeric($activity->duration) ? (int)$activity->duration : 0;
                }
                
                return [
                    'title' => $content->title ?? 'Untitled Session',
                    'type' => $type,
                    'duration' => floor($duration / 60) . ' min',
                    'timestamp' => $activity->created_at->diffForHumans(),
                    'icon' => $this->getIconForType($type),
                    'color' => $this->getColorForType($type),
                ];
            })
            ->filter()
            ->values();
    }

    private function getRecommendedContent($user)
    {
        // Get latest meditation sessions with video content
        $meditations = MeditationSession::whereNotNull('video_url')
            ->where('video_url', '!=', '')
            ->latest()
            ->take(2)
            ->get();

        // Get random focus sessions with audio content
        $focusSessions = FocusSession::whereNotNull('audio_url')
            ->where('audio_url', '!=', '')
            ->inRandomOrder()
            ->take(1)
            ->get();

        // If we don't have enough sessions with media, get featured ones as fallback
        if ($meditations->count() < 2) {
            $additionalMeditations = MeditationSession::where('is_featured', true)
                ->whereNotIn('id', $meditations->pluck('id'))
                ->latest()
                ->take(2 - $meditations->count())
                ->get();
            $meditations = $meditations->concat($additionalMeditations);
        }

        if ($focusSessions->isEmpty()) {
            $focusSessions = FocusSession::where('is_featured', true)
                ->latest()
                ->take(1)
                ->get();
        }

        // Combine and map the results
        return collect([...$meditations, ...$focusSessions])
            ->map(function ($content) {
                $type = $content instanceof MeditationSession ? 'Meditation' : 'Focus';
                
                return [
                    'title' => $content->title,
                    'type' => $type,
                    'duration' => $content->duration . ' min',
                    'category' => $content->category,
                    'image' => $content->image_url,
                    'video_url' => $content instanceof MeditationSession ? $content->video_url : null,
                    'audio_url' => $content instanceof FocusSession ? $content->audio_url : null,
                    'icon' => $this->getIconForType($type),
                    'url' => $type === 'Meditation' ? 
                        route('meditate.details', $content->id) : 
                        route('focus', ['track' => $content->id])
                ];
            });
    }

    private function getTodaysPractice($user)
    {
        // Check if user has completed any sessions today
        $completedToday = UserActivity::where('user_id', $user->id)
            ->where('action', 'play')
            ->whereDate('created_at', Carbon::today())
            ->exists();

        // First try to get the latest meditation that matches the user's preferred time of day
        $hour = Carbon::now()->hour;
        $timeOfDay = match(true) {
            $hour < 12 => 'morning',
            $hour < 17 => 'afternoon',
            default => 'evening'
        };

        $recommendedSession = MeditationSession::where('category', $timeOfDay)
            ->latest()
            ->first();

        if (!$recommendedSession) {
            // Try to get the latest featured meditation
            $recommendedSession = MeditationSession::where('is_featured', true)
                ->latest()
                ->first();
        }

        if (!$recommendedSession) {
            // Get the latest meditation session regardless of category
            $recommendedSession = MeditationSession::latest()->first();
        }

        if (!$recommendedSession) {
            // Fallback content if no sessions are found
            return [
                'completed' => $completedToday,
                'session' => [
                    'title' => 'Morning Mindfulness',
                    'type' => 'Meditation',
                    'duration' => '10 min',
                    'description' => 'Start your day with clarity and purpose',
                    'image' => '/images/meditations/default.jpg',
                ],
            ];
        }

        return [
            'completed' => $completedToday,
            'session' => [
                'title' => $recommendedSession->title,
                'type' => $recommendedSession->type ?? 'Meditation',
                'duration' => $recommendedSession->duration . ' min',
                'description' => $recommendedSession->description,
                'image' => $recommendedSession->image_url,
            ],
        ];
    }

    private function getIconForType($type)
    {
        return $type === 'Meditation' ? 'Flower2' : 'Brain';
    }

    private function getColorForType($type)
    {
        return $type === 'Meditation' ? 'text-violet-500' : 'text-indigo-500';
    }
}
