<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\AccountPasswordRequest;
use App\Http\Requests\Account\AccountUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Storefront/Account', [
            'summary' => [
                'orders_count' => $user->orders()->count(),
                'member_since' => $user->created_at?->toIso8601String(),
            ],
        ]);
    }

    public function update(AccountUpdateRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return back()->withToast('Account updated.');
    }

    public function updatePassword(AccountPasswordRequest $request): RedirectResponse
    {
        $request->user()
            ->forceFill(['password' => $request->string('password')->toString()])
            ->save();

        $request->session()->regenerate();

        return back()->withToast('Password updated.');
    }
}
