<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CartItemRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private CartService $cart) {}

    public function index(): Response
    {
        return Inertia::render('Storefront/Cart', [
            'cart' => $this->cart->summary(),
        ]);
    }

    public function store(CartItemRequest $request): RedirectResponse
    {
        $product = Product::query()->findOrFail($request->integer('product_id'));
        $added = $this->cart->add($product, $request->integer('quantity'));

        return back()->withToast(
            $added ? 'Added to your cart.' : 'This piece is unavailable.',
            $added ? 'success' : 'error',
        );
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:99'],
        ]);

        $this->cart->update($product, (int) $validated['quantity']);

        return back()->withToast('Cart updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->cart->remove($product);

        return back()->withToast('Removed from your cart.');
    }

    public function clear(): RedirectResponse
    {
        $this->cart->clear();

        return back()->withToast('Your cart is empty.');
    }
}
