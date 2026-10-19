<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\ProductResource;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        $products = $request->user()
            ->wishlists()
            ->with([
                'product' => fn ($query) => $query
                    ->withRating()
                    ->with(['category:id,name,slug', 'brand:id,name,slug']),
            ])
            ->latest()
            ->get()
            ->pluck('product')
            ->filter(fn (?Product $product): bool => $product !== null && $product->is_active)
            ->values();

        return Inertia::render('Storefront/Wishlist', [
            'products' => ProductResource::collection($products)->resolve(),
        ]);
    }

    public function store(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $request->user()->wishlists()->firstOrCreate([
            'product_id' => $product->id,
        ]);

        return back()->withToast('Saved to your wishlist.');
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $request->user()->wishlists()
            ->where('product_id', $product->id)
            ->delete();

        return back()->withToast('Removed from your wishlist.');
    }
}
