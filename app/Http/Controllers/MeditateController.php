<?php

namespace App\Http\Controllers;

use App\Models\MeditationSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MeditateController extends Controller
{
    public function index(): Response
    {
        $meditations = MeditationSession::orderBy('created_at', 'desc')->get();

        return Inertia::render('meditate', [
            'meditations' => $meditations->map(function ($meditation) {
                return [
                    'id' => $meditation->id,
                    'title' => $meditation->title,
                    'category' => $meditation->category,
                    'duration' => $meditation->duration,
                    'description' => $meditation->description,
                    'image_url' => $meditation->image_url,
                    'video_url' => $meditation->video_url,
                    'is_featured' => (bool) $meditation->is_featured,
                    'section' => $meditation->section,
                ];
            }),
        ]);
    }

    public function show(MeditationSession $meditation): Response
    {
        // Get related meditations from the same category
        $relatedMeditations = MeditationSession::query()
            ->where('id', '!=', $meditation->id)
            ->where('category', $meditation->category)
            ->take(3)
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image_url' => $session->image_url,
            ]);

        return Inertia::render('meditate/[id]', [
            'meditation' => [
                'id' => $meditation->id,
                'title' => $meditation->title,
                'description' => $meditation->description,
                'type' => $meditation->type,
                'category' => $meditation->category,
                'duration' => $meditation->duration,
                'image_url' => $meditation->image_url,
                'video_url' => $meditation->video_url,
                'is_featured' => $meditation->is_featured,
            ],
            'relatedMeditations' => $relatedMeditations,
        ]);
    }

    private function getMeditationsByCategory(string $category): array
    {
        return MeditationSession::query()
            ->byCategory($category)
            ->take(3)
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
            ])
            ->toArray();
    }

    public function complete(Request $request, MeditationSession $session)
    {
        $request->validate([
            'duration_minutes' => 'required|integer|min:1',
        ]);

        $request->user()->meditations()->create([
            'meditation_session_id' => $session->id,
            'duration_minutes' => $request->duration_minutes,
            'completed_at' => now(),
        ]);

        return response()->json(['message' => 'Meditation session completed successfully']);
    }
}
