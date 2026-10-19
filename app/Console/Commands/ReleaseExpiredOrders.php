<?php

namespace App\Console\Commands;

use App\Actions\Checkout\ReleaseOrderStockAction;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Console\Command;

class ReleaseExpiredOrders extends Command
{
    /**
     * @var string
     */
    protected $signature = 'orders:release-expired';

    /**
     * @var string
     */
    protected $description = 'Release reserved stock for unpaid card orders whose hold has expired';

    public function handle(ReleaseOrderStockAction $releaseStock): int
    {
        $released = 0;

        Order::query()
            ->where('payment_status', PaymentStatus::Pending->value)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->whereNull('stock_released_at')
            ->chunkById(100, function ($orders) use ($releaseStock, &$released): void {
                foreach ($orders as $order) {
                    $releaseStock->execute($order);
                    $released++;
                }
            });

        $this->info("Released stock for {$released} expired order(s).");

        return self::SUCCESS;
    }
}
