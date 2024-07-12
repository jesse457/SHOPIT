<?php

use App\Http\Middleware\CheckIsField;
use App\Http\Middleware\TrackVisitors;
use App\Livewire\Home;
use App\Livewire\Pages\CancelPage;
use App\Livewire\Pages\Carts;
use App\Livewire\Pages\Categories;
use App\Livewire\Pages\CheckOut;
use App\Livewire\Pages\MyOrderDetail;
use App\Livewire\Pages\MyOrders;
use App\Livewire\Pages\ProductDetail;
use App\Livewire\Pages\Products;
use App\Livewire\Pages\SucessPage;
use Illuminate\Support\Facades\Route;




Route::group([], function () {
    Route::get('/', Home::class)->name('home');
    Route::get('categories', Categories::class)->name('categories');
    Route::get('products', Products::class)->name('products');
    Route::get('cart', Carts::class)->name('cart');
    Route::get('products/{slug}', ProductDetail::class)->name('product.detail');
})->middleware(TrackVisitors::class);




Route::middleware(CheckIsField::class)->group(function () {
    Route::get('checkout', CheckOut::class);
    Route::get('my-orders', MyOrders::class);
    Route::get('sucess', SucessPage::class)->name('sucess');
    Route::get('cancelled', CancelPage::class)->name('cancelled');
    Route::get('my-orders/{order}', MyOrderDetail::class);
}

);

require_once 'auth.php';
