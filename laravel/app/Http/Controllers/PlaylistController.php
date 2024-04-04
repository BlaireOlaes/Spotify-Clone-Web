<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Playlist;

class PlaylistController extends Controller
{
    public function store(Request $request)
    {
        $playlist = new Playlist;
        $playlist->playlist_title = $request->playlist_title;
        $playlist->user_id = $request->user_id;
        $playlist->music_id = json_encode($request->music_id);

        $playlist->save();

        return response()->json(['message' => 'Playlist created successfully'], 200);
    }

    public function fetchplaylistsall()
    {
        $playlists = Playlist::all();
        return response()->json($playlists, 200);
    }

    public function fetchPlaylistById($id)
    {
        $playlist = Playlist::find($id);
        return response()->json($playlist, 200);
    }

    public function update(Request $request, $id)
    {
        $playlist = Playlist::find($id);

        if (!$playlist) {
            return response()->json(['message' => 'Playlist not found'], 404);
        }

        $music_ids = $request->get('music_id');

        if ($music_ids) {
            $existing_music_ids = json_decode($playlist->music_id, true); // Decode the JSON string into an array
            $playlist->music_id = json_encode(array_merge($existing_music_ids, $music_ids)); // Merge the arrays and encode back into a JSON string
        }

        $playlist->save();

        return response()->json(['message' => 'Playlist Successfully Updated'], 200);
    }

    public function delete($id)
    {
        $playlist = Playlist::find($id);

        if (!$playlist) {
            return response()->json(['message' => 'Playlist not found'], 404);
        }

        $playlist->delete();

        return response()->json(['message' => 'Playlist deleted successfully'], 200);
    }



}