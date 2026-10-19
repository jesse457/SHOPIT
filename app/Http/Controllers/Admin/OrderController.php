<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Checkout\CancelOrderAction;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OrderUpdateRequest;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private CancelOrderAction $cancelOrder) {}

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
            'payment_status' => ['nullable', Rule::enum(PaymentStatus::class)],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));

        $orders = Order::query()
            ->with('user')
            ->when($search !== '', function (Builder $query) use ($search): void {
                if (ctype_digit($search)) {
                    $query->where('id', (int) $search);

                    return;
                }

                $query->whereHas('user', function (Builder $userQuery) use ($search): void {
                    $userQuery->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->when($validated['status'] ?? null, fn (Builder $query, $status) => $query->where('status', $status))
            ->when($validated['payment_status'] ?? null, fn (Builder $query, $status) => $query->where('payment_status', $status))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Order $order): array => (new OrderResource($order))->resolve());

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'q' => $search,
                'status' => $validated['status'] ?? null,
                'payment_status' => $validated['payment_status'] ?? null,
            ],
            'statuses' => collect(OrderStatus::cases())
                ->map(fn (OrderStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
            'paymentStatuses' => collect(PaymentStatus::cases())
                ->map(fn (PaymentStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'items.product', 'address']);

        $statuses = collect([$order->status, ...$order->status->allowedTransitions()])
            ->unique(fn (OrderStatus $status): string => $status->value)
            ->map(fn (OrderStatus $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ])
            ->values();

        return Inertia::render('Admin/Orders/Show', [
            'order' => (new OrderResource($order))->resolve(),
            'statuses' => $statuses,
            'paymentStatuses' => collect(PaymentStatus::cases())
                ->map(fn (PaymentStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->values(),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function update(OrderUpdateRequest $request, Order $order): RedirectResponse
    {
        $validated = $request->validated();
        $previousStatus = $order->status;
        $newStatus = OrderStatus::from($validated['status']);
        $newPaymentStatus = PaymentStatus::from($validated['payment_status']);

        if (
            $newStatus !== $order->status
            && ! $order->status->canTransitionTo($newStatus)
        ) {
            throw ValidationException::withMessages([
                'status' => 'That status change is not allowed.',
            ]);
        }

        if ($newStatus === OrderStatus::Cancelled) {
            $this->cancelOrder->execute($order);
            $order->refresh();
        }

        $paidAt = $order->paid_at;

        if ($newPaymentStatus === PaymentStatus::Paid && $paidAt === null) {
            $paidAt = now();
        }

        $order->forceFill([
            'status' => $newStatus,
            'payment_status' => $newPaymentStatus,
            'notes' => $validated['notes'] ?? null,
            'paid_at' => $paidAt,
        ])->save();

        if ($previousStatus !== $newStatus) {
            try {
                $order->user?->notify(
                    new OrderStatusChangedNotification($order->fresh()),
                );
            } catch (Throwable $error) {
                report($error);
            }
        }

        return back()->withToast('Order updated.');
    }
}
