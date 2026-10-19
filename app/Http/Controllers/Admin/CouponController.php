<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CouponRequest;
use App\Http\Resources\Admin\CouponResource;
use App\Models\Coupon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));

        $coupons = Coupon::query()
            ->when($search !== '', fn (Builder $query) => $query->where('code', 'like', '%'.$search.'%'))
            ->when(($validated['status'] ?? null) === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when(($validated['status'] ?? null) === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Coupon $coupon): array => (new CouponResource($coupon))->resolve());

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'filters' => [
                'q' => $search,
                'status' => $validated['status'] ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => null,
        ]);
    }

    public function store(CouponRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        Coupon::query()->create($data);

        return redirect()
            ->route('admin.coupons.index')
            ->withToast('Coupon created.');
    }

    public function edit(Coupon $coupon): Response
    {
        return Inertia::render('Admin/Coupons/Form', [
            'coupon' => (new CouponResource($coupon))->resolve(),
        ]);
    }

    public function update(CouponRequest $request, Coupon $coupon): RedirectResponse
    {
        $data = $request->validated();
        $data['is_active'] = $request->boolean('is_active');

        $coupon->update($data);

        return redirect()
            ->route('admin.coupons.index')
            ->withToast('Coupon updated.');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $coupon->delete();

        return redirect()
            ->route('admin.coupons.index')
            ->withToast('Coupon removed.');
    }
}
