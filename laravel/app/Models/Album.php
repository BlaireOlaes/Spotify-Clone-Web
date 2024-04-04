<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    use HasFactory;

    protected $fillable = [
        'album_title',
        'genre',
        'user_id',
        'music_id',
        'image',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}