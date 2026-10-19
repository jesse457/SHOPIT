<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\HandlesUploads;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\Storefront\CategoryResource;
use App\Models\Category;
use App\Support\Media;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use HandlesUploads;

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));

        $categories = Category::query()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', '%'.$search.'%'))
            ->when(($validated['status'] ?? null) === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when(($validated['status'] ?? null) === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Category $category): array => (new CategoryResource($category))->resolve());

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'q' => $search,
                'status' => $validated['status'] ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Form', [
            'category' => null,
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : null;

        if ($request->hasFile('image')) {
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        }

        Category::query()->create($data);
        Cache::forget('nav.categories');

        return redirect()
            ->route('admin.categories.index')
            ->withToast('Category created.');
    }

    public function edit(Category $category): Response
    {
        $category->loadCount('products');

        return Inertia::render('Admin/Categories/Form', [
            'category' => (new CategoryResource($category))->resolve(),
        ]);
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $data = $request->safe()->except(['image', 'remove_image']);
        $data['slug'] = $request->filled('slug')
            ? $request->string('slug')->toString()
            : $category->slug;

        if ($request->hasFile('image')) {
            Media::delete($category->image);
            $data['image'] = $this->storeImage($request->file('image'), 'categories');
        } elseif ($request->boolean('remove_image')) {
            Media::delete($category->image);
            $data['image'] = null;
        }

        $category->update($data);
        Cache::forget('nav.categories');

        return redirect()
            ->route('admin.categories.index')
            ->withToast('Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if ($category->products()->exists()) {
            return back()->withToast(
                'Move or remove the products in this category first.',
                'error',
            );
        }

        $category->delete();
        Cache::forget('nav.categories');

        return redirect()
            ->route('admin.categories.index')
            ->withToast('Category removed.');
    }
}
