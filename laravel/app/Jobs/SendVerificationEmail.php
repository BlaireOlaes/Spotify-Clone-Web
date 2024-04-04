<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class SendVerificationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    /**
     * Create a new job instance.
     *
     * @param  User  $user
     * @return void
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $verification = '/api/auth/' . $this->user->id;

        // Send verification email
        Mail::send('email', ['user' => $this->user, 'verification' => $verification], function ($message) {
            $message->from('Spotitube@gov.ph', 'Spotitube');
            $message->sender('Spotitube@listener.com', 'Spotitube');
            $message->to($this->user->email, $this->user->name);
            $message->subject('Spotitube - Email Verification');
            $message->priority(3);
        });
    }
}
