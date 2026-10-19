<?php

namespace App\Http\Controllers\Storefront;

use App\Contracts\PaymentGateway;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Throwable;

class CheckoutRetryController extends Controller
{
    public function __construct(private PaymentGateway $gateway) {}

    public function __invoke(Order $order): SymfonyResponse|RedirectResponse
    {
        $this->authorize('view', $order);

        if ($order->payment_method !== PaymentMethod::Stripe) {
            return redirect()->route('checkout.success', ['order' => $order->id]);
        }

        if (! $order->canRetryPayment()) {
            return redirect()
                ->route('orders.show', ['order' => $order->id])
                ->withToast('This order can no longer be paid online.', 'error');
        }

        if (blank(config('services.stripe.secret'))) {
            throw ValidationException::withMessages([
                'payment_method' => 'Card payments are not configured.',
            ]);
        }

        if ($order->stripe_checkout_session_id !== null) {
            try {
                $this->gateway->expireSession($order->stripe_checkout_session_id);
            } catch (Throwable $error) {
                report($error);
            }
        }

        $session = $this->gateway->createCheckoutSession($order);

        $order->forceFill([
            'stripe_checkout_session_id' => $session->id,
            'expires_at' => now()->addMinutes(
                (int) config('shop.orders.stripe_hold_minutes'),
            ),
        ])->save();

        return Inertia::location($session->url);
    }
}
