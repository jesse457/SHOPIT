<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are sent to sign in before viewing a wishlist', function () {
    $this->get('/wishlist')->assertRedirect('/login');
});

test('a customer can save and remove a product', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    $this->actingAs($user)
        ->from("/products/{$product->slug}")
        ->post("/wishlist/{$product->slug}")
        ->assertRedirect("/products/{$product->slug}");

    expect(Wishlist::query()
        ->where('user_id', $user->id)
        ->where('product_id', $product->id)
        ->exists())->toBeTrue();

    $this->get('/wishlist')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Wishlist')
            ->has('products', 1)
            ->where('products.0.id', $product->id)
            ->where('wishlist.count', 1));

    $this->actingAs($user)
        ->delete("/wishlist/{$product->slug}")
        ->assertRedirect();

    expect(Wishlist::query()->count())->toBe(0);

    $this->get('/wishlist')
        ->assertInertia(fn (Assert $page) => $page->has('products', 0));
});

test('the product page reflects the saved state', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    Wishlist::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $this->actingAs($user)
        ->get("/products/{$product->slug}")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->where('isWishlisted', true));
});
