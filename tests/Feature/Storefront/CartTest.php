<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('a product can be added to the cart', function () {
    $product = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->from('/products')
        ->post('/cart/items', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])
        ->assertRedirect('/products');

    expect(session('cart'))->toMatchArray([$product->id => 2]);
});

test('adding the same product increments the quantity', function () {
    $product = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    expect(session('cart'))->toMatchArray([$product->id => 3]);
});

test('cart quantities can be updated and removed', function () {
    $product = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->patch("/cart/items/{$product->slug}", ['quantity' => 4])
        ->assertRedirect();

    expect(session('cart'))->toMatchArray([$product->id => 4]);

    $this->delete("/cart/items/{$product->slug}")->assertRedirect();

    expect(session('cart'))->toBe([]);
});

test('the whole cart can be cleared', function () {
    $product = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $this->delete('/cart')->assertRedirect();

    expect(session('cart'))->toBeNull();
});

test('an inactive product cannot be added', function () {
    $product = Product::factory()->inactive()->create([
        'stock_quantity' => 5,
    ]);

    $this->from('/products')
        ->post('/cart/items', [
            'product_id' => $product->id,
            'quantity' => 1,
        ])
        ->assertSessionHasErrors('product_id');

    expect(session('cart'))->toBeNull();
});

test('a quantity above stock is rejected', function () {
    $product = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 2,
        'is_active' => true,
    ]);

    $this->from('/products')
        ->post('/cart/items', [
            'product_id' => $product->id,
            'quantity' => 5,
        ])
        ->assertSessionHasErrors('quantity');

    expect(session('cart'))->toBeNull();
});

test('the cart re-prices from the database rather than trusting a snapshot', function () {
    $product = Product::factory()->create([
        'price' => 10000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 1,
    ]);

    $product->forceFill(['price' => 25000])->save();

    $this->get('/cart')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Cart')
            ->where('cart.subtotal', '25000.00')
            ->where('cart.shipping', '2500.00')
            ->where('cart.grand_total', '27500.00'));
});
