<?php

namespace App\Actions\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MarkOrderPaidAction
{
    /**
     * @throws ValidationException
     */
    public function execute(Order $order, ?string $sessionId = null): void
    {
        DB::transaction(function () use ($order, $sessionId): void {
            $locked = Order::query()
                ->lockForUpdate()
                ->findOrFail($order->getKey());

            if ($locked->payment_status === PaymentStatus::Paid) {
                return;
            }

            if (
                $sessionId !== null
                && $locked->stripe_checkout_session_id !== null
                && ! hash_equals($locked->stripe_checkout_session_id, $sessionId)
            ) {
                throw ValidationException::withMessages([
                    'session' => 'The payment session does not match this order.',
                ]);
            }

            $locked->forceFill([
                'payment_status' => PaymentStatus::Paid,
                'paid_at' => now(),
                'expires_at' => null,
                'status' => $locked->status === OrderStatus::New
                    ? OrderStatus::Processing
                    : $locked->status,
            ])->save();
        });
    }
}
