<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AccountController extends Controller
{
    public function fetchaccount()
    {
        // Fetch users where artistreq is true
        $users = User::where('artistreq', true)->get();
        return response()->json($users);
    }

    public function fetchaccountall()
    {
        // Fetch all users
        $users = User::all();
        return response()->json($users);
    }

    public function requestArtist($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->artistreq = true;
            $user->save();
            return response()->json(['message' => 'Request sent successfully']);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function acceptArtist($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->artistreq = false;
            $user->artist = true;
            $user->save();

            $acceptartist = '/api/acceptArtist/' . $user->id;

            // Send verification email
            Mail::send('accept', ['user' => $user, 'Account Accepted' => $acceptartist], function ($message) use ($user) {
                $message->from('Spotitube@gov.ph', 'Spotitube');
                $message->sender('Spotitube@listener.com', 'Spotitube');
                $message->to($user->email, $user->name);
                $message->subject('Spotitube - Account Accepted');
                $message->priority(3);
            });

            return response()->json(['message' => 'Account Declined successfully']);
        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function declineArtist($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->artistreq = false;
            $user->save();

            $declineArtist = '/api/declineArtist/' . $user->id;

            // Send verification email
            Mail::send('declined', ['user' => $user, 'Account Declined' => $declineArtist], function ($message) use ($user) {
                $message->from('Spotitube@gov.ph', 'Spotitube');
                $message->sender('Spotitube@listener.com', 'Spotitube');
                $message->to($user->email, $user->name);
                $message->subject('Spotitube - Account Declined');
                $message->priority(3);
            });

            return response()->json(['message' => 'Account Declined successfully']);

        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function accountBanned($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->banned = true;
            $user->save();

            $accountBanned = '/api/accountBanned/' . $user->id;

            // Send verification email
            Mail::send('banned', ['user' => $user, 'Account Banned' => $accountBanned], function ($message) use ($user) {
                $message->from('Spotitube@gov.ph', 'Spotitube');
                $message->sender('Spotitube@listener.com', 'Spotitube');
                $message->to($user->email, $user->name);
                $message->subject('Spotitube - Account Banned');
                $message->priority(3);
            });

            return response()->json(['message' => 'Account Banned successfully']);

        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function accountUnban($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->banned = false;
            $user->save();

            $accountUnban = '/api/accountUnban/' . $user->id;

            // Send verification email
            Mail::send('unban', ['user' => $user, 'Account Unban' => $accountUnban], function ($message) use ($user) {
                $message->from('Spotitube@gov.ph', 'Spotitube');
                $message->sender('Spotitube@listener.com', 'Spotitube');
                $message->to($user->email, $user->name);
                $message->subject('Spotitube - Account Banned');
                $message->priority(3);
            });

            return response()->json(['message' => 'Account Banned successfully']);

        } else {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

}