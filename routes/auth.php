<?php

use App\Livewire\Pages\Auth\ForgotPassword;
use App\Livewire\Pages\Auth\Login;
use App\Livewire\Pages\Auth\Register;
use App\Livewire\Pages\Auth\ResetPassword;
use App\Livewire\Pages\CancelPage;
use App\Livewire\Pages\SucessPage;
use Illuminate\Support\Facades\Route;

Route::get('login', Login::class)->name('login');
Route::get('register',Register::class);
Route::get('forgot-password',ForgotPassword::class)->name('password.request');
Route::get('reset-password/{token}',ResetPassword::class)->name('password.reset');
Route::get('success',SucessPage::class);
Route::get('cancel', CancelPage::class);
Route::get('log-out', function (){
    auth()->logout();
    return redirect()->to('/');
});


