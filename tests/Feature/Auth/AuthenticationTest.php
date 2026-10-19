<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Inertia\Testing\AssertableInertia as Assert;

test('the sign in page renders', function () {
    $this->get('/login')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
});

test('a customer can sign in', function () {
    $user = User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'password',
    ]);

    $this->post('/login', [
        'email' => 'customer@example.com',
        'password' => 'password',
    ])->assertRedirect('/');

    $this->assertAuthenticatedAs($user);
});

test('an administrator is sent to the admin dashboard', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $this->post('/login', [
        'email' => 'admin@example.com',
        'password' => 'password',
    ])->assertRedirect('/admin');

    $this->assertAuthenticatedAs($admin);
});

test('invalid credentials are rejected', function () {
    User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'password',
    ]);

    $this->from('/login')
        ->post('/login', [
            'email' => 'customer@example.com',
            'password' => 'wrong-password',
        ])
        ->assertRedirect('/login')
        ->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('login attempts are rate limited', function () {
    User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'password',
    ]);

    for ($attempt = 0; $attempt < 5; $attempt++) {
        $this->post('/login', [
            'email' => 'customer@example.com',
            'password' => 'wrong-password',
        ]);
    }

    $this->post('/login', [
        'email' => 'customer@example.com',
        'password' => 'wrong-password',
    ])->assertTooManyRequests();
});

test('a new customer can register', function () {
    $response = $this->post('/register', [
        'name' => 'Ariane Tchoumi',
        'email' => 'ariane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect('/');

    $user = User::query()->where('email', 'ariane@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->is_admin)->toBeFalse();

    $this->assertAuthenticatedAs($user);
});

test('customers can sign out', function () {
    $this->actingAs(User::factory()->create())
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});

test('a reset link is sent without revealing whether the account exists', function () {
    Notification::fake();

    $user = User::factory()->create(['email' => 'customer@example.com']);

    $this->post('/forgot-password', ['email' => 'customer@example.com'])
        ->assertSessionHas('status');

    Notification::assertSentTo($user, ResetPassword::class);

    $this->post('/forgot-password', ['email' => 'missing@example.com'])
        ->assertSessionHas('status');

    Notification::assertSentToTimes($user, ResetPassword::class, 1);
});

test('a customer can reset their password', function () {
    $user = User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'old-password',
    ]);

    $token = Password::createToken($user);

    $this->post('/reset-password', [
        'token' => $token,
        'email' => 'customer@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertRedirect('/login');

    expect(Hash::check('new-password', $user->fresh()->password))->toBeTrue();
});

test('a password reset with an invalid token is rejected', function () {
    $user = User::factory()->create([
        'email' => 'customer@example.com',
        'password' => 'old-password',
    ]);

    $this->post('/reset-password', [
        'token' => 'not-a-real-token',
        'email' => $user->email,
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertSessionHasErrors('email');

    expect(Hash::check('old-password', $user->fresh()->password))->toBeTrue();
});
