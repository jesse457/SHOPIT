<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CustomerRequest;
use App\Http\Resources\Admin\CustomerResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::in(['admins', 'customers'])],
        ]);

        $search = trim((string) ($validated['q'] ?? ''));

        $customers = User::query()
            ->withCount('orders')
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->when(($validated['role'] ?? null) === 'admins', fn (Builder $query) => $query->where('is_admin', true))
            ->when(($validated['role'] ?? null) === 'customers', fn (Builder $query) => $query->where('is_admin', false))
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $user): array => (new CustomerResource($user))->resolve());

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'q' => $search,
                'role' => $validated['role'] ?? null,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Customers/Form', [
            'customer' => null,
        ]);
    }

    public function store(CustomerRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('password');
        $data['password'] = $request->string('password')->toString();
        $data['is_admin'] = $request->boolean('is_admin');
        $data['email_verified_at'] = now();

        User::query()->create($data);

        return redirect()
            ->route('admin.customers.index')
            ->withToast('Customer created.');
    }

    public function edit(User $user): Response
    {
        $user->loadCount('orders');

        return Inertia::render('Admin/Customers/Form', [
            'customer' => (new CustomerResource($user))->resolve(),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function update(CustomerRequest $request, User $user): RedirectResponse
    {
        if (
            $request->user()?->id === $user->id
            && ! $request->boolean('is_admin')
        ) {
            throw ValidationException::withMessages([
                'is_admin' => 'You cannot remove your own admin access.',
            ]);
        }

        $data = $request->safe()->except('password');
        $data['is_admin'] = $request->boolean('is_admin');

        if ($request->filled('password')) {
            $data['password'] = $request->string('password')->toString();
        }

        $user->update($data);

        return redirect()
            ->route('admin.customers.index')
            ->withToast('Customer updated.');
    }
}
