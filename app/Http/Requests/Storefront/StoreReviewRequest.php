<?php

namespace App\Http\Requests\Storefront;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'title' => ['nullable', 'string', 'max:120'],
            'body' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $product = $this->route('product');

                if (! $product instanceof Product) {
                    return;
                }

                if ($this->verifiedOrderId($product) === null) {
                    $validator->errors()->add(
                        'review',
                        'Only customers who received this piece can review it.',
                    );

                    return;
                }

                if (Review::query()
                    ->where('product_id', $product->id)
                    ->where('user_id', $this->user()?->id)
                    ->exists()) {
                    $validator->errors()->add(
                        'review',
                        'You have already reviewed this piece.',
                    );
                }
            },
        ];
    }

    public function verifiedOrderId(Product $product): ?int
    {
        return Order::query()
            ->where('user_id', $this->user()?->id)
            ->where('status', OrderStatus::Delivered->value)
            ->whereHas('items', fn ($query) => $query->where('product_id', $product->id))
            ->latest()
            ->value('id');
    }
}
