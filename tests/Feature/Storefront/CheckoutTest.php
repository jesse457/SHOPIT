<?php

use App\Contracts\PaymentGateway;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderPlacedNotification;
use App\Notifications\OrderStatusChangedNotification;
use App\Support\CheckoutSession;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Support\FakePaymentGateway;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function checkoutPayload(array $overrides = []): array
{
    return array_merge([
        'first_name' => 'Ariane',
        'last_name' => 'Tchoumi',
        'phone' => '+237 6 90 00 00 00',
        'street_address' => '12 Rue des Palmiers',
        'city' => 'Douala',
        'state' => 'Littoral',
        'zip_code' => '12345',
        'payment_method' => 'cod',
        'notes' => null,
    ], $overrides);
}

function placeStripeOrder(object $test, FakePaymentGateway $fake): Order
{
    config(['services.stripe.secret' => 'sk_test_fake']);
    app()->instance(PaymentGateway::class, $fake);

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $test->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->post('/checkout', checkoutPayload(['payment_method' => 'stripe']));

    return Order::query()->latest('id')->firstOrFail();
}

test('guests are sent to sign in before checkout', function () {
    $this->post('/checkout', checkoutPayload())->assertRedirect('/login');
});

test('cash on delivery places an order and reserves stock', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->post('/checkout', checkoutPayload());

    $order = Order::query()->latest('id')->firstOrFail();

    $response->assertRedirect(route('checkout.success', $order));

    $order->load(['items', 'address']);

    expect($order->user_id)->toBe($user->id)
        ->and($order->status)->toBe(OrderStatus::New)
        ->and($order->payment_status)->toBe(PaymentStatus::Pending)
        ->and($order->payment_method->value)->toBe('cod')
        ->and((float) $order->grand_total)->toBe(84000.0)
        ->and((float) $order->shipping_amount)->toBe(0.0)
        ->and($order->items)->toHaveCount(1)
        ->and($order->items->first()->product_name)->toBe($product->name)
        ->and($order->address->city)->toBe('Douala');

    expect($product->fresh()->stock_quantity)->toBe(8);
    expect(session('cart'))->toBeNull();
});

test('cash on delivery sends an order confirmation', function () {
    Notification::fake();

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 1]])
        ->post('/checkout', checkoutPayload());

    Notification::assertSentTo($user, OrderPlacedNotification::class);
});

test('delivery is charged below the free shipping threshold', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 20000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->post('/checkout', checkoutPayload())
        ->assertRedirect();

    $order = Order::query()->latest('id')->firstOrFail();

    expect((float) $order->shipping_amount)->toBe(2500.0)
        ->and((float) $order->grand_total)->toBe(42500.0);
});

test('an empty cart is sent back to the cart page', function () {
    $this->actingAs(User::factory()->create())
        ->post('/checkout', checkoutPayload())
        ->assertRedirect('/cart');

    expect(Order::query()->count())->toBe(0);
});

test('a stripe checkout creates a session using zero-decimal amounts', function () {
    config(['services.stripe.secret' => 'sk_test_fake']);

    $fake = new FakePaymentGateway;
    $this->app->instance(PaymentGateway::class, $fake);

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->withHeaders(['X-Inertia' => 'true'])
        ->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->post('/checkout', checkoutPayload(['payment_method' => 'stripe']))
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/cs_test_1');

    $order = Order::query()->latest('id')->firstOrFail();

    expect($order->stripe_checkout_session_id)->toBe('cs_test_1')
        ->and($order->expires_at)->not->toBeNull()
        ->and($fake->sessions['cs_test_1']['amount_total'])->toBe(84000)
        ->and($product->fresh()->stock_quantity)->toBe(8);
});

test('a failed stripe session restores the cart and releases stock', function () {
    config(['services.stripe.secret' => 'sk_test_fake']);

    $failing = new class implements PaymentGateway
    {
        public function createCheckoutSession(Order $order): CheckoutSession
        {
            throw new RuntimeException('Stripe is unavailable.');
        }

        public function expireSession(string $sessionId): void {}

        public function retrieveSession(string $sessionId): array
        {
            return [];
        }
    };

    $this->app->instance(PaymentGateway::class, $failing);

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 2]])
        ->post('/checkout', checkoutPayload(['payment_method' => 'stripe']))
        ->assertRedirect('/cart');

    $order = Order::query()->latest('id')->firstOrFail();

    expect($order->status)->toBe(OrderStatus::Cancelled)
        ->and($order->stock_released_at)->not->toBeNull()
        ->and($product->fresh()->stock_quantity)->toBe(10)
        ->and(session('cart'))->toMatchArray([$product->id => 2]);
});

test('a verified paid session marks the order as paid', function () {
    Notification::fake();

    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);
    $fake->markPaid('cs_test_1');

    $this->get("/checkout/success/{$order->id}?session_id=cs_test_1")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/CheckoutSuccess')
            ->where('order.payment_status', 'paid'));

    $order->refresh();

    expect($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->paid_at)->not->toBeNull()
        ->and($order->status)->toBe(OrderStatus::Processing);

    Notification::assertSentTo($order->user, OrderStatusChangedNotification::class);
});

test('a mismatched session id cannot mark an order paid', function () {
    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);

    $this->get("/checkout/success/{$order->id}?session_id=cs_wrong")
        ->assertNotFound();

    expect($order->fresh()->payment_status)->toBe(PaymentStatus::Pending);
});

test('the cancel page offers a retry that replaces the session', function () {
    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);

    $this->get("/checkout/cancelled/{$order->id}")
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page->component('Storefront/CheckoutCancelled'));

    $this->withHeaders(['X-Inertia' => 'true'])
        ->post("/checkout/retry/{$order->id}")
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/cs_test_2');

    $order->refresh();

    expect($order->stripe_checkout_session_id)->toBe('cs_test_2')
        ->and($fake->expired)->toContain('cs_test_1');
});

test('a signed completed webhook marks the order paid once', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);

    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);
    $order->refresh();

    $payload = json_encode([
        'id' => 'evt_completed',
        'object' => 'event',
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'id' => $order->stripe_checkout_session_id,
                'object' => 'checkout.session',
                'payment_status' => 'paid',
                'status' => 'complete',
                'amount_total' => (int) round((float) $order->grand_total),
                'currency' => 'xaf',
                'metadata' => ['order_id' => (string) $order->id],
                'client_reference_id' => (string) $order->id,
            ],
        ],
    ]);

    $timestamp = time();
    $signature = hash_hmac('sha256', $timestamp.'.'.$payload, 'whsec_test');
    $header = "t={$timestamp},v1={$signature}";

    $this->call(
        'POST',
        '/stripe/webhook',
        [],
        [],
        [],
        ['HTTP_STRIPE_SIGNATURE' => $header, 'CONTENT_TYPE' => 'application/json'],
        $payload,
    )->assertOk();

    $order->refresh();

    expect($order->payment_status)->toBe(PaymentStatus::Paid)
        ->and($order->paid_at)->not->toBeNull();

    $paidAt = $order->paid_at;

    $this->call(
        'POST',
        '/stripe/webhook',
        [],
        [],
        [],
        ['HTTP_STRIPE_SIGNATURE' => $header, 'CONTENT_TYPE' => 'application/json'],
        $payload,
    )->assertOk();

    expect($order->fresh()->paid_at->equalTo($paidAt))->toBeTrue();
});

test('a webhook with an invalid signature is rejected', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);

    $payload = json_encode(['id' => 'evt_bad', 'object' => 'event', 'type' => 'checkout.session.completed', 'data' => ['object' => []]]);

    $this->call(
        'POST',
        '/stripe/webhook',
        [],
        [],
        [],
        ['HTTP_STRIPE_SIGNATURE' => 't=1,v1=bad', 'CONTENT_TYPE' => 'application/json'],
        $payload,
    )->assertStatus(400);
});

test('an expired session webhook releases the reserved stock', function () {
    config(['services.stripe.webhook_secret' => 'whsec_test']);

    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);
    $product = $order->items()->first()->product;

    $payload = json_encode([
        'id' => 'evt_expired',
        'object' => 'event',
        'type' => 'checkout.session.expired',
        'data' => [
            'object' => [
                'id' => $order->stripe_checkout_session_id,
                'object' => 'checkout.session',
                'metadata' => ['order_id' => (string) $order->id],
                'client_reference_id' => (string) $order->id,
            ],
        ],
    ]);

    $timestamp = time();
    $signature = hash_hmac('sha256', $timestamp.'.'.$payload, 'whsec_test');
    $header = "t={$timestamp},v1={$signature}";

    $this->call(
        'POST',
        '/stripe/webhook',
        [],
        [],
        [],
        ['HTTP_STRIPE_SIGNATURE' => $header, 'CONTENT_TYPE' => 'application/json'],
        $payload,
    )->assertOk();

    expect($order->fresh()->stock_released_at)->not->toBeNull()
        ->and($product->fresh()->stock_quantity)->toBe(10);
});

test('the expiry command releases stock exactly once', function () {
    $fake = new FakePaymentGateway;
    $order = placeStripeOrder($this, $fake);
    $product = $order->items()->first()->product;

    $order->forceFill(['expires_at' => now()->subMinute()])->save();

    $this->artisan('orders:release-expired')->assertSuccessful();

    expect($order->fresh()->stock_released_at)->not->toBeNull()
        ->and($product->fresh()->stock_quantity)->toBe(10);

    $this->artisan('orders:release-expired')->assertSuccessful();

    expect($product->fresh()->stock_quantity)->toBe(10);
});
