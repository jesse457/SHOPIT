<?php

namespace App\Http\Controllers\Storefront;

use App\Actions\Checkout\MarkOrderPaidAction;
use App\Actions\Checkout\ReleaseOrderStockAction;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payments\StripeGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class StripeWebhookController extends Controller
{
    public function __construct(
        private MarkOrderPaidAction $markPaid,
        private ReleaseOrderStockAction $releaseStock,
    ) {}

    public function __invoke(Request $request): Response
    {
        $secret = config('services.stripe.webhook_secret');

        if (blank($secret)) {
            return response('Webhook secret is not configured.', 400);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
                $secret,
            );
        } catch (SignatureVerificationException) {
            return response('Invalid signature.', 400);
        } catch (Throwable $error) {
            report($error);

            return response('Invalid payload.', 400);
        }

        if (! in_array($event->type, [
            'checkout.session.completed',
            'checkout.session.expired',
        ], true)) {
            return response('OK', 200);
        }

        $session = $event->data->object;
        $metadata = $session->metadata ?? null;
        $orderId = $metadata?->order_id ?? $session->client_reference_id ?? null;
        $order = $orderId !== null ? Order::query()->find($orderId) : null;

        if ($order === null) {
            Log::warning('Stripe webhook for an unknown order.', [
                'order_id' => $orderId,
                'event' => $event->type,
            ]);

            return response('OK', 200);
        }

        if (
            $order->stripe_checkout_session_id === null
            || ! hash_equals($order->stripe_checkout_session_id, (string) $session->id)
        ) {
            Log::warning('Stripe webhook session does not match the order.', [
                'order_id' => $order->id,
                'event' => $event->type,
            ]);

            return response('OK', 200);
        }

        if ($event->type === 'checkout.session.expired') {
            if ($order->payment_status === PaymentStatus::Pending) {
                $this->releaseStock->execute($order);
            }

            return response('OK', 200);
        }

        $expectedAmount = StripeGateway::toMinorUnit(
            (float) $order->grand_total,
            $order->currency,
        );

        if (
            ($session->payment_status ?? null) !== 'paid'
            || (int) ($session->amount_total ?? 0) !== $expectedAmount
            || strtoupper((string) ($session->currency ?? '')) !== strtoupper($order->currency)
        ) {
            Log::warning('Stripe webhook payment details did not match the order.', [
                'order_id' => $order->id,
                'expected_amount' => $expectedAmount,
                'received_amount' => $session->amount_total ?? null,
            ]);

            return response('OK', 200);
        }

        $this->markPaid->execute($order, (string) $session->id);

        return response('OK', 200);
    }
}
