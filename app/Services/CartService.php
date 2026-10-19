<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Collection;

class CartService
{
    private const SESSION_KEY = 'cart';

    /**
     * @return array<int, int>
     */
    public function raw(): array
    {
        $cart = session(self::SESSION_KEY, []);

        if (! is_array($cart)) {
            return [];
        }

        return array_map('intval', $cart);
    }

    public function count(): int
    {
        return array_sum($this->raw());
    }

    /**
     * Re-price the session cart from the database, clamp quantities to stock,
     * and drop inactive or removed products. The session is rewritten so stale
     * lines do not survive the request.
     *
     * @return array<int, array<string, mixed>>
     */
    public function items(): array
    {
        $cart = $this->raw();

        if ($cart === []) {
            return [];
        }

        /** @var Collection<int, Product> $products */
        $products = Product::query()
            ->active()
            ->whereIn('id', array_keys($cart))
            ->get()
            ->keyBy('id');

        $lines = [];
        $pruned = [];

        foreach ($cart as $productId => $quantity) {
            $product = $products->get($productId);

            if (! $product || ! $product->in_stock) {
                continue;
            }

            $quantity = max(1, min($quantity, $product->stock_quantity));
            $unitAmount = (float) $product->price;

            $lines[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image_url' => $product->image_url,
                'quantity' => $quantity,
                'unit_amount' => number_format($unitAmount, 2, '.', ''),
                'total_amount' => number_format($unitAmount * $quantity, 2, '.', ''),
                'stock_quantity' => $product->stock_quantity,
            ];

            $pruned[$productId] = $quantity;
        }

        $this->write($pruned);

        return $lines;
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(): array
    {
        $items = $this->items();
        $subtotal = array_sum(array_map(
            static fn (array $line): float => (float) $line['total_amount'],
            $items,
        ));

        $threshold = (float) config('shop.shipping.free_threshold');
        $shipping = $subtotal === 0.0 || $subtotal >= $threshold
            ? 0.0
            : (float) config('shop.shipping.flat_rate');

        return [
            'items' => $items,
            'count' => array_sum(array_column($items, 'quantity')),
            'subtotal' => number_format($subtotal, 2, '.', ''),
            'shipping' => number_format($shipping, 2, '.', ''),
            'grand_total' => number_format($subtotal + $shipping, 2, '.', ''),
            'free_shipping_threshold' => number_format($threshold, 2, '.', ''),
            'remaining_for_free_shipping' => number_format(max(0, $threshold - $subtotal), 2, '.', ''),
            'qualifies_for_free_shipping' => $subtotal >= $threshold,
        ];
    }

    public function add(Product $product, int $quantity = 1): bool
    {
        if (! $product->is_active || $product->stock_quantity <= 0) {
            return false;
        }

        $cart = $this->raw();
        $current = $cart[$product->id] ?? 0;
        $cart[$product->id] = min($current + max(1, $quantity), $product->stock_quantity);
        $this->write($cart);

        return true;
    }

    public function update(Product $product, int $quantity): void
    {
        $cart = $this->raw();

        if ($quantity <= 0 || ! $product->is_active || $product->stock_quantity <= 0) {
            unset($cart[$product->id]);
            $this->write($cart);

            return;
        }

        $cart[$product->id] = min($quantity, $product->stock_quantity);
        $this->write($cart);
    }

    public function remove(Product $product): void
    {
        $cart = $this->raw();
        unset($cart[$product->id]);
        $this->write($cart);
    }

    public function clear(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    /**
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     */
    public function restore(array $items): void
    {
        $cart = [];

        foreach ($items as $item) {
            $cart[(int) $item['product_id']] = (int) $item['quantity'];
        }

        $this->write($cart);
    }

    /**
     * @param  array<int, int>  $cart
     */
    private function write(array $cart): void
    {
        session([self::SESSION_KEY => $cart]);
    }
}
