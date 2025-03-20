<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityController extends Controller
{
    public function track(Request $request)
    {
        $validated = $request->validate([
            'trackable_type' => 'required|string',
            'trackable_id' => 'required|integer',
            'action' => 'required|string',
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

        // Ensure duration is not null for pause actions
        if ($validated['action'] === 'pause' && $duration === null) {
            return response()->json(['error' => 'Duration is required for pause action'], 422);
        }

        // Create the activity record
        $activity = UserActivity::create([
            'user_id' => Auth::id(),
            'trackable_type' => $trackableType,
            'trackable_id' => $validated['trackable_id'],
            'action' => $validated['action'],
            'duration' => $duration,
        ]);

        return response()->json($activity);
    }
} 