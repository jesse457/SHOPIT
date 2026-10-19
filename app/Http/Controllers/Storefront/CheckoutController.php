<?php

namespace App\Http\Controllers\Storefront;

use App\Actions\Checkout\CancelOrderAction;
use App\Actions\Checkout\PlaceOrderAction;
use App\Contracts\PaymentGateway;
use App\Enums\PaymentMethod;
use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Throwable;

class CheckoutController extends Controller
{
    public function __construct(
        private CartService $cart,
        private PlaceOrderAction $placeOrder,
        private PaymentGateway $gateway,
        private CancelOrderAction $cancelOrder,
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $summary = $this->cart->summary();

        if ($summary['items'] === []) {
            return redirect()
                ->route('cart.index')
                ->withToast('Your cart is empty.', 'info');
        }

        $lastAddress = $request->user()
            ?->orders()
            ->with('address')
            ->latest()
            ->first()
            ?->address;

        return Inertia::render('Storefront/Checkout', [
            'cart' => $summary,
            'defaultAddress' => $lastAddress?->only([
                'first_name',
                'last_name',
                'phone',
                'street_address',
                'city',
                'state',
                'zip_code',
            ]),
            'stripeEnabled' => filled(config('services.stripe.secret')),
        ]);
    }

    public function store(CheckoutRequest $request): Response|RedirectResponse|SymfonyResponse
    {
        if ($this->cart->summary()['items'] === []) {
            return redirect()
                ->route('cart.index')
                ->withToast('Your cart is empty.', 'info');
        }

        $paymentMethod = $request->paymentMethod();

        if (
            $paymentMethod === PaymentMethod::Stripe
            && blank(config('services.stripe.secret'))
        ) {
            throw ValidationException::withMessages([
                'payment_method' => 'Card payments are not configured. Choose cash on delivery.',
            ]);
        }

        $order = $this->placeOrder->execute(
            $request->user(),
            $request->addressData(),
            $paymentMethod,
            $request->notes(),
        );

        if ($paymentMethod === PaymentMethod::CashOnDelivery) {
            return redirect()
                ->route('checkout.success', ['order' => $order->id])
                ->withToast('Order placed. Pay on delivery.');
        }

        try {
            $session = $this->gateway->createCheckoutSession($order);

            $order->forceFill([
                'stripe_checkout_session_id' => $session->id,
            ])->save();

            return Inertia::location($session->url);
        } catch (Throwable $error) {
            report($error);

            $this->cancelOrder->execute($order);

            $lines = $order->items
                ->map(fn ($item): array => [
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                ])
                ->filter(fn (array $line): bool => $line['product_id'] !== null)
                ->values()
                ->all();

            $this->cart->restore($lines);

            return redirect()
                ->route('cart.index')
                ->withToast(
                    'Card payment could not be started. Your cart has been restored.',
                    'error',
                );
        }
    }
}
