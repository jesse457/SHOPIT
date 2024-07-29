<div>
       <!-- Form -->
       <form wire:submit.prevent='save'>

        @if (@session('error'))
            <div class="p-4 mb-4 text-sm text-white bg-red-500 rounded-lg" role="alert">
                {{ session('error') }}
            </div>
        @endif
        <div class="grid gap-y-4">
            <!-- Form Group -->
            <div>
                <label for="email" class="block mb-2 text-sm dark:text-white">Email address</label>
                <div class="relative">
                    <input type="text" id="email" wire:model="text"
                        class="block w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                        aria-describedby="email-error">
                    @error('email')
                        <div class="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-3">
                            <svg class="w-5 h-5 text-red-500" width="16" height="16"
                                fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                            </svg>
                        </div>
                    @enderror
                </div>

                @error('text')
                    <p class="mt-2 text-xs text-red-600 " id="email-error">{{$message}}</p>
                @enderror

            </div>
            <!-- End Form Group -->

            <!-- Form Group -->
            <div class="py-6 bg-white rounded-md shadow dark:bg-gray-900">
                <div
                    class="flex flex-wrap items-center justify-between pb-4 mb-6 space-x-2 border-b dark:border-gray-700">
                    <div class="flex items-center px-6 mb-2 md:mb-0 ">
                        <div class="flex mr-2 rounded-full">
                            <img src="https://i.postimg.cc/rF6G0Dh9/pexels-emmy-e-2381069.jpg" alt=""
                                class="object-cover w-12 h-12 rounded-full">
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-300">
                                Adren Roy</h2>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Web Designer</p>
                        </div>
                    </div>
                    <p class="px-6 text-base font-medium text-gray-600 dark:text-gray-400"> Joined 12, SEP , 2022
                    </p>
                </div>
                <p class="px-6 mb-6 text-base text-gray-500 dark:text-gray-400">
                   {{$content}}
                </p>
                <div class="flex flex-wrap justify-between pt-4 border-t dark:border-gray-700">
                    <div class="flex px-6 mb-2 md:mb-0">
                        <ul class="flex items-center justify-start mr-4">
                            <li>
                                <a href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        class="w-4 mr-1 text-blue-500 dark:text-blue-400 bi bi-star-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        class="w-4 mr-1 text-blue-500 dark:text-blue-400 bi bi-star-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        class="w-4 mr-1 text-blue-500 dark:text-blue-400 bi bi-star-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        class="w-4 mr-1 text-blue-500 dark:text-blue-400 bi bi-star-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                        <h2 class="text-sm text-gray-500 dark:text-gray-400">Rating:<span
                                class="font-semibold text-gray-600 dark:text-gray-300">
                                3.0</span>
                        </h2>
                    </div>
                    <div
                        class="flex items-center px-6 space-x-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                        <div class="flex items-center">
                            <div class="flex mr-3 text-sm text-gray-700 dark:text-gray-400">
                                <a href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor"
                                        class="w-4 h-4 mr-1 text-blue-400 bi bi-hand-thumbs-up-fill"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z">
                                        </path>
                                    </svg>
                                </a>
                                <span>12</span>
                            </div>
                            <div class="flex text-sm text-gray-700 dark:text-gray-400">
                                <a href="#" class="inline-flex hover:underline">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor" class="w-4 h-4 mr-1 text-blue-400 bi bi-chat"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                                        </path>
                                    </svg>Reply</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Form Group -->
            <button type="submit"
                class="inline-flex items-center justify-center w-full px-4 py-3 text-sm text-white bg-blue-400 border border-transparent rounded-lg gap-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"><div wire:loading class="w-4 h-4 border-b-2 border-gray-100 rounded-full animate-spin"></div>Sign
                in</button>

        </div>
    </form>
    <!-- End Form -->
</div>
