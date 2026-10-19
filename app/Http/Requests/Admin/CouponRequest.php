<?php

namespace App\Http\Requests\Admin;

use App\Enums\CouponType;
use App\Models\Coupon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class CouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper(trim((string) $this->input('code'))),
            'min_order_amount' => $this->filled('min_order_amount')
                ? $this->input('min_order_amount')
                : null,
            'max_uses' => $this->filled('max_uses')
                ? $this->input('max_uses')
                : null,
            'starts_at' => $this->filled('starts_at')
                ? $this->input('starts_at')
                : null,
            'expires_at' => $this->filled('expires_at')
                ? $this->input('expires_at')
                : null,
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $coupon = $this->route('coupon');
        $couponId = $coupon instanceof Coupon ? $coupon->id : null;

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique('coupons', 'code')
                    ->ignore($couponId)
                    ->whereNull('deleted_at'),
            ],
            'type' => ['required', Rule::enum(CouponType::class)],
            'value' => ['required', 'numeric', 'min:0.01', 'max:99999999'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'max_uses' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                if (
                    $this->input('type') === CouponType::Percentage->value
                    && (float) $this->input('value') > 100
                ) {
                    $validator->errors()->add(
                        'value',
                        'A percentage coupon cannot exceed 100.',
                    );
                }

                if (
                    $this->filled('starts_at')
                    && $this->filled('expires_at')
                    && strtotime((string) $this->input('expires_at')) < strtotime((string) $this->input('starts_at'))
                ) {
                    $validator->errors()->add(
                        'expires_at',
                        'The expiry date must be after the start date.',
                    );
                }
            },
        ];
    }
}
