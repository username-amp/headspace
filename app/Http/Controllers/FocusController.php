<?php

namespace App\Http\Controllers;

use App\Models\FocusSession;
use Inertia\Inertia;
use Inertia\Response;

class FocusController extends Controller
{
    public function index(): Response
    {
        // Get featured focus items
        $featuredItems = FocusSession::query()
            ->where('section', 'featured')
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
                'audio_url' => $session->audio_url,
                'icon' => $this->getIconForType($session->type),
            ]);

        // Get sections with their focus content
        $sections = [
            [
                'title' => 'Binaural Beats',
                'description' => 'A special collection of harmonic frequencies — scientifically proven to enhance focus, relaxation, and calm',
                'items' => $this->getFocusContentBySection('binaural_beats'),
            ],
            [
                'title' => 'Focus Music',
                'description' => 'Find and keep focus with music from world-renowned artists',
                'items' => $this->getFocusContentBySection('focus_music'),
            ],
            [
                'title' => 'Soundscapes',
                'description' => '3D recordings from the world\'s loveliest places',
                'items' => $this->getFocusContentBySection('soundscapes'),
            ],
        ];

        return Inertia::render('focus', [
            'featuredItems' => $featuredItems,
            'sections' => $sections,
        ]);
    }

    private function getFocusContentBySection(string $section): array
    {
        return FocusSession::query()
            ->where('section', $section)
            ->get()
            ->map(fn ($session) => [
                'id' => $session->id,
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
                'audio_url' => $session->audio_url,
                'icon' => $this->getIconForType($session->type),
            ])
            ->toArray();
    }

    private function getIconForType(?string $type): string
    {
        if (is_null($type)) {
            return 'meditation';
        }

        return match ($type) {
            'binaural', 'music', 'soundscape' => 'music',
            default => 'meditation',
        };
    }
}
