<?php

namespace App\Livewire\Pages;

use App\Helpers\CartManagement;
use Livewire\Attributes\Title;
use Livewire\Component;

class CheckOut extends Component
{
    public $first_name;

    public $cart_items = [];

    public $grand_total;

    public $last_name;

    public $zip_code;

    public $street_address;

    public $city;

    public $state;

    public $phone;

    public $payment_method;
    #[Title('Check Out - DCodeMania')]
    public function render()
    {
        return view('livewire.pages.check-out');
    }

    public function mount(){
        $this->cart_items = CartManagement::getCartItemsFromCookie();
        $this->grand_total = CartManagement::calculateGrandTotal($this->cart_items);
    }

    public function save(){
        $this->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'zip_code' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'payment_method' => 'required|max:255',
            'city' => 'required|string|max:255',
            'street_address' => 'required|string|max:255',
            'state' => 'required|string|max:255',
        ]);
    }
}
