<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are sent to sign in before the account page', function () {
    $this->get('/account')->assertRedirect('/login');
});

test('a customer can open their account page', function () {
    $this->actingAs(User::factory()->create())
        ->get('/account')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Account')
            ->has('summary'));
});

test('a customer can update their profile', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $this->actingAs($user)
        ->from('/account')
        ->patch('/account', [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ])
        ->assertRedirect('/account');

    $user->refresh();

    expect($user->name)->toBe('New Name')
        ->and($user->email)->toBe('new@example.com');
});

test('a customer can change their password with the current password', function () {
    $user = User::factory()->create(['password' => 'password']);

    $this->actingAs($user)
        ->from('/account')
        ->patch('/account/password', [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertRedirect('/account');

    expect(Hash::check('new-password', $user->fresh()->password))->toBeTrue();
});

test('the current password must match to change the password', function () {
    $user = User::factory()->create(['password' => 'password']);

    $this->actingAs($user)
        ->from('/account')
        ->patch('/account/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ])
        ->assertSessionHasErrors('current_password');

    expect(Hash::check('password', $user->fresh()->password))->toBeTrue();
});
