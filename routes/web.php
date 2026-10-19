<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Storefront\AccountController;
use App\Http\Controllers\Storefront\CartController;
use App\Http\Controllers\Storefront\CategoryController;
use App\Http\Controllers\Storefront\CheckoutCancelController;
use App\Http\Controllers\Storefront\CheckoutController;
use App\Http\Controllers\Storefront\CheckoutRetryController;
use App\Http\Controllers\Storefront\CheckoutSuccessController;
use App\Http\Controllers\Storefront\CouponController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\OrderController;
use App\Http\Controllers\Storefront\ProductController;
use App\Http\Controllers\Storefront\ReviewController;
use App\Http\Controllers\Storefront\StripeWebhookController;
use App\Http\Controllers\Storefront\WishlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function (): void {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])
        ->middleware('throttle:login')
        ->name('login.store');

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store'])
        ->middleware('throttle:register')
        ->name('register.store');

    Route::get('forgot-password', [ForgotPasswordController::class, 'create'])
        ->name('password.request');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('password.email');

    Route::get('reset-password/{token}', [ResetPasswordController::class, 'create'])
        ->name('password.reset');
    Route::post('reset-password', [ResetPasswordController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('password.update');
});

Route::post('logout', LogoutController::class)
    ->middleware('auth')
    ->name('logout');

Route::middleware('auth')->group(function (): void {
    Route::get('checkout', [CheckoutController::class, 'index'])
        ->name('checkout.index');
    Route::post('checkout', [CheckoutController::class, 'store'])
        ->middleware('throttle:checkout')
        ->name('checkout.store');

    Route::get('checkout/success/{order}', CheckoutSuccessController::class)
        ->name('checkout.success');
    Route::get('checkout/cancelled/{order}', CheckoutCancelController::class)
        ->name('checkout.cancelled');
    Route::post('checkout/retry/{order}', CheckoutRetryController::class)
        ->middleware('throttle:checkout')
        ->name('checkout.retry');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    Route::get('account', [AccountController::class, 'index'])->name('account.index');
    Route::patch('account', [AccountController::class, 'update'])->name('account.update');
    Route::patch('account/password', [AccountController::class, 'updatePassword'])
        ->name('account.password');

    Route::get('wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('wishlist/{product:slug}', [WishlistController::class, 'store'])
        ->name('wishlist.store');
    Route::delete('wishlist/{product:slug}', [WishlistController::class, 'destroy'])
        ->name('wishlist.destroy');

    Route::post('products/{product:slug}/reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('reviews.store');
});

Route::post('stripe/webhook', StripeWebhookController::class)
    ->middleware('throttle:webhook')
    ->name('stripe.webhook');

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('products', AdminProductController::class)
            ->except(['show']);
        Route::resource('categories', AdminCategoryController::class)
            ->except(['show']);
        Route::resource('brands', BrandController::class)
            ->except(['show']);
        Route::resource('coupons', AdminCouponController::class)
            ->except(['show']);

        Route::get('reviews', [AdminReviewController::class, 'index'])
            ->name('reviews.index');
        Route::patch('reviews/{review}', [AdminReviewController::class, 'update'])
            ->name('reviews.update');
        Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy'])
            ->name('reviews.destroy');

        Route::get('orders', [AdminOrderController::class, 'index'])
            ->name('orders.index');
        Route::get('orders/{order}', [AdminOrderController::class, 'show'])
            ->name('orders.show');
        Route::patch('orders/{order}', [AdminOrderController::class, 'update'])
            ->name('orders.update');

        Route::get('customers', [CustomerController::class, 'index'])
            ->name('customers.index');
        Route::get('customers/create', [CustomerController::class, 'create'])
            ->name('customers.create');
        Route::post('customers', [CustomerController::class, 'store'])
            ->name('customers.store');
        Route::get('customers/{user}/edit', [CustomerController::class, 'edit'])
            ->name('customers.edit');
        Route::patch('customers/{user}', [CustomerController::class, 'update'])
            ->name('customers.update');
    });

Route::middleware('track_visitors')->group(function (): void {
    Route::get('/', HomeController::class)->name('home');
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

    Route::get('cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('cart/items', [CartController::class, 'store'])->name('cart.items.store');
    Route::patch('cart/items/{product:slug}', [CartController::class, 'update'])->name('cart.items.update');
    Route::delete('cart/items/{product:slug}', [CartController::class, 'destroy'])->name('cart.items.destroy');
    Route::delete('cart', [CartController::class, 'clear'])->name('cart.clear');

    Route::post('cart/coupon', [CouponController::class, 'store'])->name('cart.coupon.store');
    Route::delete('cart/coupon', [CouponController::class, 'destroy'])->name('cart.coupon.destroy');
});

Route::fallback(function (Request $request) {
    abort_if($request->expectsJson(), 404);

    return Inertia::render('Error/NotFound')
        ->toResponse($request)
        ->setStatusCode(404);
});
