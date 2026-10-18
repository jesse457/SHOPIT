<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\CategoryResource;
use App\Http\Resources\Storefront\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::query()
            ->active()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get();

        return Inertia::render('Storefront/Categories', [
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }

    public function show(Category $category): Response
    {
        abort_unless($category->is_active, 404);

        $products = Product::query()
            ->active()
            ->whereBelongsTo($category)
            ->with(['category:id,name,slug', 'brand:id,name,slug'])
            ->latest()
            ->paginate((int) config('shop.products.page_size'))
            ->withQueryString()
            ->through(fn (Product $product): array => (new ProductResource($product))->resolve());

        return Inertia::render('Storefront/CategoryDetail', [
            'category' => (new CategoryResource($category))->resolve(),
            'products' => $products,
        ]);
    }
}
