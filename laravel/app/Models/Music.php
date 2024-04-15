<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Music extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'genre',
        'album',
        'file',
        'user_id',
    ];

    /**
     * Get the music ranks for the music.
     */
    public function musicRanks()
    {
        return $this->hasMany('App\Models\MusicRank', 'music_id');
    }
}