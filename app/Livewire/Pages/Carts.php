<?php

namespace App\Livewire\Pages;

use App\Helpers\CartManagement;
use App\Livewire\Partials\Navbar;
use App\Models\User;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title('Cart - DCodeMania')]
class Carts extends Component
{
    public $quantity;

    public $cart_items = [];

    public $grand_total;

    public function render()
    {
        return view('livewire.pages.carts');
    }

    public function increaseQty($product_id)
    {
        $this->cart_items = CartManagement::incrementQuantityToCartItem($product_id);
        $this->grand_total = CartManagement::calculateGrandTotal($this->cart_items);
    }

    public function decreaseQty($product_id)
    {
        $this->cart_items = CartManagement::decrementQuantityToCartItem($product_id);
        $this->grand_total = CartManagement::calculateGrandTotal($this->cart_items);

    }

    public function removeItem($product_id)
    {
        $this->cart_items = CartManagement::removeCartItem($product_id);
        $this->grand_total = CartManagement::calculateGrandTotal($this->cart_items);
        $this->dispatch('update-cart-count', total_count: $this->grand_total)->to(Navbar::class);
    }

    public function mount()
    {
        $this->cart_items = CartManagement::getCartItemsFromCookie();
        $this->grand_total = CartManagement::calculateGrandTotal($this->cart_items);
    }
}
