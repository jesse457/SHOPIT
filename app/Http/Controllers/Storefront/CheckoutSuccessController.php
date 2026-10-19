<?php

namespace App\Http\Controllers\Storefront;

use App\Actions\Checkout\MarkOrderPaidAction;
use App\Contracts\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\OrderResource;
use App\Models\Order;
use App\Services\Payments\StripeGateway;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class CheckoutSuccessController extends Controller
{
    public function __construct(
        private PaymentGateway $gateway,
        private MarkOrderPaidAction $markPaid,
    ) {}

    public function __invoke(Request $request, Order $order): Response
    {
        $this->authorize('view', $order);

        $sessionId = $request->query('session_id');

        if (
            is_string($sessionId)
            && $sessionId !== ''
            && $order->stripe_checkout_session_id !== null
        ) {
            abort_unless(
                hash_equals($order->stripe_checkout_session_id, $sessionId),
                404,
            );

            try {
                $session = $this->gateway->retrieveSession($sessionId);
                $expectedAmount = StripeGateway::toMinorUnit(
                    (float) $order->grand_total,
                    $order->currency,
                );
                $metadataOrderId = (string) (
                    $session['metadata']['order_id']
                    ?? $session['client_reference_id']
                    ?? ''
                );

                if (
                    $session['payment_status'] === 'paid'
                    && $session['status'] === 'complete'
                    && $metadataOrderId === (string) $order->id
                    && $session['amount_total'] === $expectedAmount
                ) {
                    $this->markPaid->execute($order, $sessionId);
                }
            } catch (Throwable $error) {
                report($error);
            }
        }

        return Inertia::render('Storefront/CheckoutSuccess', [
            'order' => (new OrderResource(
                $order->refresh()->load(['items.product', 'address']),
            ))->resolve(),
        ]);
    }
}
