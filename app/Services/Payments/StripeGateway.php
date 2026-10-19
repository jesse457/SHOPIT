<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use App\Models\Order;
use App\Models\OrderItem;
use App\Support\CheckoutSession;
use RuntimeException;
use Stripe\StripeClient;

class StripeGateway implements PaymentGateway
{
    /**
     * Stripe expects integer amounts in the currency's smallest unit. These
     * currencies have no minor unit, so the decimal amount is already the
     * integer Stripe wants.
     *
     * @var list<string>
     */
    private const ZERO_DECIMAL_CURRENCIES = [
        'BIF',
        'CLP',
        'DJF',
        'GNF',
        'JPY',
        'KMF',
        'KRW',
        'PYG',
        'RWF',
        'UGX',
        'VND',
        'VUV',
        'XAF',
        'XOF',
        'XPF',
    ];

    private ?StripeClient $client = null;

    public function __construct()
    {
        $secret = config('services.stripe.secret');

        if (filled($secret)) {
            $this->client = new StripeClient($secret);
        }
    }

    public function createCheckoutSession(Order $order): CheckoutSession
    {
        $order->loadMissing(['items', 'user']);
        $currency = strtolower($order->currency);

        $lineItems = $order->items
            ->map(fn (OrderItem $item): array => [
                'quantity' => $item->quantity,
                'price_data' => [
                    'currency' => $currency,
                    'unit_amount' => self::toMinorUnit((float) $item->unit_amount, $order->currency),
                    'product_data' => [
                        'name' => $item->product_name,
                    ],
                ],
            ])
            ->values()
            ->all();

        if ((float) $order->shipping_amount > 0) {
            $lineItems[] = [
                'quantity' => 1,
                'price_data' => [
                    'currency' => $currency,
                    'unit_amount' => self::toMinorUnit((float) $order->shipping_amount, $order->currency),
                    'product_data' => [
                        'name' => 'Delivery',
                    ],
                ],
            ];
        }

        $session = $this->client()->checkout->sessions->create([
            'mode' => 'payment',
            'payment_method_types' => ['card'],
            'customer_email' => $order->user?->email,
            'line_items' => $lineItems,
            'success_url' => route('checkout.success', ['order' => $order->id])
                .'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancelled', ['order' => $order->id]),
            'client_reference_id' => (string) $order->id,
            'metadata' => [
                'order_id' => (string) $order->id,
            ],
            'expires_at' => max(
                $order->expires_at?->getTimestamp() ?? 0,
                now()->addMinutes(31)->getTimestamp(),
            ),
        ]);

        return new CheckoutSession($session->id, (string) $session->url);
    }

    public function expireSession(string $sessionId): void
    {
        $this->client()->checkout->sessions->expire($sessionId);
    }

    public function retrieveSession(string $sessionId): array
    {
        $session = $this->client()->checkout->sessions->retrieve($sessionId, []);

        return [
            'id' => $session->id,
            'payment_status' => (string) $session->payment_status,
            'status' => (string) $session->status,
            'amount_total' => (int) $session->amount_total,
            'currency' => (string) $session->currency,
            'metadata' => (array) $session->metadata->toArray(),
            'client_reference_id' => $session->client_reference_id !== null
                ? (string) $session->client_reference_id
                : null,
        ];
    }

    public static function toMinorUnit(float $amount, string $currency): int
    {
        return in_array(strtoupper($currency), self::ZERO_DECIMAL_CURRENCIES, true)
            ? (int) round($amount)
            : (int) round($amount * 100);
    }

    private function client(): StripeClient
    {
        if ($this->client === null) {
            throw new RuntimeException('Stripe is not configured.');
        }

        return $this->client;
    }
}
