<?php

namespace App\Http\Controllers;

use App\Models\Music;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class MusicController extends Controller
{



    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'genre' => 'required',
            'album' => 'required',
            'file' => 'required|mimes:mp3|max:10240',
            'music_image' => 'required|mimes:jpeg,png,jpg,gif,svg|max:10240',
            'user_id' => 'required|exists:users,id',
        ]);

        $fileName = time() . '_' . uniqid() . '.' . $request->file->extension();
        $request->file->move(public_path('uploads'), $fileName);
        // Append the title of the music to the image file name
        $imageName = time() . '_' . $request->title . '.' . $request->music_image->extension();
        $request->music_image->move(public_path('uploads'), $imageName);

        $music = new Music;
        $music->title = $request->title;
        $music->genre = $request->genre;
        $music->album = $request->album;
        $music->file = $fileName;
        $music->music_image = $imageName;
        $music->user_id = $request->user_id;
        $music->save();

        return response()->json(['message' => 'Music uploaded successfully', 'id' => $music->id]);
    }


    public function getMusics()
    {
        $musics = Music::all();

        foreach ($musics as $music) {
            $music->file = asset('uploads/' . $music->file);
        }

        return response()->json($musics);
    }



    public function delete($id)
    {
        $music = Music::find($id);

        if ($music) {
            // Delete the music file from the server
            $file_path = public_path('uploads/' . $music->file);
            if (file_exists($file_path)) {
                unlink($file_path);
            }

            // Delete the image file from the server
            $image_path = public_path('uploads/' . $music->music_image); // Update this line
            if (file_exists($image_path)) {
                unlink($image_path); // Update this line
            }

            $music->delete();
            return response()->json(['message' => 'Music and files deleted successfully']);
        } else {
            return response()->json(['message' => 'Music not found'], 404);
        }
    }



    public function getMusicFile($filename)
    {
        $path = public_path('uploads/' . $filename);

        // Check if the file exists
        if (!file_exists($path)) {
            abort(404);
        }

        // Set the Content-Type header explicitly
        $headers = [
            'Content-Type' => 'audio/mpeg',
        ];

        // Return the file response with the appropriate headers
        return Response::download($path, $filename, $headers);
    }
}