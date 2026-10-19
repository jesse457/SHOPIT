<?php

use App\Enums\OrderStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('guests are sent to sign in before the admin panel', function () {
    $this->get('/admin')->assertRedirect('/login');
});

test('customers cannot access the admin panel', function () {
    $this->actingAs(User::factory()->create())
        ->get('/admin')
        ->assertForbidden();
});

test('the dashboard reports real store metrics', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create([
        'stock_quantity' => 3,
        'low_stock_threshold' => 5,
        'is_active' => true,
    ]);

    Order::factory()->paid()->for($customer)->create([
        'grand_total' => 42000,
        'shipping_amount' => 0,
        'created_at' => now(),
    ]);

    Order::factory()->for($customer)->create([
        'payment_status' => 'pending',
        'created_at' => now(),
    ]);

    $this->actingAs($this->admin)
        ->get('/admin')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->where('stats.revenue_this_month', 42000)
            ->where('stats.customers', 1)
            ->where('stats.low_stock', 1)
            ->has('revenueSeries', 12)
            ->has('statusBreakdown', 5)
            ->has('visitorSeries', 14)
            ->has('recentOrders'));
});

test('an admin can create, update and delete a product with images', function () {
    Storage::fake('public');

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $file = UploadedFile::fake()->image('product.jpg');

    $this->actingAs($this->admin)
        ->post('/admin/products', [
            'name' => 'Test Overshirt',
            'slug' => 'test-overshirt',
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'description' => 'A test product.',
            'price' => 42000,
            'compare_at_price' => null,
            'stock_quantity' => 10,
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => false,
            'on_sale' => false,
            'images' => [$file],
            'remove_images' => [],
        ])
        ->assertRedirect('/admin/products');

    $product = Product::query()->where('slug', 'test-overshirt')->firstOrFail();

    expect($product->images)->toHaveCount(1);
    Storage::disk('public')->assertExists($product->images[0]);

    $oldImage = $product->images[0];

    $this->actingAs($this->admin)
        ->put("/admin/products/{$product->slug}", [
            'name' => 'Updated Overshirt',
            'slug' => 'test-overshirt',
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'description' => 'An updated product.',
            'price' => 45000,
            'compare_at_price' => null,
            'stock_quantity' => 4,
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => true,
            'on_sale' => false,
            'remove_images' => [$oldImage],
        ])
        ->assertRedirect('/admin/products');

    $product->refresh();

    expect($product->name)->toBe('Updated Overshirt')
        ->and($product->images)->toBe([])
        ->and($product->is_featured)->toBeTrue()
        ->and($product->stock_quantity)->toBe(4);

    Storage::disk('public')->assertMissing($oldImage);

    $this->actingAs($this->admin)
        ->delete("/admin/products/{$product->slug}")
        ->assertRedirect('/admin/products');

    $this->assertSoftDeleted('products', ['id' => $product->id]);
});

test('product images can be replaced with a spoofed multipart update', function () {
    Storage::fake('public');

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $oldPath = UploadedFile::fake()->image('old.jpg')->store('products', 'public');
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'slug' => 'image-test',
        'images' => [$oldPath],
    ]);

    $newFile = UploadedFile::fake()->image('new.jpg');

    $this->actingAs($this->admin)
        ->post("/admin/products/{$product->slug}", [
            '_method' => 'put',
            'name' => 'Image Test',
            'slug' => 'image-test',
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'description' => 'Image replacement test.',
            'price' => 42000,
            'compare_at_price' => null,
            'stock_quantity' => 10,
            'low_stock_threshold' => 5,
            'is_active' => true,
            'is_featured' => false,
            'on_sale' => false,
            'images' => [$newFile],
            'remove_images' => [$oldPath],
        ])
        ->assertRedirect('/admin/products');

    $product->refresh();

    expect($product->images)->toHaveCount(1)
        ->and($product->images[0])->not->toBe($oldPath);

    Storage::disk('public')->assertExists($product->images[0]);
    Storage::disk('public')->assertMissing($oldPath);
});

test('categories cannot be deleted while products use them', function () {
    $category = Category::factory()->create(['slug' => 'apparel']);
    Product::factory()->create(['category_id' => $category->id]);

    $this->actingAs($this->admin)
        ->from('/admin/categories')
        ->delete("/admin/categories/{$category->slug}")
        ->assertRedirect('/admin/categories')
        ->assertSessionHas('toast');

    expect($category->fresh())->not->toBeNull();

    Product::query()->where('category_id', $category->id)->delete();

    $this->actingAs($this->admin)
        ->delete("/admin/categories/{$category->slug}")
        ->assertRedirect('/admin/categories');

    $this->assertSoftDeleted('categories', ['id' => $category->id]);
});

test('cancelling an order through the admin releases its stock', function () {
    $customer = User::factory()->create();
    $product = Product::factory()->create(['stock_quantity' => 8]);
    $order = Order::factory()->stripePending()->for($customer)->create([
        'status' => OrderStatus::New,
        'grand_total' => 42000,
    ]);

    $order->items()->create([
        'product_id' => $product->id,
        'product_name' => $product->name,
        'quantity' => 2,
        'unit_amount' => 21000,
        'total_amount' => 42000,
    ]);

    $this->actingAs($this->admin)
        ->from("/admin/orders/{$order->id}")
        ->patch("/admin/orders/{$order->id}", [
            'status' => 'cancelled',
            'payment_status' => 'refunded',
            'notes' => 'Customer asked to cancel.',
        ])
        ->assertRedirect("/admin/orders/{$order->id}");

    $order->refresh();

    expect($order->status)->toBe(OrderStatus::Cancelled)
        ->and($order->stock_released_at)->not->toBeNull()
        ->and($product->fresh()->stock_quantity)->toBe(10);
});

test('an invalid order status transition is rejected', function () {
    $order = Order::factory()->create([
        'status' => OrderStatus::Delivered,
        'payment_status' => 'paid',
    ]);

    $this->actingAs($this->admin)
        ->from("/admin/orders/{$order->id}")
        ->patch("/admin/orders/{$order->id}", [
            'status' => 'processing',
            'payment_status' => 'paid',
            'notes' => null,
        ])
        ->assertSessionHasErrors('status');

    expect($order->fresh()->status)->toBe(OrderStatus::Delivered);
});

test('an admin cannot remove their own admin access', function () {
    $this->actingAs($this->admin)
        ->from("/admin/customers/{$this->admin->id}/edit")
        ->patch("/admin/customers/{$this->admin->id}", [
            'name' => $this->admin->name,
            'email' => $this->admin->email,
            'password' => null,
            'is_admin' => false,
        ])
        ->assertSessionHasErrors('is_admin');

    expect($this->admin->fresh()->is_admin)->toBeTrue();
});

test('an admin can create a customer account', function () {
    $this->actingAs($this->admin)
        ->post('/admin/customers', [
            'name' => 'New Customer',
            'email' => 'new-customer@example.com',
            'password' => 'password',
            'is_admin' => false,
        ])
        ->assertRedirect('/admin/customers');

    $customer = User::query()->where('email', 'new-customer@example.com')->first();

    expect($customer)->not->toBeNull()
        ->and($customer->is_admin)->toBeFalse()
        ->and($customer->email_verified_at)->not->toBeNull();
});
