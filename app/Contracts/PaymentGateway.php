<?php

namespace App\Contracts;

use App\Models\Order;
use App\Support\CheckoutSession;

interface PaymentGateway
{
    public function createCheckoutSession(Order $order): CheckoutSession;

    public function expireSession(string $sessionId): void;

    /**
     * @return array{
     *     id: string,
     *     payment_status: string,
     *     status: string,
     *     amount_total: int,
     *     currency: string,
     *     metadata: array<string, string>,
     *     client_reference_id: string|null
     * }
     */
    public function retrieveSession(string $sessionId): array;
}
