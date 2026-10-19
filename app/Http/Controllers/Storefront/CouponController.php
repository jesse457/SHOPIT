<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Services\CouponService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CouponController extends Controller
{
    public function __construct(
        private CartService $cart,
        private CouponService $coupons,
    ) {}

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $subtotal = (float) $this->cart->summary()['subtotal'];

        try {
            $this->coupons->apply($validated['code'], $subtotal);
        } catch (ValidationException $error) {
            return back()
                ->withErrors($error->errors())
                ->withInput();
        }

        return back()->withToast('Coupon applied.');
    }

    public function destroy(): RedirectResponse
    {
        $this->coupons->remove();

        return back()->withToast('Coupon removed.');
    }
}
