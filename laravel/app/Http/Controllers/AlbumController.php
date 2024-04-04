<?php

namespace App\Http\Controllers;

use App\Models\Album;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'album_title' => 'required',
            'genre' => 'required',
            'user_id' => 'required|exists:users,id',
            'music_id' => 'required|array',
            'image' => 'required|mimes:jpeg,png,jpg,gif,svg|max:10240',
        ]);

        $imageName = time() . '.' . $request->image->extension();
        $request->image->move(public_path('uploads'), $imageName);

        $album = new Album;
        $album->album_title = $request->album_title;
        $album->genre = $request->genre;
        $album->user_id = $request->user_id;
        $album->music_id = json_encode($request->music_id);
        $album->image = $imageName;
        $album->save();

        return response()->json(['message' => 'Album created successfully']);
    }

    public function index()
    {
        $albums = Album::all();
        return response()->json($albums);
    }

    
    public function fetchAlbumlistById($id)
    {
        $album = Album::find($id);
        return response()->json($album, 200);
    }

    public function delete($id)
    {
        $Album = Album::find($id);

        if (!$Album) {
            return response()->json(['message' => 'Album not found'], 404);
        }

        $Album->delete();

        return response()->json(['message' => 'Album deleted successfully'], 200);
    }


    public function update(Request $request, $id)
    {
        $Album = Album::find($id);

        if (!$Album) {
            return response()->json(['message' => 'Album not found'], 404);
        }

        $music_ids = $request->get('music_id');

        if ($music_ids) {
            $existing_music_ids = json_decode($Album->music_id, true); // Decode the JSON string into an array
            $Album->music_id = json_encode(array_merge($existing_music_ids, $music_ids)); // Merge the arrays and encode back into a JSON string
        }

        $Album->save();

        return response()->json(['message' => 'Album Successfully Updated'], 200);
    }
}

