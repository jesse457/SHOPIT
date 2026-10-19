<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function orderWithItem(User $user): Order
{
    $product = Product::factory()->create();

    $order = Order::factory()->for($user)->create([
        'grand_total' => 42000,
        'shipping_amount' => 0,
        'created_at' => now(),
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 1,
        'unit_amount' => 42000,
        'total_amount' => 42000,
    ]);

    return $order;
}

test('guests are sent to sign in before viewing orders', function () {
    $this->get('/orders')->assertRedirect('/login');
});

test('customers only see their own orders', function () {
    $me = User::factory()->create();
    $other = User::factory()->create();

    $mine = orderWithItem($me);
    orderWithItem($other);

    $this->actingAs($me)
        ->get('/orders')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Orders')
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $mine->id));
});

test('a customer can view their own order', function () {
    $me = User::factory()->create();
    $order = orderWithItem($me);

    $this->actingAs($me)
        ->get("/orders/{$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/OrderDetail')
            ->where('order.id', $order->id));
});

test('a customer cannot view another customers order', function () {
    $me = User::factory()->create();
    $other = User::factory()->create();
    $order = orderWithItem($other);

    $this->actingAs($me)
        ->get("/orders/{$order->id}")
        ->assertForbidden();
});
