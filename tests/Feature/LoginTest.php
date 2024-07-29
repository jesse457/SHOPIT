<?php

namespace Tests\Feature;

use Livewire\Livewire;
use App\Livewire\Pages\Auth\Login;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function auth_attempt_with_invalid_credentials_and_flash_error_message()
    {
        // Create a user with valid credentials
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'), // Ensure password is hashed
        ]);

        // Test with invalid credentials
        $this->attemptLogin('invalid@email.com', 'wrong-password');
        $this->attemptLogin('invalid-email', 'password');
        $this->attemptLogin('', 'password');
        $this->attemptLogin('test@example.com', '');
        $this->attemptLogin('test@example.com', 'pw');
    }

    private function attemptLogin($email, $password)
    {
        Livewire::test(Login::class)
            ->set('email', $email)
            ->set('password', $password)
            ->call('save')
            ->assertSessionHas('error', 'Invalid credentials')
            ->assertRedirect('/');
    }
}
