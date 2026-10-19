<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\StoreReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Product $product): RedirectResponse
    {
        Review::query()->create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'order_id' => $request->verifiedOrderId($product),
            'rating' => $request->integer('rating'),
            'title' => $request->filled('title')
                ? $request->string('title')->toString()
                : null,
            'body' => $request->string('body')->toString(),
            'is_approved' => false,
        ]);

        return back()->withToast('Thanks. Your review is awaiting moderation.');
    }
}
