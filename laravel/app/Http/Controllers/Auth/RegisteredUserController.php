<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Mail;
use App\Jobs\SendVerificationEmail; 


class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        // Disabled Send verification email
        $verification = '/api/auth/' . $user->id;
        Mail::send('email', ['user' => $user, 'verification' => $verification], function ($message) use ($user) {
            $message->from('Spotitube@gov.ph', 'Spotitube');
            $message->sender('Spotitube@listener.com', 'Spotitube');
            $message->to($user->email, $user->name); // Use user's email and name dynamically
            $message->subject('Spotitube - Email Verification');
            $message->priority(3);
        });

        Auth::login($user);

        return response()->noContent();
    }


    public function verifyEmail(Request $request, $id)
    {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return "User Not Found";
        }

        // Update the user's verified_at column
        $user->email_verified_at = now();
        $user->save();

        return redirect('http://localhost:5173/');
    }


    public function sendVerificationEmail($id)
    {
        $user = User::find($id);

        if (!$user) {
            return "User Not Found";
        }

        // Dispatch the job
        SendVerificationEmail::dispatch($user);

        return response()->noContent();
    }

}
