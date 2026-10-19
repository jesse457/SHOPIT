<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = $request->user()
            ->orders()
            ->with(['items', 'address'])
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Order $order): array => (new OrderResource($order))->resolve());

        return Inertia::render('Storefront/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Storefront/OrderDetail', [
            'order' => (new OrderResource(
                $order->load(['items.product', 'address']),
            ))->resolve(),
        ]);
    }
}
