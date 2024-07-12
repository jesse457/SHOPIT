<?php

namespace App\Livewire\Pages;

use App\Livewire\Partials\Navbar;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Helpers\CartManagement; // Import the CartManagement class
use Livewire\Attributes\Title;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;

#[Title('Products - DCodeMania')]
class Products extends Component
{
    // use LivewireAlert;
    use WithPagination;

    #[Url]
    public $select_categories = [];

    #[Url]
    public $select_brands = [];

    #[Url]
    public $featured;

    #[Url]
    public $on_sale;

    #[Url]
    public $price_range = 300000;

    #[Url]
    public $sort = 'latest';

    public function addToCart($product_id)
    {
        $total_count = CartManagement::AddItemsToCart($product_id);
        $this->dispatch('update-cart-count', total_count: $total_count)->to(Navbar::class);
        if($total_count){
            return session()->flash('success');
        }

        // $this->alert('success','Product added to Cart ',[
        //     'position' => 'bottom-end',
        //     'timer' => 3000,
        //     'toast' => true
        // ]);
    }

    /**
     * Renders the products page with filters and pagination.
     *
     * @return \Illuminate\View\View
     */
    public function render()
    {
        // Initialize a query builder for the Product model with an active status filter
        $products = Product::query()->where('is_active', 1);

        // If categories are selected, add a whereIn clause to the query
        if (! empty($this->select_categories)) {
            $products->whereIn('category_id', $this->select_categories);
        }

        // If brands are selected, add a whereIn clause to the query
        if (! empty($this->select_brands)) {
            $products->whereIn('brand_id', $this->select_brands);
        }

        if ($this->featured) {
            $products->where('is_featured', 1);
        }

        if ($this->on_sale) {
            $products->where('on_sale', 1);
        }

        if ($this->price_range) {
            $products->whereBetween('price', [0, $this->price_range]);
        }

        if ($this->sort == 'latest') {
            $products->latest();
        }

        if ($this->sort = 'price') {
            $products->OrderBy('price');
        }

        // Paginate the filtered products and pass them to the view along with brands and categories
        return view('livewire.pages.products', [
            'products' => $products->paginate(6),
            'brands' => Brand::where('is_active', 1)->get(['id', 'name', 'slug']),
            'categories' => Category::where('is_active', 1)->get(),
        ]);
    }
}
