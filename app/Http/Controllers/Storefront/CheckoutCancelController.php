<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\OrderResource;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutCancelController extends Controller
{
    public function __invoke(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Storefront/CheckoutCancelled', [
            'order' => (new OrderResource(
                $order->load(['items.product', 'address']),
            ))->resolve(),
        ]);
    }
}
