<?php

namespace App\Livewire\Pages\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Register')]
class Register extends Component
{
    public $name;

    public $email;

    public $password;

    public function render()
    {
        return view('livewire.pages.auth.register');
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|max:255',
            'email' => 'required|unique:users|email|max:255',
            'password' => 'required|min:8|max:255',
        ]);
        $user = User::create([
            'name' => $this->name,
            'email' => $this->email,
            'password' => Hash::make($this->password),
        ]);

        auth()->login($user);

        return redirect()->intended();

    }
}
