<?php

use App\Models\User;
use App\Models\Visitor;

test('public pages are tracked once per path and window', function () {
    $this->get('/')->assertSuccessful();
    $this->get('/')->assertSuccessful();
    $this->get('/products')->assertSuccessful();

    expect(Visitor::query()->count())->toBe(2)
        ->and(Visitor::query()->where('path', '/')->count())->toBe(1)
        ->and(Visitor::query()->where('path', '/products')->count())->toBe(1);
});

test('admin pages are not tracked as store visits', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->get('/admin')
        ->assertSuccessful();

    expect(Visitor::query()->count())->toBe(0);
});
