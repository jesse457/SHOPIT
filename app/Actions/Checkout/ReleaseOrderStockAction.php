<?php

namespace App\Actions\Checkout;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ReleaseOrderStockAction
{
    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $locked = Order::query()
                ->lockForUpdate()
                ->findOrFail($order->getKey());

            if ($locked->stock_released_at !== null) {
                return;
            }

            $locked->loadMissing('items');

            foreach ($locked->items as $item) {
                if ($item->product_id === null) {
                    continue;
                }

                $product = Product::query()
                    ->lockForUpdate()
                    ->find($item->product_id);

                if ($product !== null) {
                    $product->forceFill([
                        'stock_quantity' => $product->stock_quantity + $item->quantity,
                    ])->save();
                }
            }

            $locked->forceFill(['stock_released_at' => now()])->save();
        });
    }
}
