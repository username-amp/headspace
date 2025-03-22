<?php

namespace App\Http\Controllers;

use App\Models\MoodAssessment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MoodAssessmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'meditation_session_id' => 'required|exists:meditation_sessions,id',
            'assessment_type' => 'required|in:pre,post',
            'emotions' => 'nullable|array',
            'emotions.*' => 'string',
            'mood_rating' => 'nullable|integer|min:1|max:5',
            'physical_symptoms' => 'nullable|array',
            'physical_symptoms.*' => 'string',
            'mood_shift' => 'nullable|string|in:improved,same,worsened',
            'emotional_state' => 'nullable|string',
            'reflections' => 'nullable|string',
        ]);

        $assessment = MoodAssessment::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        return response()->json($assessment);
    }

    public function getSessionAssessments(Request $request, $sessionId)
    {
        $assessments = MoodAssessment::forUser(Auth::id())
            ->forSession($sessionId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($assessments);
    }

    public function getUserMoodHistory(Request $request)
    {
        $assessments = MoodAssessment::forUser(Auth::id())
            ->with('meditationSession')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($assessments);
    }
} 