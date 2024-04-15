<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSoftDeletesToAlbumsTable extends Migration
{
    public function up()
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::table('albums', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}