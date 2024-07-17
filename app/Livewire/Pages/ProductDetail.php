<?php

namespace App\Livewire\Pages;

use App\Helpers\CartManagement;
use App\Livewire\Partials\Navbar;
use App\Models\Product;
use Filament\Notifications\Notification;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Products Details - DCodeMania')]
class ProductDetail extends Component
{
    public $slug;
    public $quantity = 1;

    public function mount($slug)
    {
        $this->slug = $slug;
    }
    public function addToCart($product_id)
    {
        Notification::make()
        ->title('Saved successfully')
        ->success()
        ->send();
        $total_count = CartManagement::AddItemsToCart($product_id,$this->quantity);
        $this->dispatch('update-cart-count', total_count: $total_count)->to(Navbar::class);
        Notification::make()
        ->title('Saved successfully')
        ->success()
        ->send();
        // $this->alert('success','Product added to Cart ',[
        //     'position' => 'bottom-end',
        //     'timer' => 3000,
        //     'toast' => true
        // ]);
    }

    public function increaseQty(){
        $this->quantity++;
    }

    public function decreaseQty(){
        if($this->quantity>1){
            $this->quantity--;
        }

    }

    public function render()
    {

        return view('livewire.pages.product-detail',[
            'products' => Product::where('slug',$this->slug)->firstOrFail()
        ]);
    }
}
