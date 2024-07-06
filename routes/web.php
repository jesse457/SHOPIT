<?php

use App\Livewire\Home;
use App\Livewire\Pages\Carts;
use App\Livewire\Pages\Categories;
use App\Livewire\Pages\CheckOut;
use App\Livewire\Pages\MyOrderDetail;
use App\Livewire\Pages\MyOrders;
use App\Livewire\Pages\ProductDetail;
use App\Livewire\Pages\Products;
use Illuminate\Support\Facades\Route;

Route::get('/', Home::class);


Route::middleware('guest')->group(function(){
    Route::get('/categories', Categories::class);
    Route::get('products', Products::class);
    Route::get('cart', Carts::class);
    Route::get('products/{slug}', ProductDetail::class);
});


Route::middleware('auth')->group(function () {

    Route::get('checkout', CheckOut::class);
    Route::get('my-orders', MyOrders::class);
    Route::get('my-orders/{order]', MyOrderDetail::class);
}

);

require_once 'auth.php';
