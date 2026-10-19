<?php

use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;

uses(LazilyRefreshDatabase::class);

test('percentage discounts are calculated from the subtotal', function () {
    $coupon = Coupon::factory()->create([
        'type' => CouponType::Percentage,
        'value' => 10,
    ]);

    expect($coupon->discountFor(50000))->toBe(5000.0);
});

test('fixed discounts are capped at the subtotal', function () {
    $coupon = Coupon::factory()->fixed(100000)->create();

    expect($coupon->discountFor(50000))->toBe(50000.0);
});

test('validity observes the window, limits and minimum order', function () {
    $valid = Coupon::factory()->create([
        'min_order_amount' => 10000,
        'max_uses' => 2,
        'used_count' => 1,
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addDay(),
    ]);
    $expired = Coupon::factory()->expired()->create();
    $future = Coupon::factory()->create(['starts_at' => now()->addDay()]);
    $exhausted = Coupon::factory()->create(['max_uses' => 1, 'used_count' => 1]);
    $inactive = Coupon::factory()->inactive()->create();
    $minimum = Coupon::factory()->create(['min_order_amount' => 100000]);

    expect($valid->isValidFor(50000))->toBeTrue()
        ->and($valid->isValidFor(5000))->toBeFalse()
        ->and($expired->isValidFor(50000))->toBeFalse()
        ->and($future->isValidFor(50000))->toBeFalse()
        ->and($exhausted->isValidFor(50000))->toBeFalse()
        ->and($inactive->isValidFor(50000))->toBeFalse()
        ->and($minimum->isValidFor(50000))->toBeFalse();
});
