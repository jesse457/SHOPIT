
<div class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto pt-20">
    <section class="py-10 rounded-lg bg-gray-50 font-poppins dark:bg-gray-800">
        <div class="px-4 py-4 mx-auto max-w-7xl lg:py-6 md:px-6">
            <!-- Mobile filter toggle button -->


            <div class="flex flex-wrap mb-24 -mx-3">
                <!-- Filters section -->
                <div class="w-full lg:w-1/4 lg:pr-8">
                    <div class="sticky top-0 space-y-6">
                        <!-- Categories -->
                        <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Categories</h2>
                            <div class="w-16 h-1 my-3 bg-blue-500 rounded-full"></div>
                            <ul class="space-y-2">
                                @foreach ($categories as $category)
                                    <li wire:key="{{$category->id}}">
                                        <label class="flex items-center group">
                                            <input type="checkbox" wire:model.live='select_categories' id="{{$category->slug}}" value="{{$category->id}}"
                                                   class="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-400 transition-colors duration-200 ease-in-out">
                                            <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">{{$category->name}}</span>
                                        </label>
                                    </li>
                                @endforeach
                            </ul>
                        </div>

                        <!-- Brands -->
                        <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Brands</h2>
                            <div class="w-16 h-1 my-3 bg-blue-500 rounded-full"></div>
                            <ul class="space-y-2">
                                @foreach ($brands as $brand)
                                    <li wire:key="{{$brand->id}}">
                                        <label class="flex items-center group">
                                            <input type="checkbox" wire:model.live='select_brands' id="{{$brand->slug}}" value="{{$brand->id}}"
                                                   class="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-400 transition-colors duration-200 ease-in-out">
                                            <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">{{$brand->name}}</span>
                                        </label>
                                    </li>
                                @endforeach
                            </ul>
                        </div>

                        <!-- Product Status -->
                        <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Product Status</h2>
                            <div class="w-16 h-1 my-3 bg-blue-500 rounded-full"></div>
                            <ul class="space-y-2">
                                <li>
                                    <label class="flex items-center group">
                                        <input type="checkbox" id="featured" wire:model.live='featured' value="1"
                                               class="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-400 transition-colors duration-200 ease-in-out">
                                        <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">Featured Products</span>
                                    </label>
                                </li>
                                <li>
                                    <label class="flex items-center group">
                                        <input type="checkbox" id="on_sale" wire:model.live='on_sale'
                                               class="w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:checked:bg-blue-400 transition-colors duration-200 ease-in-out">
                                        <span class="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors duration-200">On Sale</span>
                                    </label>
                                </li>
                            </ul>
                        </div>

                        <!-- Price Range -->
                        <div class="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
                            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">Price Range</h2>
                            <div class="w-16 h-1 my-3 bg-blue-500 rounded-full"></div>
                            <div class="mt-4">
                                <div class="text-2xl font-semibold text-blue-500 dark:text-blue-400">{{Number::currency($price_range,'XAF')}}</div>
                                <input type="range" class="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
                                       max="2000000" wire:model.live='price_range' value="100000" step="1000">
                                <div class="flex justify-between mt-2">
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{Number::currency(1000,'XAF')}}</span>
                                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{Number::currency(2000000,'XAF')}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <!-- Product listing section -->
                <div class="w-full px-3 lg:w-3/4">

                    <div class="mb-4 lg:hidden">
                        <button id="filter-toggle" class="p-2 bg-white rounded-md shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
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

                    <div class="container mx-auto px-4 py-8">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                            @foreach ($products as $product)
                                <div class="bg-white shadow-md rounded-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
                                    <a href="{{ route('product.detail', ['slug' => $product->slug]) }}" class="block overflow-hidden flex-shrink-0">
                                        <img class="rounded-t-lg p-4 w-full h-48 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                                             src="{{ url('storage', $product->images[0]) }}" alt="product image">
                                    </a>
                                    <div class="px-4 pb-4 flex flex-col flex-grow">
                                        <a href="#" class="flex-grow">
                                            <h3 class="text-gray-900 font-semibold text-lg tracking-tight dark:text-white mb-2">
                                                {{ $product->name }}
                                            </h3>
                                        </a>
                                        <div class="flex items-center mt-2.5 mb-5">
                                            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                </path>
                                            </svg>
                                            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                </path>
                                            </svg>
                                            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                </path>
                                            </svg>
                                            <svg class="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                </path>
                                            </svg>
                                            <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                                                </path>
                                            </svg>
                                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-3">5.0</span>
                                        </div>
                                        <div class="flex items-center justify-between mt-auto">
                                            <span class="text-2l font-meduim text-gray-900 dark:text-white">{{Number::currency($product->price,'XAF')}}  </span>
                                            <button class="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <a href="#" wire:click.prevent='addToCart({{ $product->id }})'
                                                    class="flex  space-x-2  dark:text-gray-400 hover:text-gray-800 dark:hover:text-red-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                        fill="currentColor" class="w-4 h-4 bi bi-cart3 " viewBox="0 0 16 16">
                                                        <path
                                                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z">
                                                        </path>
                                                    </svg>
                                                    <span wire:loading.remove wire:target='addToCart({{ $product->id }})'>Add
                                                        </span>
                                                    <span wire:loading
                                                        wire:target='addToCart({{ $product->id }})'>Adding...</span>
                                                </a>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>


                    <!-- Success message -->
                    @if(session('success'))
                    <div id="success-message"
                        class="fixed p-6 border-l-4 border-green-500 bottom-4 right-4 rounded-r-xl bg-green-50 transition-opacity duration-300 ease-in-out opacity-100">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div class="ml-3">
                                <div class="text-sm text-green-600">
                                    <p>Your Order placed Successfully. 😍</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <script>
                        document.addEventListener('DOMContentLoaded', function() {

                        });
                    </script>
                @endif

                </div>
            </div>
        </div>
    </section>
</div>


