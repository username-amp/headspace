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
            ->featured()
            ->take(4)
            ->get()
            ->map(fn ($session) => [
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
                'icon' => $this->getIconForType($session->type),
            ]);

        // Get sections with their focus content
        $sections = [
            [
                'title' => 'Binaural Beats',
                'description' => 'A special collection of harmonic frequencies — scientifically proven to enhance focus, relaxation, and calm',
                'items' => $this->getFocusContentByCategory('binaural_beats'),
            ],
            [
                'title' => 'Focus Music',
                'description' => 'Find and keep focus with music from world-renowned artists',
                'items' => $this->getFocusContentByCategory('focus_music'),
            ],
            [
                'title' => 'Soundscapes',
                'description' => '3D recordings from the world\'s loveliest places',
                'items' => $this->getFocusContentByCategory('soundscapes'),
            ],
        ];

        return Inertia::render('focus', [
            'featuredItems' => $featuredItems,
            'sections' => $sections,
        ]);
    }

    private function getFocusContentByCategory(string $category): array
    {
        return FocusSession::query()
            ->byCategory($category)
            ->take(2)
            ->get()
            ->map(fn ($session) => [
                'title' => $session->title,
                'type' => $session->type,
                'duration' => $session->duration,
                'image' => $session->image_url,
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
