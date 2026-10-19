<?php

namespace App\Actions\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PlaceOrderAction
{
    public function __construct(private CartService $cart) {}

    /**
     * @param  array<string, string>  $address
     */
    public function execute(
        User $user,
        array $address,
        PaymentMethod $paymentMethod,
        ?string $notes = null,
    ): Order {
        return DB::transaction(function () use ($user, $address, $paymentMethod, $notes): Order {
            $summary = $this->cart->summary();

            if ($summary['items'] === []) {
                throw ValidationException::withMessages([
                    'cart' => 'Your cart is empty.',
                ]);
            }

            $quantities = collect($summary['items'])
                ->mapWithKeys(fn (array $line): array => [
                    (int) $line['product_id'] => (int) $line['quantity'],
                ]);

            /** @var Collection<int, Product> $products */
            $products = Product::query()
                ->whereIn('id', $quantities->keys())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $lines = [];
            $subtotal = 0.0;

            foreach ($quantities as $productId => $quantity) {
                $product = $products->get($productId);

                if (! $product || ! $product->is_active) {
                    throw ValidationException::withMessages([
                        'cart' => 'One of the pieces is no longer available.',
                    ]);
                }

                if ($product->stock_quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'cart' => 'One of the pieces no longer has enough stock.',
                    ]);
                }

                $unitAmount = (float) $product->price;
                $lineTotal = $unitAmount * $quantity;
                $subtotal += $lineTotal;

                $lines[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_amount' => $unitAmount,
                    'total_amount' => $lineTotal,
                ];
            }

            $threshold = (float) config('shop.shipping.free_threshold');
            $shipping = $subtotal >= $threshold
                ? 0.0
                : (float) config('shop.shipping.flat_rate');

            $coupon = null;
            $discount = 0.0;

            if ($summary['coupon'] !== null) {
                $coupon = Coupon::query()
                    ->lockForUpdate()
                    ->find($summary['coupon']['id']);

                if ($coupon === null || ! $coupon->isValidFor($subtotal)) {
                    throw ValidationException::withMessages([
                        'coupon' => 'The coupon is no longer valid. Remove it and try again.',
                    ]);
                }

                $discount = $coupon->discountFor($subtotal);
            }

            $grandTotal = max(0.0, $subtotal + $shipping - $discount);

            $order = Order::query()->create([
                'user_id' => $user->id,
                'coupon_id' => $coupon?->id,
                'coupon_code' => $coupon?->code,
                'grand_total' => $grandTotal,
                'payment_method' => $paymentMethod,
                'payment_status' => PaymentStatus::Pending,
                'status' => OrderStatus::New,
                'currency' => config('shop.currency'),
                'shipping_amount' => $shipping,
                'discount_amount' => $discount,
                'shipping_method' => 'standard',
                'notes' => $notes,
                'expires_at' => $paymentMethod === PaymentMethod::Stripe
                    ? now()->addMinutes((int) config('shop.orders.stripe_hold_minutes'))
                    : null,
            ]);

            $order->address()->create($address);

            foreach ($lines as $line) {
                /** @var Product $product */
                $product = $line['product'];

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_image' => $product->images[0] ?? null,
                    'quantity' => $line['quantity'],
                    'unit_amount' => $line['unit_amount'],
                    'total_amount' => $line['total_amount'],
                ]);

                $product->forceFill([
                    'stock_quantity' => $product->stock_quantity - $line['quantity'],
                ])->save();
            }

            if ($coupon !== null) {
                $coupon->increment('used_count');
            }

            $this->cart->clear();

            return $order->load(['items', 'address', 'user']);
        });
    }
}
