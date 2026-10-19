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
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $relations = ['category:id,name,slug', 'brand:id,name,slug'];

        $newArrivals = Product::query()
            ->active()
            ->withRating()
            ->with($relations)
            ->latest()
            ->limit(8)
            ->get();

        $departments = Category::query()
            ->active()
            ->withCount([
                'products' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get();

        $brands = Brand::query()
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('Storefront/Home', [
            'newArrivals' => ProductResource::collection($newArrivals)->resolve(),
            'departments' => CategoryResource::collection($departments)->resolve(),
            'brands' => BrandResource::collection($brands)->resolve(),
        ]);
    }
}
