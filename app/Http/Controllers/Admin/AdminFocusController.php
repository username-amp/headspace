<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminFocusController extends Controller
{
    /**
     * Handle chunked file upload
     */
    public function uploadChunk(Request $request)
    {
        $request->validate([
            'chunk' => 'required|file',
            'chunk_number' => 'required|integer',
            'total_chunks' => 'required|integer',
            'filename' => 'required|string',
        ]);

        $chunk = $request->file('chunk');
        $chunkNumber = $request->input('chunk_number');
        $totalChunks = $request->input('total_chunks');
        $originalFilename = $request->input('filename');

        // Create temporary directory if it doesn't exist
        $tempDir = storage_path('app/temp/chunks/' . md5($originalFilename));
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        // Store the chunk
        $chunk->move($tempDir, "chunk_{$chunkNumber}");

        // If this is the last chunk, merge all chunks
        if ($chunkNumber == $totalChunks - 1) {
            $finalPath = storage_path('app/public/focus-audio/' . $originalFilename);
            $out = fopen($finalPath, "wb");

            // Merge all chunks
            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkPath = $tempDir . "/chunk_{$i}";
                $in = fopen($chunkPath, "rb");
                stream_copy_to_stream($in, $out);
                fclose($in);
                unlink($chunkPath); // Delete the chunk
            }

            fclose($out);
            rmdir($tempDir); // Remove the temporary directory

            return response()->json([
                'message' => 'File uploaded successfully',
                'path' => 'focus-audio/' . $originalFilename
            ]);
        }

        return response()->json([
            'message' => 'Chunk uploaded successfully'
        ]);
    }
} 