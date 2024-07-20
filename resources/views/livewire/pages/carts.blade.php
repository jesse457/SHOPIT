{{-- <div class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
    <div class="container px-4 mx-auto">
        <h1 class="mb-4 text-2xl font-semibold">Shopping Cart</h1>
        <div class="flex flex-col gap-4 md:flex-row">
            <div class="md:w-3/4">
                <div class="p-6 mb-4 overflow-x-auto bg-white rounded-lg shadow-md">
                    <table class="w-full">
                        <thead>
                            <tr>
                                <th class="font-semibold text-left">Product</th>
                                <th class="font-semibold text-left">Price</th>
                                <th class="font-semibold text-left">Quantity</th>
                                <th class="font-semibold text-left">Total</th>
                                <th class="font-semibold text-left">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($cart_items as $cart_item)
                                <tr wire:key='{{ $cart_item['product_id'] }}'>
                                    <td class="py-4">
                                        <div class="flex items-center">
                                            <img class="w-16 h-16 mr-4" src="{{ url('storage', $cart_item['image']) }}"
                                                alt="Product image">
                                            <span class="font-semibold">{{ $cart_item['name'] }}</span>
                                        </div>
                                    </td>
                                    <td class="py-4">{{  Number::currency($cart_item['unit_amount'], 'XAF')  }}</td>
                                    <td class="py-4">
                                        <div class="flex items-center">
                                            <button class="px-4 py-2 mr-2 border rounded-md"
                                                wire:click='decreaseQty({{$cart_item['product_id']}})'>-</button>
                                            <span class="w-8 text-center"
                                                >{{ $cart_item['quantity'] }}</span>
                                            <button class="px-4 py-2 ml-2 border rounded-md"
                                                wire:click='increaseQty({{$cart_item['product_id']}})'>+</button>
                                        </div>
                                    </td>
                                    <td class="py-4">{{ Number::currency($cart_item['total_amount'], 'XAF') }}</td>
                                    <td><button
                                            class="px-3 py-1 border-2 rounded-lg bg-slate-300 border-slate-400 hover:bg-red-500 hover:text-white hover:border-red-700" wire:click='removeItem({{$cart_item['product_id']}})'>Remove</button>
                                    </td>
                                </tr>
                                <!-- More product rows -->

                            @empty
                                <tr>
                                    <td colspan="S" class="py-4 text-4xl font-semibold text-center text-slate-500">
                                        No Items in the Found in the Cart
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="md:w-1/4">
                <div class="p-6 bg-white rounded-lg shadow-md">
                    <h2 class="mb-4 text-lg font-semibold">Summary</h2>
                    <div class="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{{  Number::currency($grand_total, 'XAF')  }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Taxes</span>
                        <span>{{  Number::currency(0, 'XAF')  }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>{{  Number::currency(0, 'XAF')  }}</span>
                    </div>
                    <hr class="my-2">
                    <div class="flex justify-between mb-2">
                        <span class="font-semibold">Total</span>
                        <span class="font-semibold">{{  Number::currency($grand_total, 'XAF')  }}</span>
                    </div>
                    @if ($cart_items)
                    <a wire:navigate href="/checkout" class="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg">Checkout</a>
                    @endif

                </div>
            </div>
        </div>
    </div>
</div> --}}


<section class="py-8 antialiased bg-white dark:bg-gray-900 md:py-16">
    <div class="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shopping Cart</h2>

        <div class="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div class="flex-none w-full mx-auto lg:max-w-2xl xl:max-w-4xl">
                <div class="space-y-6">
                    @foreach ($cart_items as $cart_item)
                        <div wire:key='{{ $cart_item['product_id'] }}'
                            class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                            <div class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                <a href="#" class="w-20 shrink-0 md:order-1">
                                    <img class="w-20 h-20 dark:hidden" src="{{ url('storage', $cart_item['image']) }}"
                                        alt="imac image" />

                                </a>

                                <label for="counter-input" class="sr-only">Choose quantity:</label>
                                <div class="flex items-center justify-between md:order-3 md:justify-end">
                                    <div class="flex items-center">
                                        <button wire:click='decreaseQty({{ $cart_item['product_id'] }})' type="button"
                                            id="decrement-button-5" data-input-counter-decrement="counter-input-5"
                                            class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shrink-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                            <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                                            </svg>
                                        </button>
                                        <input type="text" id="counter-input-5" data-input-counter
                                            class="w-10 text-sm font-medium text-center text-gray-900 bg-transparent border-0 shrink-0 focus:outline-none focus:ring-0 dark:text-white"
                                            placeholder="" value="{{ $cart_item['quantity'] }}" required />
                                        <button wire:click='increaseQty({{ $cart_item['product_id'] }})' type="button"
                                            id="increment-button-5" data-input-counter-increment="counter-input-5"
                                            class="inline-flex items-center justify-center w-5 h-5 bg-gray-100 border border-gray-300 rounded-md shrink-0 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700">
                                            <svg class="h-2.5 w-2.5 text-gray-900 dark:text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="text-end md:order-4 md:w-32">
                                        <p class="text-base font-bold text-gray-900 dark:text-white">
                                            {{ Number::currency($cart_item['total_amount'], 'XAF') }}</p>
                                    </div>
                                </div>

                                <div class="flex-1 w-full min-w-0 space-y-4 md:order-2 md:max-w-md">
                                    <a href="#"
                                        class="text-base font-medium text-gray-900 hover:underline dark:text-white">{{ $cart_item['name'] }}</a>

                                    <div class="flex items-center gap-4">
                                        <button type="button"
                                            class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                                            <svg class="me-1.5 h-5 w-5" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
                                            </svg>
                                            Add to Favorites
                                        </button>

                                        <button wire:click='removeItem({{ $cart_item['product_id'] }})' type="button"
                                            class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500">
                                            <svg class="me-1.5 h-5 w-5" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="M6 18 17.94 6M18 18 6.06 6" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

            </div>

            <div class="flex-1 max-w-4xl mx-auto mt-6 space-y-6 lg:mt-0 lg:w-full">
                <div
                    class="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <p class="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>

                    <div class="space-y-4">
                        <div class="space-y-2">
                            <dl class="flex items-center justify-between gap-4">
                                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Original price</dt>
                                <dd class="text-base font-medium text-gray-900 dark:text-white">
                                    {{ Number::currency($grand_total, 'XAF') }}</dd>
                            </dl>

                            <dl class="flex items-center justify-between gap-4">
                                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Savings</dt>
                                <dd class="text-base font-medium text-green-600">{{ Number::currency(0, 'XAF') }}</dd>
                            </dl>

                            <dl class="flex items-center justify-between gap-4">
                                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Store Pickup</dt>
                                <dd class="text-base font-medium text-gray-900 dark:text-white">
                                    {{ Number::currency(0, 'XAF') }}</dd>
                            </dl>

                            <dl class="flex items-center justify-between gap-4">
                                <dt class="text-base font-normal text-gray-500 dark:text-gray-400">Tax</dt>
                                <dd class="text-base font-medium text-gray-900 dark:text-white">
                                    {{ Number::currency(0, 'XAF') }}</dd>
                            </dl>
                        </div>

                        <dl
                            class="flex items-center justify-between gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <dt class="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                            <dd class="text-base font-bold text-gray-900 dark:text-white">
                                {{ Number::currency($grand_total, 'XAF') }}</dd>
                        </dl>
                    </div>
                    @if ($cart_items)
                        <a wire:navigate href="/checkout"
                            class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium bg-blue-400 text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Proceed
                            to Checkout</a>
                    @endif
                    {{-- <div class="flex items-center justify-center gap-2">
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
              <a href="#" title="" class="inline-flex items-center gap-2 text-sm font-medium underline text-primary-700 hover:no-underline dark:text-primary-500">
                Continue Shopping
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                </svg>
              </a>
            </div> --}}
                </div>

                {{-- <div class="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
            <form class="space-y-4">
              <div>
                <label for="voucher" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> Do you have a voucher or gift card? </label>
                <input type="text" id="voucher" class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="" required />
              </div>
              <button type="submit" class="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Apply Code</button>
            </form>
          </div> --}}
            </div>
        </div>
    </div>
</section>
