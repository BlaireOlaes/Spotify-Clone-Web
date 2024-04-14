<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MusicRank extends Model
{
    use HasFactory;

    protected $table = 'musicrank'; // replace 'your_table_name' with the actual table name

    protected $fillable = ['music_id', 'music_name', 'music_playtime'];
}