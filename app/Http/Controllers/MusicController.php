<?php

namespace App\Http\Controllers;

use App\Models\FocusSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MusicController extends Controller
{
    public function index(Request $request): Response
    {
        $tracks = FocusSession::query()
            ->select(['id', 'title', 'type', 'duration', 'audio_url'])
            ->whereNotNull('audio_url')
            ->get()
            ->map(fn ($track) => [
                'id' => $track->id,
                'title' => $track->title,
                'type' => $track->type,
                'duration' => $track->duration,
                'audio_url' => $track->audio_url,
            ]);

        return Inertia::render('music', [
            'tracks' => $tracks,
            'track' => $request->query('track'),
        ]);
    }
}
