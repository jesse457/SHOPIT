<?php

namespace App\Livewire\Pages;

use App\Models\Category;
use Livewire\Attributes\Title;
use Livewire\Component;

class Categories extends Component
{
    #[Title('Categories - DCodeMania')]
    public function render()
    {
        $categories = Category::where('is_active', 1)->get();
        return view('livewire.pages.categories',[
            'categories' => $categories
        ]);
    }
}
