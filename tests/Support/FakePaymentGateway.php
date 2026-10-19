<?php

namespace Tests\Support;

use App\Contracts\PaymentGateway;
use App\Models\Order;
use App\Services\Payments\StripeGateway;
use App\Support\CheckoutSession;

class FakePaymentGateway implements PaymentGateway
{
    public int $created = 0;

    /**
     * @var array<string, array<string, mixed>>
     */
    public array $sessions = [];

    /**
     * @var list<string>
     */
    public array $expired = [];

    public function createCheckoutSession(Order $order): CheckoutSession
    {
        $this->created++;
        $id = 'cs_test_'.$this->created;

        $this->sessions[$id] = [
            'id' => $id,
            'payment_status' => 'unpaid',
            'status' => 'open',
            'amount_total' => StripeGateway::toMinorUnit(
                (float) $order->grand_total,
                $order->currency,
            ),
            'currency' => strtolower($order->currency),
            'metadata' => ['order_id' => (string) $order->id],
            'client_reference_id' => (string) $order->id,
        ];

        return new CheckoutSession($id, 'https://checkout.stripe.test/'.$id);
    }

    public function expireSession(string $sessionId): void
    {
        $this->expired[] = $sessionId;
    }

    public function retrieveSession(string $sessionId): array
    {
        return $this->sessions[$sessionId];
    }

    public function markPaid(string $sessionId): void
    {
        $this->sessions[$sessionId]['payment_status'] = 'paid';
        $this->sessions[$sessionId]['status'] = 'complete';
    }
}
