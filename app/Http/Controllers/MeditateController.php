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
        // Get featured meditations
        $featuredMeditations = MeditationSession::query()
            ->featured()
            ->take(4)
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
            ]);

        // Get today's meditation
        $todaysMeditation = MeditationSession::query()
            ->where('category', 'daily')
            ->inRandomOrder()
            ->first();

        if ($todaysMeditation) {
            $todaysMeditation = [
                'id' => $todaysMeditation->id,
                'title' => $todaysMeditation->title,
                'type' => $todaysMeditation->type,
                'duration' => $todaysMeditation->duration,
                'image' => $todaysMeditation->image_url,
            ];
        }

        // Get sections with their meditations
        $sections = [
            [
                'title' => 'New and Popular',
                'description' => 'The latest meditations and top picks from our team.',
                'items' => $this->getMeditationsByCategory('new_and_popular'),
            ],
            [
                'title' => 'Quick Meditations',
                'description' => 'Give yourself a moment to breathe.',
                'items' => $this->getMeditationsByCategory('quick'),
            ],
            [
                'title' => 'Courses and Singles',
                'description' => 'Guided meditations for any moment.',
                'items' => $this->getMeditationsByCategory('courses'),
            ],
        ];

        return Inertia::render('meditate', [
            'featuredMeditations' => $featuredMeditations,
            'todaysMeditation' => $todaysMeditation,
            'sections' => $sections,
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
