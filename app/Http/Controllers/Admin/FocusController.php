<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FocusSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FocusController extends Controller
{
    public function index()
    {
        $focusSessions = FocusSession::orderBy('created_at', 'desc')
            ->withCount(['userProgress'])
            ->paginate(10);

            return Inertia::render('admin/focus/index', [
                'focusSessions' => $focusSessions,
            ]);
    }

    public function create()
    {
        $sections = [
            'featured' => 'Featured',
            'binaural_beats' => 'Binaural Beats',
            'focus_music' => 'Focus Music',
            'soundscapes' => 'Soundscapes'
        ];

        return Inertia::render('admin/focus/create', [
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'section' => 'required|string|in:featured,binaural_beats,focus_music,soundscapes',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'audio' => 'required|mimes:mp3,wav|max:20480',
        ]);

        $imagePath = $request->file('image')->store('focus-images', 'public');
        $audioPath = $request->file('audio')->store('focus-audio', 'public');

        FocusSession::create([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => Storage::url($imagePath),
            'audio_url' => Storage::url($audioPath),
            'is_featured' => $request->has('is_featured'),
        ]);

        return Inertia::render('admin/focus/index', [
            'focusSessions' => $focusSession->refresh()->withCount(['userProgress'])->paginate(10),
        ]);
    }

    public function edit(FocusSession $focusSession)
    {
        $sections = [
            'featured' => 'Featured',
            'binaural_beats' => 'Binaural Beats',
            'focus_music' => 'Focus Music',
            'soundscapes' => 'Soundscapes'
        ];

        return Inertia::render('admin/focus/edit', [
            'focusSession' => $focusSession,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, FocusSession $focusSession)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'section' => 'required|string|in:featured,binaural_beats,focus_music,soundscapes',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'audio' => 'nullable|mimes:mp3,wav|max:20480',
        ]);

        if ($request->hasFile('image')) {
            Storage::delete(str_replace('/storage/', 'public/', $focusSession->image_url));
            $imagePath = $request->file('image')->store('focus-images', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        if ($request->hasFile('audio')) {
            Storage::delete(str_replace('/storage/', 'public/', $focusSession->audio_url));
            $audioPath = $request->file('audio')->store('focus-audio', 'public');
            $validated['audio_url'] = Storage::url($audioPath);
        }

        $focusSession->update([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? $focusSession->image_url,
            'audio_url' => $validated['audio_url'] ?? $focusSession->audio_url,
            'is_featured' => $request->has('is_featured'),
        ]);

        return Inertia::render('admin/focus/index', [
            'focusSessions' => $focusSession->refresh()->withCount(['userProgress'])->paginate(10),
        ]);
    }

    public function destroy(FocusSession $focusSession)
    {
        Storage::delete(str_replace('/storage/', 'public/', $focusSession->image_url));
        Storage::delete(str_replace('/storage/', 'public/', $focusSession->audio_url));
        $focusSession->delete();

        return Inertia::render('admin/focus/index', [
            'focusSessions' => $focusSession->refresh()->withCount(['userProgress'])->paginate(10),
        ]);
    }
}
