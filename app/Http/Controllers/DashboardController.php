<?php

namespace App\Http\Controllers;

use App\Models\MeditationSession;
use App\Models\UserMeditation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        
        // Get user's meditation stats
        $stats = [
            'currentStreak' => $this->calculateStreak($user->id),
            'totalMinutes' => $this->calculateTotalMinutes($user->id),
            'level' => $this->calculateUserLevel($user->id),
            'dailyGoals' => $this->getDailyGoalsProgress($user->id),
        ];

        // Get streak calendar data
        $streakDays = $this->getStreakCalendarData($user->id);

        // Get weekly activity data
        $weeklyActivity = $this->getWeeklyActivityData($user->id);

        // Get recommended sessions
        $recommendedSessions = MeditationSession::query()
            ->where('is_featured', true)
            ->take(3)
            ->get()
            ->map(fn ($session) => [
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
            ]);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'streakDays' => $streakDays,
            'weeklyActivity' => $weeklyActivity,
            'recommendedSessions' => $recommendedSessions,
        ]);
    }

    private function calculateStreak(int $userId): array
    {
        $lastTwoWeeks = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->lastTwoWeeks()
            ->orderBy('completed_at', 'desc')
            ->get();

        $currentStreak = 0;
        $today = now()->startOfDay();

        foreach ($lastTwoWeeks as $meditation) {
            $meditationDate = $meditation->completed_at->startOfDay();
            $dayDiff = $today->diffInDays($meditationDate);

            if ($dayDiff === $currentStreak) {
                $currentStreak++;
            } else {
                break;
            }
        }

        return [
            'days' => $currentStreak,
            'message' => $currentStreak > 0 ? 'Keep going strong!' : 'Start your streak today!',
        ];
    }

    private function calculateTotalMinutes(int $userId): array
    {
        $totalMinutes = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->sum('duration_minutes');

        return [
            'minutes' => $totalMinutes,
            'message' => 'Time spent meditating',
        ];
    }

    private function calculateUserLevel(int $userId): array
    {
        $totalMinutes = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->sum('duration_minutes');

        $level = floor($totalMinutes / 60) + 1; // Level up every 60 minutes
        $titles = [
            1 => 'Mindful Beginner',
            2 => 'Calm Seeker',
            3 => 'Peace Finder',
            4 => 'Zen Apprentice',
            5 => 'Mindful Explorer',
            6 => 'Meditation Master',
        ];

        return [
            'level' => $level,
            'title' => $titles[min($level, count($titles))],
        ];
    }

    private function getDailyGoalsProgress(int $userId): array
    {
        $todaysMeditations = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->whereBetween('completed_at', [now()->startOfDay(), now()->endOfDay()])
            ->count();

        return [
            'completed' => $todaysMeditations,
            'total' => 3,
            'message' => 'Daily goals completed',
        ];
    }

    private function getStreakCalendarData(int $userId): array
    {
        $lastTwoWeeks = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->lastTwoWeeks()
            ->get()
            ->groupBy(fn ($meditation) => $meditation->completed_at->format('Y-m-d'));

        $days = [];
        $date = now()->subDays(13);

        for ($i = 0; $i < 14; $i++) {
            $dateStr = $date->format('Y-m-d');
            $days[] = [
                'date' => $dateStr,
                'completed' => isset($lastTwoWeeks[$dateStr]),
            ];
            $date->addDay();
        }

        return $days;
    }

    private function getWeeklyActivityData(int $userId): array
    {
        $weeklyData = UserMeditation::query()
            ->forUser($userId)
            ->completed()
            ->thisWeek()
            ->selectRaw('DATE(completed_at) as date, SUM(duration_minutes) as total_minutes')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $data = [];
        $date = now()->startOfWeek();

        for ($i = 0; $i < 7; $i++) {
            $dateStr = $date->format('Y-m-d');
            $data[] = [
                'day' => $date->format('D'),
                'minutes' => $weeklyData[$dateStr]->total_minutes ?? 0,
            ];
            $date->addDay();
        }

        return $data;
    }
}
