<?php

namespace App\Livewire\Pages;

use App\Helpers\CartManagement;
use App\Models\Address;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Title;
use Livewire\Component;
use Stripe\Checkout\Session;
use Stripe\Stripe;

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
        $line_items = [];
foreach ($this->cart_items as $cart_item) {
    $line_items[] = [
        'price_data' => [
            'currency' => 'xaf',
            'unit_amount' => $cart_item['unit_amount']*100,
            'product_data' => [
             'name' => $cart_item['name']
            ]
            ],
        'quantity' => $cart_item['quantity']
    ];
}
$redirect_url = '';
if($this->payment_method == 'stripe'){
    // Process payment with Stripe here.
    Stripe::setApiKey(env('STRIPE_SECRET'));
    $sessionCheckout = Session::create([
        'mode' => 'payment',
        'payment_method_types' => ['card'],
        'customer_email' => auth()->user()->email,
        'line_items' => $line_items,
        'success_url' => route('sucess') . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => route('cancelled'),
    ]);

    $redirect_url = $sessionCheckout->url;
}
else{
    $redirect_url = route('sucess');
}


$order = Order::create([
    'user_id' => Auth::user()->id,
    'payment_method' => $this->payment_method,
    'grand_total' => $this->grand_total,
   'payment_status' => 'pending',
   'status' => 'new',
   'currency' => 'xaf',
   'shipping_amount' => 0,
   'shipping_method' => 'none',
   'notes' => 'Order Placed by '. auth()->user()->name,
]);

$address = $order->address()->create([
'first_name' => $this->first_name,
'last_name' => $this->last_name,
'phone' => $this->phone,
'street_address' => $this->street_address,
'city' => $this->city,
'state' => $this->state,
'zip_code' => $this->zip_code,
]);

$order->items()->createMany($this->cart_items);
CartManagement::clearCartItems();

return redirect($redirect_url);
    }
}
