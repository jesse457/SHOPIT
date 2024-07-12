<?php

namespace App\Livewire;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Livewire\Attributes\Title;
use Livewire\Component;

class Home extends Component
{
    #[Title('Home Page - DCodeMania')]
    public function render()
    {
        $brands = Brand::where('is_active', 1)->get();
        $categories = Category::where('is_active', 1)->get();
        $products = Product::all()->take(6);
        return view('livewire.home',[
            'brands' => $brands,
            'categories' => $categories,
            'products' => $products
        ]);
    }
}
