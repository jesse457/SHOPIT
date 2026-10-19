<?php

use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('the home page renders the catalog sections', function () {
    $product = Product::factory()->create([
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->has('newArrivals', 1)
            ->has('departments', 1)
            ->has('brands', 1)
            ->where('newArrivals.0.id', $product->id));
});

test('the product index paginates and filters', function () {
    $category = Category::factory()->create([
        'name' => 'Apparel',
        'slug' => 'apparel',
        'is_active' => true,
    ]);
    $otherCategory = Category::factory()->create([
        'name' => 'Home',
        'slug' => 'home',
        'is_active' => true,
    ]);

    $linen = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Linen Overshirt',
        'slug' => 'linen-overshirt',
        'price' => 42000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    Product::factory()->create([
        'category_id' => $otherCategory->id,
        'name' => 'Cedar Candle',
        'slug' => 'cedar-candle',
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->get('/products')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Products')
            ->has('products.data', 2)
            ->where('products.total', 2));

    $this->get('/products?category=apparel')
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $linen->id));

    $this->get('/products?q=linen')
        ->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.id', $linen->id));
});

test('products can be sorted by price', function () {
    $cheap = Product::factory()->create([
        'price' => 12000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);
    $expensive = Product::factory()->create([
        'price' => 90000,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->get('/products?sort=price_asc')
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.id', $cheap->id)
            ->where('products.data.1.id', $expensive->id));
});

test('inactive products are not listed and return a 404', function () {
    $product = Product::factory()->inactive()->create([
        'stock_quantity' => 10,
    ]);

    $this->get('/products')
        ->assertInertia(fn (Assert $page) => $page->has('products.data', 0));

    $this->get("/products/{$product->slug}")->assertNotFound();
});

test('a product detail page renders its related products', function () {
    $category = Category::factory()->create(['is_active' => true]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'name' => 'Linen Overshirt',
        'slug' => 'linen-overshirt',
        'stock_quantity' => 10,
        'is_active' => true,
    ]);
    $related = Product::factory()->create([
        'category_id' => $category->id,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->get('/products/linen-overshirt')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/ProductDetail')
            ->where('product.id', $product->id)
            ->has('related', 1)
            ->where('related.0.id', $related->id));
});

test('a category page lists its active products', function () {
    $category = Category::factory()->create([
        'name' => 'Apparel',
        'slug' => 'apparel',
        'is_active' => true,
    ]);
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock_quantity' => 10,
        'is_active' => true,
    ]);

    $this->get('/categories/apparel')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/CategoryDetail')
            ->where('category.id', $category->id)
            ->has('products.data', 1)
            ->where('products.data.0.id', $product->id));
});

test('an inactive category returns a 404', function () {
    $category = Category::factory()->inactive()->create([
        'slug' => 'hidden',
    ]);

    $this->get("/categories/{$category->slug}")->assertNotFound();
});
