<?php
// app/Http/Controllers/MusicRankController.php

namespace App\Http\Controllers;

use App\Models\MusicRank;
use Illuminate\Http\Request;

class MusicRankController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'music_id' => 'required|exists:music,id',
            'music_name' => 'required',
            'music_playtime' => 'required|numeric',
        ]);

        $musicRank = MusicRank::where('music_id', $request->music_id)->first();

        if ($musicRank) {
            // If a record with the same music_id exists, update the music_playtime
            $musicRank->music_playtime += $request->music_playtime;
        } else {
            // If no record with the same music_id exists, create a new one
            $musicRank = new MusicRank;
            $musicRank->music_id = $request->music_id;
            $musicRank->music_name = $request->music_name;
            $musicRank->music_playtime = $request->music_playtime;
        }

        $musicRank->save();

        return response()->json(['message' => 'Music rank data saved successfully']);
    }


    public function fetchMusicRank()
    {
        $musicRanks = MusicRank::all();
        return response()->json($musicRanks);
    }

}



