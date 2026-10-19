<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function deliverProductTo(User $user, Product $product): Order
{
    $order = Order::factory()->for($user)->create([
        'status' => OrderStatus::Delivered,
        'payment_status' => PaymentStatus::Paid,
        'paid_at' => now(),
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 1,
        'unit_amount' => $product->price,
        'total_amount' => $product->price,
    ]);

    return $order;
}

test('a verified buyer can submit a review for moderation', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);
    deliverProductTo($user, $product);

    $this->actingAs($user)
        ->from("/products/{$product->slug}")
        ->post("/products/{$product->slug}/reviews", [
            'rating' => 5,
            'title' => 'Exactly as described',
            'body' => 'The material feels considered and the finish is clean.',
        ])
        ->assertRedirect("/products/{$product->slug}")
        ->assertSessionHas('toast');

    $review = Review::query()->firstOrFail();

    expect($review->product_id)->toBe($product->id)
        ->and($review->user_id)->toBe($user->id)
        ->and($review->rating)->toBe(5)
        ->and($review->is_approved)->toBeFalse();
});

test('a customer without a delivered order cannot review', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    $this->actingAs($user)
        ->from("/products/{$product->slug}")
        ->post("/products/{$product->slug}/reviews", [
            'rating' => 5,
            'body' => 'This should not be accepted.',
        ])
        ->assertSessionHasErrors('review');

    expect(Review::query()->count())->toBe(0);
});

test('a customer can only review a product once', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);
    deliverProductTo($user, $product);

    Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->post("/products/{$product->slug}/reviews", [
            'rating' => 4,
            'body' => 'A second review should be rejected.',
        ])
        ->assertSessionHasErrors('review');

    expect(Review::query()->count())->toBe(1);
});

test('only approved reviews are shown on the product page', function () {
    $product = Product::factory()->create(['is_active' => true]);

    Review::factory()->approved()->create([
        'product_id' => $product->id,
        'rating' => 4,
        'title' => 'Published review',
        'body' => 'Visible to everyone.',
    ]);

    Review::factory()->create([
        'product_id' => $product->id,
        'rating' => 2,
        'title' => 'Pending review',
        'body' => 'Still in moderation.',
    ]);

    $this->get("/products/{$product->slug}")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/ProductDetail')
            ->has('reviews', 1)
            ->where('reviews.0.title', 'Published review')
            ->where('product.rating_average', 4)
            ->where('product.reviews_count', 1)
            ->has('ratingBreakdown', 5)
            ->where('canReview', false));
});

test('the author sees their pending review state', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);
    deliverProductTo($user, $product);

    Review::factory()->create([
        'product_id' => $product->id,
        'user_id' => $user->id,
        'rating' => 5,
        'body' => 'Waiting for moderation.',
    ]);

    $this->actingAs($user)
        ->get("/products/{$product->slug}")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->has('myReview')
            ->where('myReview.is_approved', false)
            ->has('reviews', 0)
            ->where('canReview', false));
});

test('an admin can approve a pending review', function () {
    $admin = User::factory()->admin()->create();
    $review = Review::factory()->create(['is_approved' => false]);

    $this->actingAs($admin)
        ->from('/admin/reviews')
        ->patch("/admin/reviews/{$review->id}", ['is_approved' => true])
        ->assertRedirect('/admin/reviews');

    expect($review->fresh()->is_approved)->toBeTrue();
});

test('a customer cannot moderate reviews', function () {
    $review = Review::factory()->create(['is_approved' => false]);

    $this->actingAs(User::factory()->create())
        ->patch("/admin/reviews/{$review->id}", ['is_approved' => true])
        ->assertForbidden();
});
