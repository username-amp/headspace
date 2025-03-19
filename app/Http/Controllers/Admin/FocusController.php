<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FocusSession;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Redirect;
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
            'soundscapes' => 'Soundscapes',
        ];

        $types = [
            'binaural' => 'Binaural Beats',
            'music' => 'Focus Music',
            'soundscape' => 'Nature Soundscape',
        ];

        return Inertia::render('admin/focus/create', [
            'sections' => $sections,
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:binaural,music,soundscape',
            'section' => 'required|string|in:featured,binaural_beats,focus_music,soundscapes',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'audio_path' => 'required|string',
        ]);

        try {
            $imagePath = $request->file('image')->store('focus-images', 'public');
            
            // Verify that the chunked audio file exists
            $audioPath = $validated['audio_path'];
            if (!Storage::disk('public')->exists($audioPath)) {
                throw new \Exception('Audio file not found');
            }

            FocusSession::create([
                'title' => $validated['title'],
                'type' => $validated['type'],
                'section' => $validated['section'],
                'category' => $validated['category'],
                'duration' => $validated['duration'],
                'description' => $validated['description'],
                'image_url' => Storage::url($imagePath),
                'audio_url' => Storage::url($audioPath),
                'is_featured' => $request->has('is_featured'),
            ]);

            return redirect()->route('admin.focus.index')
                ->with('success', 'Focus session created successfully.');
        } catch (\Exception $e) {
            // Clean up any uploaded files if there's an error
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            
            Log::error('Failed to create focus session', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create focus session: ' . $e->getMessage()]);
        }
    }

    public function edit(FocusSession $focusSession)
    {
        $sections = [
            'featured' => 'Featured',
            'binaural_beats' => 'Binaural Beats',
            'focus_music' => 'Focus Music',
            'soundscapes' => 'Soundscapes',
        ];

        $types = [
            'binaural' => 'Binaural Beats',
            'music' => 'Focus Music',
            'soundscape' => 'Nature Soundscape',
        ];

        return Inertia::render('admin/focus/edit', [
            'focusSession' => $focusSession,
            'sections' => $sections,
            'types' => $types,
        ]);
    }

    public function update(Request $request, FocusSession $focusSession)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:binaural,music,soundscape',
            'section' => 'required|string|in:featured,binaural_beats,focus_music,soundscapes',
            'category' => 'required|string|max:255',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'audio' => 'nullable|mimes:mp3,wav,ogg|max:51200', // 50MB max
        ]);

        if ($request->hasFile('image')) {
            Storage::delete(str_replace('/storage/', 'public/', $focusSession->image_url));
            $imagePath = $request->file('image')->store('focus-images', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        if ($request->hasFile('audio')) {
            Storage::delete(str_replace('/storage/', 'public/', $focusSession->audio_url));
            $audioPath = $request->file('audio')->store('focus-audio/' . $validated['type'], 'public');
            $validated['audio_url'] = Storage::url($audioPath);
        }

        $focusSession->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'section' => $validated['section'],
            'category' => $validated['category'],
            'duration' => $validated['duration'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? $focusSession->image_url,
            'audio_url' => $validated['audio_url'] ?? $focusSession->audio_url,
            'is_featured' => $request->has('is_featured'),
        ]);

        return redirect()->route('admin.focus.index')
            ->with('success', 'Focus session updated successfully.');
    }

    public function destroy(FocusSession $focusSession)
    {
        try {
            DB::beginTransaction();

            // Delete the focus session (this will trigger the soft delete)
            $focusSession->delete();

            DB::commit();

            return redirect()->route('admin.focus.index')
                ->with('success', 'Focus session deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.focus.index')
                ->with('error', 'Failed to delete focus session: ' . $e->getMessage());
        }
    }

    public function forceDelete(FocusSession $focusSession)
    {
        try {
            DB::beginTransaction();

            // Delete associated user progress
            UserProgress::where('focus_session_id', $focusSession->id)->delete();

            // Delete the files
            if ($focusSession->image_url) {
                Storage::delete(str_replace('/storage/', 'public/', $focusSession->image_url));
            }
            if ($focusSession->audio_url) {
                Storage::delete(str_replace('/storage/', 'public/', $focusSession->audio_url));
            }

            // Force delete the focus session
            $focusSession->forceDelete();

            DB::commit();

            return redirect()->route('admin.focus.index')
                ->with('success', 'Focus session permanently deleted.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('admin.focus.index')
                ->with('error', 'Failed to permanently delete focus session: ' . $e->getMessage());
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
                $finalPath = storage_path('app/public/focus-audio/' . $filename);
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
                    'message' => 'Audio uploaded successfully',
                    'path' => 'focus-audio/' . $filename
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
