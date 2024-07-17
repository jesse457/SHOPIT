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
    public $price_range = 0;

    #[Url]
    public $sort = 'latest';

    public function addToCart($product_id)
    {
        $total_count = CartManagement::AddItemsToCart($product_id);
        $this->dispatch('update-cart-count', total_count: $total_count)->to(Navbar::class);
        if ($total_count) {
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
        // Retrieve all products from the database initially
        $allProducts = Product::all();

        // Start a query on the Product model
        $query = Product::query();

        $filtersApplied = false;

        // If categories are selected, filter the query
        if (!empty($this->select_categories)) {
            $query->whereIn('category_id', $this->select_categories);
            $filtersApplied = true;
        }

        // If brands are selected, filter the query
        if (!empty($this->select_brands)) {
            $query->whereIn('brand_id', $this->select_brands);
            $filtersApplied = true;
        }

        // If featured products are selected, filter the query
        if ($this->featured) {
            $query->where('is_featured', true);
            $filtersApplied = true;
        }

        // If on-sale products are selected, filter the query
        if ($this->on_sale) {
            $query->where('on_sale', true);
            $filtersApplied = true;
        }

        // If price range is set, filter the query
        if ($this->price_range) {
            $query->whereBetween('price', [0, $this->price_range]);
            $filtersApplied = true;
        }

        // Apply sorting
        if ($this->sort == 'latest') {
            $query->orderBy('created_at', 'desc');
            $filtersApplied = true;
        } elseif ($this->sort == 'price_asc') {
            $query->orderBy('price', 'asc');
            $filtersApplied = true;
        } elseif ($this->sort == 'price_desc') {
            $query->orderBy('price', 'desc');
            $filtersApplied = true;
        }

        // Check if any filters were applied, then paginate the filtered products, otherwise paginate all products
        if ($filtersApplied) {
            $products = $query->paginate(6);
        } else {
            $products = Product::paginate(6);
        }

        // Return the view with products, brands, and categories
        return view('livewire.pages.products', [
            'products' => $products,
            'brands' => Brand::all(),
            'categories' => Category::all(),
        ]);
    }
}
