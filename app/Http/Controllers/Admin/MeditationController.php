<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeditationSession;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeditationController extends Controller
{
    public function index()
    {
        $meditationSessions = MeditationSession::orderBy('created_at', 'desc')
            ->withCount(['userProgress', 'userMeditations'])
            ->paginate(10);

        return Inertia::render('admin/meditations/index', [
            'meditationSessions' => $meditationSessions,
        ]);
    }

    public function create()
    {
        $sections = [
            'featured' => 'Featured',
            'today' => "Today's Meditation",
            'new_popular' => 'New and Popular',
            'quick' => 'Quick Meditations',
            'courses' => 'Courses',
            'singles' => 'Singles',
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
            'video' => 'required|mimes:mp4,mov,avi|max:102400', // 100MB max
        ]);

        $imagePath = $request->file('image')->store('meditation-images', 'public');
        $videoPath = $request->file('video')->store('meditation-videos', 'public');

        MeditationSession::create([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => Storage::url($imagePath),
            'video_url' => Storage::url($videoPath),
            'is_featured' => $request->has('is_featured'),
        ]);

        return redirect()->route('admin.meditations.index')
            ->with('success', 'Meditation session created successfully.');
    }

    public function edit(MeditationSession $meditation)
    {
        $sections = [
            'featured' => 'Featured',
            'today' => "Today's Meditation",
            'new_popular' => 'New and Popular',
            'quick' => 'Quick Meditations',
            'courses' => 'Courses',
            'singles' => 'Singles',
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
            'video' => 'nullable|mimes:mp4,mov,avi|max:102400', // 100MB max
        ]);

        if ($request->hasFile('image')) {
            Storage::delete(str_replace('/storage/', 'public/', $meditation->image_url));
            $imagePath = $request->file('image')->store('meditation-images', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        if ($request->hasFile('video')) {
            Storage::delete(str_replace('/storage/', 'public/', $meditation->video_url));
            $videoPath = $request->file('video')->store('meditation-videos', 'public');
            $validated['video_url'] = Storage::url($videoPath);
        }

        $meditation->update([
            'title' => $validated['title'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? $meditation->image_url,
            'video_url' => $validated['video_url'] ?? $meditation->video_url,
            'is_featured' => $request->has('is_featured'),
        ]);

        return redirect()->route('admin.meditations.index')
            ->with('success', 'Meditation session updated successfully.');
    }

    public function destroy(MeditationSession $meditation)
    {
        try {
            DB::beginTransaction();

            // Delete the meditation session (this will trigger the soft delete)
            $meditation->delete();

            DB::commit();

            return redirect()->route('admin.meditations.index')
                ->with('success', 'Meditation session deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.meditations.index')
                ->with('error', 'Failed to delete meditation session: ' . $e->getMessage());
        }
    }

    public function forceDelete(MeditationSession $meditation)
    {
        try {
            DB::beginTransaction();

            // Delete associated user progress
            UserProgress::where('meditation_session_id', $meditation->id)->delete();

            // Delete the files
            if ($meditation->image_url) {
                Storage::delete(str_replace('/storage/', 'public/', $meditation->image_url));
            }
            if ($meditation->video_url) {
                Storage::delete(str_replace('/storage/', 'public/', $meditation->video_url));
            }

            // Force delete the meditation session
            $meditation->forceDelete();

            DB::commit();

            return redirect()->route('admin.meditations.index')
                ->with('success', 'Meditation session permanently deleted.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.meditations.index')
                ->with('error', 'Failed to permanently delete meditation session: ' . $e->getMessage());
        }
    }
}
