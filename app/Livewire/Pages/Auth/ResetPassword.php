<?php

namespace App\Livewire\Pages\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Illuminate\Support\Str;
use Livewire\Component;

#[Title('Reset Password')]
class ResetPassword extends Component
{
    public $token;

    public $email;

    public $password;

    public $password_confirmation;

    #[Url]
    public function render()
    {
        return view('livewire.pages.auth.reset-password');
    }

    public function mount($token)
    {
        $this->token = $token;

    }

    public function save()
    {
        try {
            $this->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            // Debug: Check if validation passed
            Log::info('Validation passed', [
                'email' => $this->email,
                'password' => $this->password,
                'password_confirmation' => $this->password_confirmation,
                'token' => $this->token,
            ]);

            $status = Password::reset([
                'email' => $this->email,
                'password' => $this->password,
                'password_confirmation' => $this->password_confirmation,
                'token' => $this->token,
            ], function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));

                // Debug: Log password reset
                Log::info('Password reset successfully for user: ' . $user->email);
            });

            // Debug: Log the status
            Log::info('Password reset status: ' . $status);

            if ($status === Password::PASSWORD_RESET) {
                return redirect('/login');
            } else {
                session()->flash('error', 'Something went wrong');
                // Debug: Log error message
                Log::error('Password reset failed with status: ' . $status);
            }
        } catch (\Exception $e) {
            // Catch any exceptions and log them
            Log::error('Error during password reset: ' . $e->getMessage());
            session()->flash('error', 'An unexpected error occurred. Please try again.');
        }
    }
}
