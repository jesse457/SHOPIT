<?php

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;

uses(LazilyRefreshDatabase::class);

test('it re-prices the cart and clamps quantities to stock', function () {
    $product = Product::factory()->create([
        'price' => 10000,
        'stock_quantity' => 2,
        'is_active' => true,
    ]);

    session(['cart' => [$product->id => 5]]);

    $summary = app(CartService::class)->summary();

    expect($summary['items'])->toHaveCount(1)
        ->and($summary['items'][0]['quantity'])->toBe(2)
        ->and($summary['subtotal'])->toBe('20000.00')
        ->and($summary['count'])->toBe(2);
});

test('delivery is charged below the threshold and waived at it', function () {
    $below = Product::factory()->create([
        'price' => 49999,
        'stock_quantity' => 5,
        'is_active' => true,
    ]);
    $atThreshold = Product::factory()->create([
        'price' => 50000,
        'stock_quantity' => 5,
        'is_active' => true,
    ]);

    session(['cart' => [$below->id => 1]]);
    $belowSummary = app(CartService::class)->summary();

    session(['cart' => [$atThreshold->id => 1]]);
    $thresholdSummary = app(CartService::class)->summary();

    expect($belowSummary['shipping'])->toBe('2500.00')
        ->and($belowSummary['grand_total'])->toBe('52499.00')
        ->and($thresholdSummary['shipping'])->toBe('0.00')
        ->and($thresholdSummary['qualifies_for_free_shipping'])->toBeTrue();
});

test('inactive products are dropped from the cart', function () {
    $product = Product::factory()->inactive()->create([
        'stock_quantity' => 5,
    ]);

    session(['cart' => [$product->id => 1]]);

    $summary = app(CartService::class)->summary();

    expect($summary['items'])->toBe([])
        ->and(session('cart'))->toBe([]);
});

test('adding the same product increments instead of replacing', function () {
    $product = Product::factory()->create([
        'price' => 10000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $service = app(CartService::class);

    $service->add($product, 2);
    $service->add($product, 3);

    expect($service->raw()[$product->id])->toBe(5);
});

test('a sold out product cannot be added', function () {
    $product = Product::factory()->create([
        'price' => 10000,
        'stock_quantity' => 0,
        'is_active' => true,
    ]);

    expect(app(CartService::class)->add($product, 1))->toBeFalse()
        ->and(session('cart'))->toBeNull();
});
