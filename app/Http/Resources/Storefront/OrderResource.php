<?php

namespace App\Http\Resources\Storefront;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Order
 */
class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'payment_status' => $this->payment_status->value,
            'payment_status_label' => $this->payment_status->label(),
            'payment_method' => $this->payment_method->value,
            'payment_method_label' => $this->payment_method->label(),
            'grand_total' => (string) $this->grand_total,
            'shipping_amount' => (string) $this->shipping_amount,
            'discount_amount' => (string) $this->discount_amount,
            'coupon_code' => $this->coupon_code,
            'currency' => $this->currency,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'can_retry_payment' => $this->canRetryPayment(),
            'items' => $this->whenLoaded('items', fn (): array => $this->items
                ->map(fn (OrderItem $item): array => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'product_image_url' => $item->product_image_url,
                    'quantity' => $item->quantity,
                    'unit_amount' => (string) $item->unit_amount,
                    'total_amount' => (string) $item->total_amount,
                    'product_slug' => $item->relationLoaded('product')
                        ? $item->product?->slug
                        : null,
                ])
                ->values()
                ->all()),
            'address' => $this->whenLoaded('address', fn (): ?array => $this->address === null
                ? null
                : [
                    ...$this->address->only([
                        'first_name',
                        'last_name',
                        'phone',
                        'street_address',
                        'city',
                        'state',
                        'zip_code',
                    ]),
                    'full_name' => $this->address->full_name,
                ]),
        ];
    }
}
