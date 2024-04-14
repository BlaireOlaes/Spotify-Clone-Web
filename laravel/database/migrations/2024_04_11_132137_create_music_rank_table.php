<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMusicRankTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('musicrank', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('music_id');
            $table->string('music_name');
            $table->unsignedBigInteger('music_playtime');
            $table->timestamps();

            $table->foreign('music_id')->references('id')->on('music');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('music_rank');
    }
}