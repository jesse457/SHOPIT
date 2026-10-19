<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Visitor;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = CarbonImmutable::now();
        $startOfMonth = $now->startOfMonth();
        $startOfLastMonth = $now->subMonth()->startOfMonth();
        $endOfLastMonth = $now->subMonth()->endOfMonth();

        $revenueThisMonth = (float) Order::query()
            ->paid()
            ->where('created_at', '>=', $startOfMonth)
            ->sum('grand_total');

        $revenueLastMonth = (float) Order::query()
            ->paid()
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('grand_total');

        $ordersThisMonth = Order::query()
            ->where('created_at', '>=', $startOfMonth)
            ->count();

        $pendingOrders = Order::query()
            ->where('payment_status', PaymentStatus::Pending->value)
            ->count();

        $customers = User::query()
            ->where('is_admin', false)
            ->count();

        $lowStock = Product::query()
            ->active()
            ->where('stock_quantity', '>', 0)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->count();

        $revenueChange = $revenueLastMonth > 0
            ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1)
            : null;

        $months = collect(range(11, 0))
            ->map(fn (int $offset): string => $now->subMonths($offset)->format('Y-m'))
            ->values();

        $paidOrders = Order::query()
            ->paid()
            ->where('created_at', '>=', $now->subMonths(11)->startOfMonth())
            ->get(['created_at', 'grand_total']);

        $revenueByMonth = $paidOrders
            ->groupBy(fn (Order $order): string => $order->created_at->format('Y-m'))
            ->map(fn ($orders): float => (float) $orders->sum('grand_total'));

        $revenueSeries = $months->map(fn (string $month): array => [
            'month' => $month,
            'label' => CarbonImmutable::createFromFormat('!Y-m', $month)->format('M'),
            'revenue' => round((float) $revenueByMonth->get($month, 0.0), 2),
        ])->values();

        $statusCounts = Order::query()
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $statusBreakdown = collect(OrderStatus::cases())
            ->map(fn (OrderStatus $status): array => [
                'status' => $status->value,
                'label' => $status->label(),
                'count' => (int) ($statusCounts[$status->value] ?? 0),
            ])
            ->values();

        $visitorCounts = Visitor::query()
            ->where('visited_at', '>=', $now->subDays(13)->startOfDay())
            ->get(['visited_at'])
            ->groupBy(fn (Visitor $visitor): string => $visitor->visited_at->toDateString())
            ->map(fn ($visits): int => $visits->count());

        $visitorSeries = collect(range(13, 0))
            ->map(function (int $offset) use ($now, $visitorCounts): array {
                $date = $now->subDays($offset);

                return [
                    'date' => $date->toDateString(),
                    'label' => $date->format('d M'),
                    'count' => (int) $visitorCounts->get($date->toDateString(), 0),
                ];
            })
            ->values();

        $recentOrders = Order::query()
            ->with('user')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Order $order): array => (new OrderResource($order))->resolve())
            ->values();

        $lowStockProducts = Product::query()
            ->active()
            ->where('stock_quantity', '>', 0)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->orderBy('stock_quantity')
            ->limit(6)
            ->get(['id', 'name', 'stock_quantity', 'low_stock_threshold'])
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'stock_quantity' => $product->stock_quantity,
                'low_stock_threshold' => $product->low_stock_threshold,
            ])
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'revenue_this_month' => $revenueThisMonth,
                'revenue_last_month' => $revenueLastMonth,
                'revenue_change_percent' => $revenueChange,
                'orders_this_month' => $ordersThisMonth,
                'pending_orders' => $pendingOrders,
                'customers' => $customers,
                'low_stock' => $lowStock,
            ],
            'revenueSeries' => $revenueSeries,
            'statusBreakdown' => $statusBreakdown,
            'visitorSeries' => $visitorSeries,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
