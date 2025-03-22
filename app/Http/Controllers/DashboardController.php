<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use App\Models\MeditationSession;
use App\Models\FocusSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
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

        // Get total sessions by counting unique completed meditation sessions
        $totalSessions = UserActivity::where('user_id', $user->id)
            ->where('action', 'complete')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->whereHasMorph('trackable', [MeditationSession::class])
            ->distinct()->count('trackable_id');

        // Get today's recommended practice
        $todaysPractice = $this->getTodaysPractice($user);

        // Calculate achievements based on completed sessions
        $meditationSessions = UserActivity::where('user_id', $user->id)
            ->where('action', 'complete')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->whereHasMorph('trackable', [MeditationSession::class])
            ->distinct()->count('trackable_id');

        // Calculate focus hours from completed focus sessions
        $focusHours = UserActivity::where('user_id', $user->id)
            ->where('action', 'complete')
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

        return Inertia::render('dashboard', [
            'stats' => [
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
                'moodAnalytics' => $this->getMoodAnalytics($user),
            ],
            'recentActivities' => $this->getRecentActivities($user),
            'recommendedContent' => $this->getRecommendedContent($user),
        ]);
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
            ->where('action', 'complete')
            ->whereNotNull('duration')
            ->where('duration', '>', 0)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($activity) {
                $content = $activity->trackable;
                if (!$content) return null;

                // Use the trackable_type directly for type determination
                $type = $activity->trackable_type === 'meditation' ? 'Meditation' : 'Focus';
                
                // Get duration in minutes
                $duration = ceil($activity->duration / 60);
                
                return [
                    'title' => $content->title ?? 'Untitled Session',
                    'type' => $type,
                    'duration' => $duration . ' min',
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

    private function getMoodAnalytics($user)
    {
        // Get mood trends for the last 7 days
        $moodTrends = DB::table('mood_assessments')
            ->where('user_id', $user->id)
            ->whereNotNull('mood_rating')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('AVG(mood_rating) as avg_rating')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'), 'asc')
            ->get();

        Log::info('Mood Trends:', ['data' => $moodTrends]);

        // Get meditation impact (before vs after) - Fixed query to use MySQL CAST
        $meditationImpact = DB::table('mood_assessments as pre')
            ->join('mood_assessments as post', function ($join) {
                $join->on('pre.meditation_session_id', '=', 'post.meditation_session_id')
                    ->where('pre.assessment_type', '=', 'pre')
                    ->where('post.assessment_type', '=', 'post')
                    ->whereRaw('pre.created_at < post.created_at');
            })
            ->where('pre.user_id', $user->id)
            ->whereNotNull('pre.mood_rating')
            ->whereNotNull('post.mood_rating')
            ->select(
                DB::raw('DATE(pre.created_at) as date'),
                DB::raw('CAST(pre.mood_rating AS SIGNED) as pre_rating'),
                DB::raw('CAST(post.mood_rating AS SIGNED) as post_rating')
            )
            ->orderBy('pre.created_at', 'desc')
            ->take(5)
            ->get();

        Log::info('Meditation Impact:', ['data' => $meditationImpact]);

        // Get mood distribution
        $moodDistribution = DB::table('mood_assessments')
            ->where('user_id', $user->id)
            ->whereNotNull('mood_rating')
            ->select('mood_rating', DB::raw('COUNT(*) as count'))
            ->groupBy('mood_rating')
            ->orderBy('mood_rating', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->mood_rating => $item->count];
            });

        Log::info('Mood Distribution:', ['data' => $moodDistribution]);

        // Map mood ratings to emojis
        $moodEmojis = [
            1 => ['emoji' => '😢', 'label' => 'Very Low'],
            2 => ['emoji' => '😕', 'label' => 'Low'],
            3 => ['emoji' => '😐', 'label' => 'Neutral'],
            4 => ['emoji' => '🙂', 'label' => 'Good'],
            5 => ['emoji' => '😊', 'label' => 'Excellent'],
        ];

        return [
            'trends' => [
                'labels' => $moodTrends->pluck('date')->map(function ($date) {
                    return Carbon::parse($date)->format('M d');
                })->toArray(),
                'moodRatings' => $moodTrends->pluck('avg_rating')->toArray(),
            ],
            'emotionFrequency' => [
                'emotions' => collect($moodEmojis)->map(function ($mood, $rating) use ($moodDistribution) {
                    return [
                        'label' => $mood['label'],
                        'emoji' => $mood['emoji'],
                        'count' => $moodDistribution[$rating] ?? 0,
                    ];
                })->values()->toArray(),
                'counts' => collect($moodEmojis)->map(function ($mood, $rating) use ($moodDistribution) {
                    return $moodDistribution[$rating] ?? 0;
                })->values()->toArray(),
            ],
            'meditationImpact' => [
                'labels' => $meditationImpact->pluck('date')->map(function ($date) {
                    return Carbon::parse($date)->format('M d');
                })->toArray(),
                'beforeMeditation' => $meditationImpact->pluck('pre_rating')->map(function ($rating) {
                    return (int) $rating;
                })->toArray(),
                'afterMeditation' => $meditationImpact->pluck('post_rating')->map(function ($rating) {
                    return (int) $rating;
                })->toArray(),
            ],
        ];
    }
}
