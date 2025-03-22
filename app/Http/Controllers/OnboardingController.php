<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MoodAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    public function show()
    {
        return inertia('auth/onboard');
    }

    public function save(Request $request)
    {
        $validated = $request->validate([
            'preferred_time' => 'required|string|in:morning,afternoon,evening',
            'daily_goal_minutes' => 'required|integer|min:5|max:60',
            'notifications_enabled' => 'required|boolean',
            'initial_mood' => 'required|integer|min:1|max:5',
            'interests' => 'required|array|min:1',
            'interests.*' => 'string|in:stress_relief,better_sleep,focus,anxiety,happiness,self_growth',
        ]);

        // Update user preferences
        User::where('id', Auth::id())->update([
            'preferred_time' => $validated['preferred_time'],
            'daily_goal_minutes' => $validated['daily_goal_minutes'],
            'notifications_enabled' => $validated['notifications_enabled'],
            'interests' => $validated['interests'],
            'onboarding_completed' => true,
        ]);

        // Save initial mood assessment
        MoodAssessment::create([
            'user_id' => Auth::id(),
            'assessment_type' => 'initial',
            'mood_rating' => $validated['initial_mood'],
            'created_at' => now(),
        ]);

        return redirect()->route('dashboard');
    }
} 