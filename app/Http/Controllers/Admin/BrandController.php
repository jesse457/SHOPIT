<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Http\Resources\Storefront\BrandResource;
use App\Models\Brand;
use App\Support\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    use HandlesUploads;

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));

        $brands = Brand::query()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', '%'.$search.'%'))
            ->when(($validated['status'] ?? null) === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when(($validated['status'] ?? null) === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Brand $brand): array => (new BrandResource($brand))->resolve());

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
            'filters' => [
                'q' => $search,
                'status' => $validated['status'] ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Brands/Form', [
            'brand' => null,
        ]);
    }

    public function store(BrandRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : null;

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), 'brands');
        }

        Brand::query()->create($data);

        return redirect()
            ->route('admin.brands.index')
            ->withToast('Brand created.');
    }

    public function edit(Brand $brand): Response
    {
        $brand->loadCount('products');

        return Inertia::render('Admin/Brands/Form', [
            'brand' => (new BrandResource($brand))->resolve(),
        ]);
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : $brand->slug;

        if ($request->hasFile('image')) {
            Media::delete($brand->image);
            $data['image'] = $this->storeImage($request->file('image'), 'brands');
        } elseif ($request->boolean('remove_image')) {
            Media::delete($brand->image);
            $data['image'] = null;
        }

        $brand->update($data);

        return redirect()
            ->route('admin.brands.index')
            ->withToast('Brand updated.');
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->products()->exists()) {
            return back()->withToast(
                'Move or remove the products in this brand first.',
                'error',
            );
        }

        $brand->delete();

        return redirect()
            ->route('admin.brands.index')
            ->withToast('Brand removed.');
    }
}
