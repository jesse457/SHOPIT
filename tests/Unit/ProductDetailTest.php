<?php

namespace Tests\Unit;

use App\Models\Product;
use App\Livewire\Pages\ProductDetail; // Make sure this is the correct namespace for your Livewire component
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ProductDetailTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    #[\PHPUnit\Framework\Attributes\Test]
    public function it_mounts_with_correct_slug()
    {
        $product = Product::factory()->create();

        Livewire::test(ProductDetail::class, ['slug' => $product->slug])
            ->assertSee($product->name);
    }

    /** @test */
    #[\PHPUnit\Framework\Attributes\Test]
    public function it_increases_quantity()
    {
        $product = Product::factory()->create();

        Livewire::test(ProductDetail::class, ['slug' => $product->slug])
            ->call('increaseQty')
            ->assertSet('quantity', 2);
    }

    /** @test */
    #[\PHPUnit\Framework\Attributes\Test]
    public function it_decreases_quantity()
    {
        $product = Product::factory()->create();

        Livewire::test(ProductDetail::class, ['slug' => $product->slug])
            ->call('decreaseQty')
            ->assertSet('quantity', 1);
    }

    // /** @test */
    // #[\PHPUnit\Framework\Attributes\Test]
    // public function it_adds_product_to_cart()
    // {
    //     $product = Product::factory()->create();

    //     Livewire::test(ProductDetail::class, ['slug' => $product->slug])
    //         ->call('addToCart', $product->id)
    //         ->assertEmits('cartUpdated');
    // }
}
