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

    private function getMeditationsByCategory(string $category): array
    {
        return MeditationSession::query()
            ->byCategory($category)
            ->take(3)
            ->get()
            ->map(fn ($session) => [
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
