<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Support\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use HandlesUploads;

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer'],
            'brand' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'stock' => ['nullable', Rule::in(['low', 'out'])],
            'sort' => ['nullable', Rule::in(['latest', 'name', 'price_asc', 'price_desc'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));
        $sort = $validated['sort'] ?? 'latest';

        $query = Product::query()
            ->with(['category:id,name,slug', 'brand:id,name,slug'])
            ->withCount('orderItems')
            ->search($search)
            ->when($validated['category'] ?? null, fn (Builder $query, $category) => $query->where('category_id', $category))
            ->when($validated['brand'] ?? null, fn (Builder $query, $brand) => $query->where('brand_id', $brand))
            ->when(($validated['status'] ?? null) === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when(($validated['status'] ?? null) === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->when(($validated['stock'] ?? null) === 'low', fn (Builder $query) => $query
                ->where('stock_quantity', '>', 0)
                ->whereColumn('stock_quantity', '<=', 'low_stock_threshold'))
            ->when(($validated['stock'] ?? null) === 'out', fn (Builder $query) => $query->where('stock_quantity', 0));

        match ($sort) {
            'name' => $query->orderBy('name'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->latest(),
        };

        $products = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $product): array => (new ProductResource($product))->resolve());

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'q' => $search,
                'category' => $validated['category'] ?? null,
                'brand' => $validated['brand'] ?? null,
                'status' => $validated['status'] ?? null,
                'stock' => $validated['stock'] ?? null,
                'sort' => $sort,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'product' => null,
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['images', 'remove_images']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : null;
        $data['images'] = $this->storeImages($request->file('images'), 'products');

        Product::query()->create($data);

        return redirect()
            ->route('admin.products.index')
            ->withToast('Product created.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['category:id,name,slug', 'brand:id,name,slug'])->loadCount('orderItems');

        return Inertia::render('Admin/Products/Form', [
            'product' => (new ProductResource($product))->resolve(),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name', 'slug']),
            'brands' => Brand::query()->orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->safe()->except(['images', 'remove_images']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : $product->slug;

        $remove = collect($request->input('remove_images', []))
            ->intersect($product->images ?? [])
            ->values()
            ->all();

        foreach ($remove as $path) {
            Media::delete($path);
        }

        $existing = array_values(array_diff($product->images ?? [], $remove));
        $uploaded = $this->storeImages($request->file('images'), 'products');

        $data['images'] = array_slice(array_merge($existing, $uploaded), 0, 5);

        $product->update($data);

        return redirect()
            ->route('admin.products.index')
            ->withToast('Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->withToast('Product removed.');
    }
}
