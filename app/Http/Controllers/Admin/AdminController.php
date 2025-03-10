<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Course;
use App\Models\FocusSession;
use App\Models\MeditationSession;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::where('role', 'user')->count(),
            'total_meditation_sessions' => MeditationSession::count(),
            'total_focus_sessions' => FocusSession::count(),
            'total_courses' => Course::count(),
        ];

        // Get user activity for the last 7 days
        $userActivity = ActivityLog::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total_activities'),
            'activity_type'
        )
            ->whereBetween('created_at', [Carbon::now()->subDays(7), Carbon::now()])
            ->groupBy('date', 'activity_type')
            ->get()
            ->groupBy('date');

        // Get most active users
        $mostActiveUsers = User::select('users.*')
            ->leftJoin('activity_logs', 'users.id', '=', 'activity_logs.user_id')
            ->selectRaw('COUNT(activity_logs.id) as activity_count')
            ->groupBy('users.id')
            ->orderByDesc('activity_count')
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'userActivity' => $userActivity,
            'mostActiveUsers' => $mostActiveUsers,
        ]);
    }

    public function users()
    {
        $users = User::where('role', 'user')
            ->withCount(['meditations', 'activityLogs'])
            ->paginate(10);

        return Inertia::render('admin/users/index', [
            'users' => $users,
        ]);
    }

    public function userDetails(User $user)
    {
        $activityLogs = $user->activityLogs()
            ->latest()
            ->paginate(10);

        $stats = [
            'total_meditation_time' => $user->meditations()->sum('duration_minutes'),
            'meditation_streak' => $user->getCurrentStreak(),
            'completed_courses' => $user->progress()
                ->where('is_completed', true)
                ->whereNotNull('course_lesson_id')
                ->count(),
        ];

        return Inertia::render('admin/users/show', [
            'user' => $user,
            'activityLogs' => $activityLogs,
            'stats' => $stats,
        ]);
    }

    public function toggleUserStatus(User $user)
    {
        $user->is_active = ! $user->is_active;
        $user->save();

        return back()->with('success', 'User status updated successfully.');
    }

    public function analytics()
    {
        $monthlyStats = ActivityLog::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total_activities'),
            'activity_type'
        )
            ->whereYear('created_at', Carbon::now()->year)
            ->groupBy('year', 'month', 'activity_type')
            ->get()
            ->groupBy(['year', 'month']);

        $popularContent = [
            'meditations' => MeditationSession::withCount(['userMeditations as completion_count'])
                ->orderByDesc('completion_count')
                ->limit(5)
                ->get(),
            'focus' => FocusSession::withCount(['userProgress as usage_count'])
                ->orderByDesc('usage_count')
                ->limit(5)
                ->get(),
            'courses' => Course::select('courses.*')
                ->withCount(['lessons'])
                ->withCount(['progress as completion_count' => function ($query) {
                    $query->whereNotNull('course_lesson_id');
                }])
                ->orderByDesc('completion_count')
                ->limit(5)
                ->get(),
        ];

        return Inertia::render('admin/analytics', [
            'monthlyStats' => $monthlyStats,
            'popularContent' => $popularContent,
        ]);
    }
}
