<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeditationSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeditationController extends Controller
{
    public function index()
    {
        $meditations = MeditationSession::orderBy('created_at', 'desc')
            ->withCount(['userMeditations'])
            ->paginate(10);

            return Inertia::render('admin/meditations/index', [
                'meditations' => $meditations,
            ]);
    }

    public function create()
    {
        $sections = [
            'featured' => 'Featured Meditations',
            'today' => 'Today\'s Meditation',
            'new_popular' => 'New and Popular',
            'quick' => 'Quick Meditations',
            'courses' => 'Courses',
            'singles' => 'Singles'
        ];

        return Inertia::render('admin/meditations/create', [
            'sections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'section' => 'required|string|in:featured,today,new_popular,quick,courses,singles',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'audio' => 'required|mimes:mp3,wav|max:20480',
        ]);

        $imagePath = $request->file('image')->store('meditation-images', 'public');
        $audioPath = $request->file('audio')->store('meditation-audio', 'public');

        MeditationSession::create([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => Storage::url($imagePath),
            'audio_url' => Storage::url($audioPath),
            'is_featured' => $request->has('is_featured'),
        ]);

        return Inertia::render('admin/meditations/index', [
            'meditations' => $meditation->refresh()->withCount(['userMeditations'])->paginate(10),
        ]);
    }

    public function edit(MeditationSession $meditation)
    {
        $sections = [
            'featured' => 'Featured Meditations',
            'today' => 'Today\'s Meditation',
            'new_popular' => 'New and Popular',
            'quick' => 'Quick Meditations',
            'courses' => 'Courses',
            'singles' => 'Singles'
        ];

        return Inertia::render('admin/meditations/edit', [
            'meditation' => $meditation,
            'sections' => $sections,
        ]);
    }

    public function update(Request $request, MeditationSession $meditation)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'section' => 'required|string|in:featured,today,new_popular,quick,courses,singles',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'audio' => 'nullable|mimes:mp3,wav|max:20480',
        ]);

        if ($request->hasFile('image')) {
            Storage::delete(str_replace('/storage/', 'public/', $meditation->image_url));
            $imagePath = $request->file('image')->store('meditation-images', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        if ($request->hasFile('audio')) {
            Storage::delete(str_replace('/storage/', 'public/', $meditation->audio_url));
            $audioPath = $request->file('audio')->store('meditation-audio', 'public');
            $validated['audio_url'] = Storage::url($audioPath);
        }

        $meditation->update([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? $meditation->image_url,
            'audio_url' => $validated['audio_url'] ?? $meditation->audio_url,
            'is_featured' => $request->has('is_featured'),
        ]);

        return Inertia::render('admin/meditations/index', [
            'meditations' => $meditation->refresh()->withCount(['userMeditations'])->paginate(10),
        ]);
    }

    public function destroy(MeditationSession $meditation)
    {
        Storage::delete(str_replace('/storage/', 'public/', $meditation->image_url));
        Storage::delete(str_replace('/storage/', 'public/', $meditation->audio_url));
        $meditation->delete();

        return Inertia::render('admin/meditations/index', [
            'meditations' => $meditation->refresh()->withCount(['userMeditations'])->paginate(10),
        ]);
    }
}
