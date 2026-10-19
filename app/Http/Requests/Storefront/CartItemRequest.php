<?php

namespace App\Http\Requests\Storefront;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id')->whereNull('deleted_at'),
            ],
            'quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $product = Product::query()->find($this->integer('product_id'));

                if (! $product || ! $product->is_active) {
                    $validator->errors()->add('product_id', 'This piece is no longer available.');

                    return;
                }

                if ($product->stock_quantity < $this->integer('quantity')) {
                    $validator->errors()->add(
                        'quantity',
                        'Only '.$product->stock_quantity.' available.',
                    );
                }
            },
        ];
    }
}
