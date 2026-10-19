<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ReviewResource;
use App\Models\Review;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'approved'])],
        ]);

        $reviews = Review::query()
            ->with(['product:id,name,slug', 'user:id,name,email'])
            ->when(($validated['status'] ?? null) === 'pending', fn (Builder $query) => $query->where('is_approved', false))
            ->when(($validated['status'] ?? null) === 'approved', fn (Builder $query) => $query->where('is_approved', true))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Review $review): array => (new ReviewResource($review))->resolve());

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'filters' => [
                'status' => $validated['status'] ?? null,
            ],
        ]);
    }

    public function update(Request $request, Review $review): RedirectResponse
    {
        $request->validate([
            'is_approved' => ['required', 'boolean'],
        ]);

        $review->update([
            'is_approved' => $request->boolean('is_approved'),
        ]);

        return back()->withToast(
            $review->is_approved ? 'Review approved.' : 'Review rejected.',
        );
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->withToast('Review removed.');
    }
}
