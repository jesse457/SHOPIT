<?php

namespace App\Livewire\Pages\Auth;

use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Login')]
class Login extends Component
{
    public $password;

    public $email;

    public function render()
    {
        return view('livewire.pages.auth.login');
    }

    public function save()
    {
        $this->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|min:2|max:255',
        ]);

        if (!auth()->attempt(['email' => $this->email, 'password' => $this->password])) {
            session()->flash('error', 'Invalid credentials');
            return session()->flash('error', 'Invalid credentials');
        }

        return redirect()->intended();
    }
}
