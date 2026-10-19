<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#f6f2ea">

        <link rel="icon" href="/favicon.svg" type="image/svg+xml">

        {{-- Apply the saved theme before the first paint so dark mode never flashes. --}}
        <script>
            (function () {
                var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                try {
                    var stored = localStorage.getItem('shopit-theme');

                    if (stored) {
                        dark = stored === 'dark';
                    }
                } catch (e) {
                    // Storage can be blocked. Fall back to the system preference.
                }

                document.documentElement.classList.toggle('dark', dark);
                document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
            })();
        </script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])

        <x-inertia::head>
            <title>{{ config('app.name', 'SHOPIT') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans">
        <x-inertia::app />
    </body>
</html>
