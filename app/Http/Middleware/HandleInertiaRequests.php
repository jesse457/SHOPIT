<?php

namespace App\Http\Middleware;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * @var string
     */
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'shop' => config('shop'),
            'auth' => [
                'user' => $user?->only(['id', 'name', 'email', 'is_admin']),
            ],
            'cart' => [
                'count' => (int) array_sum(session('cart', [])),
            ],
            'wishlist' => [
                'count' => $user?->wishlists()->count() ?? 0,
            ],
            'navCategories' => fn (): array => Cache::remember(
                'nav.categories',
                now()->addMinutes(5),
                fn (): array => Category::query()
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get(['id', 'name', 'slug'])
                    ->toArray(),
            ),
            'toast' => session('toast'),
            'status' => session('status'),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ];
    }
}
