{{-- <div class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
    <section class="py-10 rounded-lg bg-gray-50 font-poppins dark:bg-gray-800">
        <div class="px-4 py-4 mx-auto max-w-7xl lg:py-6 md:px-6">
            <div class="flex flex-wrap mb-24 -mx-3">
                <div class="w-full pr-2 lg:w-1/4 lg:block">
                    <div class="p-4 mb-5 bg-white border border-gray-200 dark:border-gray-900 dark:bg-gray-900">
                        <h2 class="text-2xl font-bold dark:text-gray-400"> Categories</h2>
                        <div class="w-16 pb-2 mb-6 border-b border-rose-600 dark:border-gray-400"></div>
                        <ul>
                            @foreach ($categories as $category)
                                <li class="mb-4" wire:key = "{{$category->id}}">
                                    <label for="{{$category->slug}}" class="flex items-center dark:text-gray-400 ">
                                        <input type="checkbox" wire:model.live='select_categories' id="{{$category->slug}}" value="{{$category->id}}" class="w-4 h-4 mr-2">
                                        <span class="text-lg">{{$category->name}}</span>
                                    </label>
                                </li>
                            @endforeach
                        </ul>

                    </div>
                    <div class="p-4 mb-5 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-900">
                        <h2 class="text-2xl font-bold dark:text-gray-400">Brand</h2>
                        <div class="w-16 pb-2 mb-6 border-b border-rose-600 dark:border-gray-400"></div>
                        <ul>
                            @foreach ($brands as $brand)
                            <li class="mb-4" wire:key = "{{$brand->id}}">
                                <label for="{{$brand->slug}}" class="flex items-center dark:text-gray-300">
                                    <input type="checkbox" wire:model.live='select_brands' id="{{$brand->slug}}" value="{{$brand->id}}" class="w-4 h-4 mr-2">
                                    <span class="text-lg dark:text-gray-400">{{$brand->name}}</span>
                                </label>
                            </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="p-4 mb-5 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-900">
                        <h2 class="text-2xl font-bold dark:text-gray-400">Product Status</h2>
                        <div class="w-16 pb-2 mb-6 border-b border-rose-600 dark:border-gray-400"></div>
                        <ul>
                            <li class="mb-4">
                                <label for="featured" class="flex items-center dark:text-gray-300">
                                    <input type="checkbox" id="featured" wire:model.live = 'featured' value="1" class="w-4 h-4 mr-2">
                                    <span class="text-lg dark:text-gray-400">Featured Products</span>
                                </label>
                            </li>
                            <li class="mb-4">
                                <label for="on_sale" class="flex items-center dark:text-gray-300">
                                    <input type="checkbox" id="on_sale" wire:model.live = 'on_sale' class="w-4 h-4 mr-2">
                                    <span class="text-lg dark:text-gray-400">On Sale</span>
                                </label>
                            </li>
                        </ul>
                    </div>

                    <div class="p-4 mb-5 bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-900">
                        <h2 class="text-2xl font-bold dark:text-gray-400">Price</h2>
                        <div class="w-16 pb-2 mb-6 border-b border-rose-600 dark:border-gray-400"></div>
                        <div>

                            <div>{{Number::currency($price_range,'XAF')}}</div>
                            <input type="range"
                                class="w-full h-1 mb-4 bg-blue-100 rounded appearance-none cursor-pointer"
                                max="2000000" wire:model.live = 'price_range' value="100000" step="1000">
                            <div class="flex justify-between ">
                                <span class="inline-block text-lg font-bold text-blue-400 ">{{Number::currency(1000,'XAF')}}</span>
                                <span class="inline-block text-lg font-bold text-blue-400 ">{{Number::currency(2000000,'XAF')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full px-3 lg:w-3/4">
                    <div class="px-3 mb-4">
                        <div
                            class="items-center justify-between hidden px-3 py-2 bg-gray-100 md:flex dark:bg-gray-900 ">
                            <div class="flex items-center justify-between">
                                <select wire:model.live='sort' id=""
                                    class="block w-40 text-base bg-gray-100 cursor-pointer dark:text-gray-400 dark:bg-gray-900">
                                    <option value="latest">Sort by latest</option>
                                    <option value="price">Sort by Price</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center ">


                        @foreach ($products as $product)
                            <div class="w-full px-3 mb-6 sm:w-1/2 md:w-1/3" wire:key="{{$brand->id}}">
                                <div class="border border-gray-300 dark:border-gray-700">
                                    <div class="relative bg-gray-200">
                                        <a href="{{ route('product.detail', ['slug' => $product->slug]) }}" class="">
                                            <img src="{{ url('storage', $product->images[0]) }}" alt=""
                                                class="object-cover w-full h-56 mx-auto ">
                                        </a>
                                    </div>
                                    <div class="p-3 ">
                                        <div class="flex items-center justify-between gap-2 mb-2">
                                            <h3 class="text-xl font-medium dark:text-gray-400">
                                                {{ $product->name }}
                                            </h3>
                                        </div>
                                        <p class="text-lg ">
                                            <span
                                                class="text-green-600 dark:text-green-600">{{ Number::currency($product->price, 'XAF') }}</span>
                                        </p>
                                    </div>
                                    <div class="flex justify-center p-4 border-t border-gray-300 dark:border-gray-700">

                                        <a href="#"  wire:click.prevent='addToCart({{ $product->id }})'
                                            class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="w-4 h-4 bi bi-cart3 " viewBox="0 0 16 16">
                                                <path
                                                    d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                                </path>
                                            </svg><span wire:loading.remove wire:target='addToCart({{ $product->id }})'>Add to Cart</span><span wire:loading wire:target='addToCart({{ $product->id }})'>Adding...</span>
                                        </a>

                                    </div>
                                </div>
                            </div>
                        @endforeach



                    </div>
                    <!-- pagination start -->
                    <div class="flex justify-end mt-6">
                        {{ $products->links() }}
                    </div>
                    <!-- pagination end -->
                    @session('success')
                    <div id="success-message" class="fixed p-6 border-l-4 border-green-500 bottom-4 right-4 rounded-r-xl bg-green-50">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <div class="text-sm text-green-600">
                                    <p>Your Order placed Successfully. 😍</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endsession
                </div>
            </div>
        </div>
    </section>

</div>




 --}}
 <div class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto pt-20">
    <section class="py-10 rounded-lg bg-gray-50 font-poppins dark:bg-gray-800">
        <div class="px-4 py-4 mx-auto max-w-7xl lg:py-6 md:px-6">
            <!-- Mobile filter toggle button -->


            <div class="flex flex-wrap mb-24 -mx-3">
                <!-- Filters section -->
                <div id="filter-section" class="fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out transform -translate-x-full bg-white shadow-xl dark:bg-gray-900 lg:relative lg:translate-x-0 lg:w-1/4 lg:pr-2">
                    <div class="h-full p-4 overflow-y-auto">
                        <div class="mb-5">
                            <h2 class="text-2xl font-bold dark:text-gray-400">Categories</h2>
                            <div class="w-16 pb-2 mb-6 border-b border-rose-600 dark:border-gray-400"></div>
                            <ul>
                                @foreach ($categories as $category)
                                    <li class="mb-4" wire:key="{{$category->id}}">
                                        <label for="{{$category->slug}}" class="flex items-center dark:text-gray-400 ">
                                            <input type="checkbox" wire:model.live='select_categories' id="{{$category->slug}}" value="{{$category->id}}" class="w-4 h-4 mr-2">
                                            <span class="text-lg">{{$category->name}}</span>
                                        </label>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <!-- Other filter sections (Brand, Product Status, Price) remain the same -->
                        <!-- ... -->
                    </div>
                </div>

                <!-- Product listing section -->
                <div class="w-full px-3 lg:w-3/4">

                    <div class="mb-4 lg:hidden">
                        <button id="filter-toggle" class="p-2 bg-white rounded-md shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    <!-- Sorting dropdown -->
                    <div class="px-3 mb-4">
                        <div class="items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-900">
                            <div class="flex items-center justify-between">
                                <select wire:model.live='sort' id=""
                                    class="block w-full text-base bg-gray-100 cursor-pointer md:w-40 dark:text-gray-400 dark:bg-gray-900">
                                    <option value="latest">Sort by latest</option>
                                    <option value="price">Sort by Price</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Product grid -->
                    <div class="flex flex-wrap items-center">
                        @foreach ($products as $product)
                            <div class="w-full px-3 mb-6 sm:w-1/2 md:w-1/3" wire:key="{{$product->id}}">
                                <div class="border border-gray-300 dark:border-gray-700">
                                    <div class="relative bg-gray-200">
                                        <a href="{{ route('product.detail', ['slug' => $product->slug]) }}" class="">
                                            <img src="{{ url('storage', $product->images[0]) }}" alt=""
                                                class="object-cover w-full h-56 mx-auto ">
                                        </a>
                                    </div>
                                    <div class="p-3 ">
                                        <div class="flex items-center justify-between gap-2 mb-2">
                                            <h3 class="text-xl font-medium dark:text-gray-400">
                                                {{ $product->name }}
                                            </h3>
                                        </div>
                                        <p class="text-lg ">
                                            <span class="text-green-600 dark:text-green-600">{{ Number::currency($product->price, 'XAF') }}</span>
                                        </p>
                                    </div>
                                    <div class="flex justify-center p-4 border-t border-gray-300 dark:border-gray-700">
                                        <a href="#" wire:click.prevent='addToCart({{ $product->id }})'
                                            class="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="w-4 h-4 bi bi-cart3 " viewBox="0 0 16 16">
                                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                                </path>
                                            </svg>
                                            <span wire:loading.remove wire:target='addToCart({{ $product->id }})'>Add to Cart</span>
                                            <span wire:loading wire:target='addToCart({{ $product->id }})'>Adding...</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Pagination -->
                    <div class="flex justify-end mt-6">
                        {{ $products->links() }}
                    </div>

                    <!-- Success message -->
                    @session('success')
                    <div id="success-message" class="fixed p-6 border-l-4 border-green-500 bottom-4 right-4 rounded-r-xl bg-green-50">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <div class="text-sm text-green-600">
                                    <p>Your Order placed Successfully. 😍</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endsession
                </div>
            </div>
        </div>
    </section>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const filterToggle = document.getElementById('filter-toggle');
        const filterSection = document.getElementById('filter-section');
        const body = document.body;

        filterToggle.addEventListener('click', function() {
            filterSection.classList.toggle('-translate-x-full');
            body.classList.toggle('overflow-hidden');
        });

        // Close filter section when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideFilter = filterSection.contains(event.target);
            const isClickOnToggle = filterToggle.contains(event.target);

            if (!isClickInsideFilter && !isClickOnToggle && !filterSection.classList.contains('-translate-x-full')) {
                filterSection.classList.add('-translate-x-full');
                body.classList.remove('overflow-hidden');
            }
        });
    });


</script>
