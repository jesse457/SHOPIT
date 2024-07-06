<?php

namespace App\Livewire\Pages\Auth;

use Illuminate\Support\Facades\Password;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Forgot Password')]
class ForgotPassword extends Component
{
    public $email;


    public function save()
    {

        $this->validate([
            'email' => 'required|email|exists:users,email|max:255',

        ]);
        $status = Password::sendResetLink(['email' => $this->email]);
     
        if ($status === Password::RESET_LINK_SENT) {
            session()->flash('success', 'Password reset link has been sent to your email');
            $this->email;
        }
    }

    public function render()
    {
        return view('livewire.pages.auth.forgot-password');
    }
}
