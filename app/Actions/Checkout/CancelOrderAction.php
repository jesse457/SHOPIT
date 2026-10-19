<?php

namespace App\Actions\Checkout;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class CancelOrderAction
{
    public function __construct(private ReleaseOrderStockAction $releaseStock) {}

    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order): void {
            $locked = Order::query()
                ->lockForUpdate()
                ->findOrFail($order->getKey());

            if ($locked->status === OrderStatus::Cancelled) {
                return;
            }

            $locked->forceFill(['status' => OrderStatus::Cancelled])->save();

            $this->releaseStock->execute($locked);
        });
    }
}
