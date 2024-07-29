<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Required Meta Tags Always Come First -->
  <meta charset="utf-8">
  <meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://preline.co/">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Discover the difference that a professionally crafted website can make for your business.">

  <meta name="twitter:site" content="@preline">
  <meta name="twitter:creator" content="@preline">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Agency Demo Template Tailwind CSS | Preline UI, crafted with Tailwind CSS">
  <meta name="twitter:description" content="Discover the difference that a professionally crafted website can make for your business.">
  <meta name="twitter:image" content="https://preline.co/assets/img/og-image.png">

  <meta property="og:url" content="https://preline.co/">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Preline">
  <meta property="og:title" content="Agency Demo Template Tailwind CSS | Preline UI, crafted with Tailwind CSS">
  <meta property="og:description" content="Discover the difference that a professionally crafted website can make for your business.">
  <meta property="og:image" content="https://preline.co/assets/img/og-image.png">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/languages/python.min.js"></script>
    <title>{{ $title ?? 'JOBIT' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @filamentStyles
    @livewireStyles
</head>

<body class="bg-slate-200 dark:bg-slate-700">
    @livewire('partials.navbar')
    <main>
        {{ $slot }}
    </main>
    @livewire('partials.footer')
    @livewireScripts
    @filamentScripts

</body>

</html>
