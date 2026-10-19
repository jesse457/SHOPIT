<?php

use App\Contracts\PaymentGateway;
use App\Enums\CouponType;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\Support\FakePaymentGateway;

/**
 * @return array<string, mixed>
 */
function couponCheckoutPayload(): array
{
    return [
        'first_name' => 'Ariane',
        'last_name' => 'Tchoumi',
        'phone' => '+237 6 90 00 00 00',
        'street_address' => '12 Rue des Palmiers',
        'city' => 'Douala',
        'state' => 'Littoral',
        'zip_code' => '12345',
        'payment_method' => 'cod',
        'notes' => null,
    ];
}

test('a valid coupon is applied to the cart and the order', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);
    $coupon = Coupon::factory()->create([
        'code' => 'SAVE10',
        'type' => CouponType::Percentage,
        'value' => 10,
    ]);

    $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 1]])
        ->from('/cart')
        ->post('/cart/coupon', ['code' => 'save10'])
        ->assertRedirect('/cart');

    $this->get('/cart')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Cart')
            ->where('cart.coupon.code', 'SAVE10')
            ->where('cart.discount', '4200.00')
            ->where('cart.shipping', '2500.00')
            ->where('cart.grand_total', '40300.00'));

    $this->post('/checkout', couponCheckoutPayload())
        ->assertRedirect();

    $order = Order::query()->latest('id')->firstOrFail();

    expect((float) $order->discount_amount)->toBe(4200.0)
        ->and($order->coupon_code)->toBe('SAVE10')
        ->and((float) $order->grand_total)->toBe(40300.0)
        ->and($coupon->fresh()->used_count)->toBe(1)
        ->and(session('coupon_code'))->toBeNull();
});

test('an invalid coupon is rejected', function () {
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->withSession(['cart' => [$product->id => 1]])
        ->from('/cart')
        ->post('/cart/coupon', ['code' => 'NOPE'])
        ->assertSessionHasErrors('coupon');

    expect(session('coupon_code'))->toBeNull();
});

test('a coupon below its minimum order is rejected', function () {
    Coupon::factory()->create([
        'code' => 'BIGORDER',
        'type' => CouponType::Fixed,
        'value' => 5000,
        'min_order_amount' => 100000,
    ]);
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->withSession(['cart' => [$product->id => 1]])
        ->from('/cart')
        ->post('/cart/coupon', ['code' => 'BIGORDER'])
        ->assertSessionHasErrors('coupon');
});

test('expired and exhausted coupons are rejected', function () {
    Coupon::factory()->expired()->create(['code' => 'OLD']);
    Coupon::factory()->create([
        'code' => 'USEDUP',
        'max_uses' => 1,
        'used_count' => 1,
    ]);
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->withSession(['cart' => [$product->id => 1]])
        ->post('/cart/coupon', ['code' => 'OLD'])
        ->assertSessionHasErrors('coupon');

    $this->withSession(['cart' => [$product->id => 1]])
        ->post('/cart/coupon', ['code' => 'USEDUP'])
        ->assertSessionHasErrors('coupon');
});

test('a coupon can be removed from the cart', function () {
    Coupon::factory()->create(['code' => 'SAVE10']);
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->withSession(['cart' => [$product->id => 1]])
        ->post('/cart/coupon', ['code' => 'SAVE10']);

    $this->from('/cart')
        ->delete('/cart/coupon')
        ->assertRedirect('/cart');

    $this->get('/cart')
        ->assertInertia(fn (Assert $page) => $page
            ->where('cart.coupon', null)
            ->where('cart.discount', '0.00'));
});

test('a discounted order charges the discounted stripe amount', function () {
    config(['services.stripe.secret' => 'sk_test_fake']);

    $fake = new FakePaymentGateway;
    app()->instance(PaymentGateway::class, $fake);

    $user = User::factory()->create();
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);
    Coupon::factory()->create([
        'code' => 'SAVE10',
        'type' => CouponType::Percentage,
        'value' => 10,
    ]);

    $this->actingAs($user)
        ->withSession(['cart' => [$product->id => 1]])
        ->post('/cart/coupon', ['code' => 'SAVE10']);

    $this->post('/checkout', array_merge(couponCheckoutPayload(), [
        'payment_method' => 'stripe',
    ]))->assertRedirect();

    expect($fake->sessions['cs_test_1']['amount_total'])->toBe(40300);
});
