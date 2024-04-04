<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\PlaylistController;
use App\Http\Controllers\AlbumController;
use App\Http\Controllers\GenreController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Temporary fix
// Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/user', function (Request $request) {
    return $request->user();
});

#Route Email Verification Disabled
Route::get('/auth/{id}', [RegisteredUserController::class, 'verifyEmail']);
Route::get('/sendVerificationEmail/{id}', [RegisteredUserController::class, 'sendVerificationEmail']);

Route::get('/accounts', [AccountController::class, 'fetchaccount']);

Route::get('/accountsall', [AccountController::class, 'fetchaccountall']);

Route::post('/requestArtist/{id}', [AccountController::class, 'requestArtist']);

Route::get('/csrf-token', function () {
    return csrf_token();
});

Route::post('/declineArtist/{id}', [AccountController::class, 'declineArtist']);

Route::post('/acceptArtist/{id}', [AccountController::class, 'acceptArtist']);

Route::post('/accountBanned/{id}', [AccountController::class, 'accountBanned']);

Route::post('/accountUnban/{id}', [AccountController::class, 'accountUnban']);

Route::post('/uploadMusic', [MusicController::class, 'store']);

Route::get('/musics', [MusicController::class, 'getMusics']);

Route::post('/playlists', [PlaylistController::class, 'store']);

Route::get('/playlistsall', [PlaylistController::class, 'fetchplaylistsall']);

Route::get('/playlists/{id}', [PlaylistController::class, 'fetchPlaylistById']);

Route::put('/playlistsupdate/{id}', [PlaylistController::class, 'update']);

Route::delete('/playlists/{id}', [PlaylistController::class, 'delete']);

Route::delete('/musics/{id}', [MusicController::class, 'delete']);

Route::post('/uploadAlbum', [AlbumController::class, 'store']);

Route::get('/albums', [AlbumController::class, 'index']);
Route::get('/albums/{id}', [AlbumController::class, 'fetchAlbumlistById']);

Route::delete('/albums/{id}', [AlbumController::class, 'delete']);

Route::put('/albumsupdate/{id}', [AlbumController::class, 'update']);

Route::get('/genres', [GenreController::class, 'index']);

Route::get('/audio/{filename}', [App\Http\Controllers\AudioController::class, 'serveAudio']);

Route::get('/music/{filename}', [MusicController::class, 'getMusicFile']);
