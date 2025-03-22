<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\UserMeditation;


class ActivityController extends Controller
{
    public function track(Request $request)
    {
        $validated = $request->validate([
            'trackable_type' => 'required|string',
            'trackable_id' => 'required|integer',
            'action' => 'required|string|in:play,pause,complete,view',
            'duration' => 'nullable|integer',
        ]);

        // Map the trackable_type to the correct morph map key
        $trackableType = match ($validated['trackable_type']) {
            'App\Models\FocusTrack', 'App\Models\FocusSession' => 'focus',
            'App\Models\MeditationSession', 'App\Models\Meditation' => 'meditation',
            default => $validated['trackable_type'],
        };

        // Get duration from validated data, defaulting to null if not set
        $duration = $validated['duration'] ?? null;

        // For play actions, set initial duration to 0 if not provided
        if ($validated['action'] === 'play') {
            $duration = $duration ?? 0;
        }

        // Ensure duration is not null for pause and complete actions
        if (($validated['action'] === 'pause' || $validated['action'] === 'complete') && $duration === null) {
            return response()->json(['error' => 'Duration is required for pause and complete actions'], 422);
        }

        try {
            // Create the activity record
            $activity = UserActivity::create([
                'user_id' => Auth::id(),
                'trackable_type' => $trackableType,
                'trackable_id' => $validated['trackable_id'],
                'action' => $validated['action'],
                'duration' => $duration,
            ]);

            // If this is a completion action for a meditation session, create or update a UserMeditation record
            if ($validated['action'] === 'complete' && $trackableType === 'meditation') {
                // Convert duration from seconds to minutes
                $durationMinutes = ceil($duration / 60);
                
                // Delete any existing records for the same day to avoid unique constraint violation
                UserMeditation::where('user_id', Auth::id())
                    ->where('meditation_session_id', $validated['trackable_id'])
                    ->whereDate('completed_at', now()->toDateString())
                    ->delete();
                
                // Create a new record
                UserMeditation::create([
                    'user_id' => Auth::id(),
                    'meditation_session_id' => $validated['trackable_id'],
                    'duration_minutes' => $durationMinutes,
                    'completed_at' => now(),
                ]);
            }

            return response()->json($activity);
        } catch (\Exception $e) {
            Log::error('Activity tracking error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to track activity'], 500);
        }
    }
} 