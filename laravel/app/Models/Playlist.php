<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = ['playlist_title', 'user_id', 'music_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}