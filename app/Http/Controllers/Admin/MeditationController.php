<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeditationSession;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Redirect;
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
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'section' => 'required|string|in:featured,today,new_popular,quick,courses,singles',
                'category' => 'required|string|max:255',
                'duration' => 'required|string',
                'description' => 'required|string',
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
                'video_url' => 'required|string',
                'is_featured' => 'required|in:0,1',
            ]);

            Log::info('MeditationController: Starting meditation creation', [
                'title' => $validated['title'],
                'video_url' => $validated['video_url'],
                'is_featured' => $validated['is_featured']
            ]);

            // Handle image upload
            if (!$request->hasFile('image') || !$request->file('image')->isValid()) {
                throw new \Exception('Invalid image file');
            }
            $imagePath = $request->file('image')->store('meditation-images', 'public');

            // Create the meditation session
            $meditation = MeditationSession::create([
                'title' => $validated['title'],
                'section' => $validated['section'],
                'category' => $validated['category'],
                'duration' => $validated['duration'],
                'description' => $validated['description'],
                'image_url' => Storage::url($imagePath),
                'video_url' => Storage::url($validated['video_url']),
                'is_featured' => (bool)$validated['is_featured'],
            ]);

            Log::info('MeditationController: Meditation created successfully', [
                'meditation_id' => $meditation->id,
                'image_url' => $meditation->image_url,
                'video_url' => $meditation->video_url
            ]);

            return redirect()->route('admin.meditations.index')
                ->with('success', 'Meditation session created successfully.');

        } catch (\Exception $e) {
            Log::error('MeditationController: Failed to create meditation', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create meditation session: ' . $e->getMessage()]);
        }
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

    public function uploadChunk(Request $request)
    {
        try {
            $chunk = $request->file('chunk');
            $chunkNumber = $request->input('chunk_number');
            $totalChunks = $request->input('total_chunks');
            $filename = $request->input('filename');

            // Create temporary directory if it doesn't exist
            $tempDir = storage_path('app/chunks/' . md5($filename));
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0777, true);
            }

            // Store the chunk
            $chunk->move($tempDir, "chunk_{$chunkNumber}");

            // If this is the last chunk, merge all chunks
            if ($chunkNumber == $totalChunks - 1) {
                $finalPath = storage_path('app/public/meditation-videos/' . $filename);
                $out = fopen($finalPath, "wb");

                for ($i = 0; $i < $totalChunks; $i++) {
                    $chunkPath = "{$tempDir}/chunk_{$i}";
                    $in = fopen($chunkPath, "rb");
                    stream_copy_to_stream($in, $out);
                    fclose($in);
                    unlink($chunkPath); // Delete the chunk
                }

                fclose($out);
                rmdir($tempDir); // Remove the temporary directory

                return response()->json([
                    'message' => 'Video uploaded successfully',
                    'path' => 'meditation-videos/' . $filename
                ]);
            }

            return response()->json(['message' => 'Chunk uploaded successfully']);

        } catch (\Exception $e) {
            Log::error('Chunk upload failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Failed to upload chunk: ' . $e->getMessage()
            ], 422);
        }
    }
}
