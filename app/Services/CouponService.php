<?php

namespace App\Services;

use App\Models\Coupon;
use Illuminate\Validation\ValidationException;

class CouponService
{
    private const SESSION_KEY = 'coupon_code';

    /**
     * @throws ValidationException
     */
    public function apply(string $code, float $subtotal): Coupon
    {
        if ($subtotal <= 0) {
            throw ValidationException::withMessages([
                'coupon' => 'Add something to your cart before applying a coupon.',
            ]);
        }

        $coupon = Coupon::query()
            ->where('code', strtoupper(trim($code)))
            ->first();

        if ($coupon === null || ! $coupon->isValidFor($subtotal)) {
            throw ValidationException::withMessages([
                'coupon' => 'That coupon is not valid for your cart.',
            ]);
        }

        session([self::SESSION_KEY => $coupon->code]);

        return $coupon;
    }

    public function remove(): void
    {
        session()->forget(self::SESSION_KEY);
    }

    public function current(float $subtotal): ?Coupon
    {
        $code = session(self::SESSION_KEY);

        if (! is_string($code) || $code === '') {
            return null;
        }

        $coupon = Coupon::query()->where('code', $code)->first();

        if ($coupon === null || ! $coupon->isValidFor($subtotal)) {
            session()->forget(self::SESSION_KEY);

            return null;
        }

        return $coupon;
    }
}
