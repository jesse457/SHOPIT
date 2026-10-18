<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Resources\Storefront\BrandResource;
use App\Http\Resources\Storefront\CategoryResource;
use App\Http\Resources\Storefront\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:500'],
            'brand' => ['nullable', 'string', 'max:500'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
            'featured' => ['nullable', 'boolean'],
            'on_sale' => ['nullable', 'boolean'],
            'sort' => ['nullable', Rule::in(['latest', 'price_asc', 'price_desc', 'name_asc'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));
        $categorySlugs = $this->csv($validated['category'] ?? null);
        $brandSlugs = $this->csv($validated['brand'] ?? null);
        $featured = (bool) ($validated['featured'] ?? false);
        $onSale = (bool) ($validated['on_sale'] ?? false);
        $sort = $validated['sort'] ?? 'latest';

        $minPrice = isset($validated['min_price']) ? (float) $validated['min_price'] : null;
        $maxPrice = isset($validated['max_price']) ? (float) $validated['max_price'] : null;

        if ($minPrice !== null && $maxPrice !== null && $minPrice > $maxPrice) {
            [$minPrice, $maxPrice] = [$maxPrice, $minPrice];
        }

        $query = Product::query()
            ->active()
            ->with(['category:id,name,slug', 'brand:id,name,slug'])
            ->search($search)
            ->when($categorySlugs !== [], fn (Builder $query) => $query->whereHas(
                'category',
                fn (Builder $categoryQuery) => $categoryQuery
                    ->whereIn('slug', $categorySlugs)
                    ->where('is_active', true),
            ))
            ->when($brandSlugs !== [], fn (Builder $query) => $query->whereHas(
                'brand',
                fn (Builder $brandQuery) => $brandQuery
                    ->whereIn('slug', $brandSlugs)
                    ->where('is_active', true),
            ))
            ->when($featured, fn (Builder $query) => $query->featured())
            ->when($onSale, fn (Builder $query) => $query->onSale())
            ->when($minPrice !== null, fn (Builder $query) => $query->where('price', '>=', $minPrice))
            ->when($maxPrice !== null, fn (Builder $query) => $query->where('price', '<=', $maxPrice));

        match ($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            default => $query->latest(),
        };

        $products = $query
            ->paginate((int) config('shop.products.page_size'))
            ->withQueryString()
            ->through(fn (Product $product): array => (new ProductResource($product))->resolve());

        $filterCategories = Category::query()
            ->active()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get();

        $filterBrands = Brand::query()
            ->active()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get();

        return Inertia::render('Storefront/Products', [
            'products' => $products,
            'categories' => CategoryResource::collection($filterCategories)->resolve(),
            'brands' => BrandResource::collection($filterBrands)->resolve(),
            'filters' => [
                'q' => $search,
                'categories' => $categorySlugs,
                'brands' => $brandSlugs,
                'featured' => $featured,
                'on_sale' => $onSale,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
                'sort' => $sort,
            ],
            'priceBounds' => [
                'min' => (float) (Product::query()->active()->min('price') ?? 0),
                'max' => (float) (Product::query()->active()->max('price') ?? 0),
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['category:id,name,slug', 'brand:id,name,slug']);

        $related = $product->category_id === null
            ? collect()
            : Product::query()
                ->active()
                ->where('category_id', $product->category_id)
                ->whereKeyNot($product->getKey())
                ->with(['category:id,name,slug', 'brand:id,name,slug'])
                ->latest()
                ->limit(4)
                ->get();

        return Inertia::render('Storefront/ProductDetail', [
            'product' => (new ProductResource($product))->resolve(),
            'related' => ProductResource::collection($related)->resolve(),
        ]);
    }

    /**
     * @return list<string>
     */
    private function csv(?string $value): array
    {
        return collect(explode(',', (string) $value))
            ->map(fn (string $part): string => trim($part))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }
}
