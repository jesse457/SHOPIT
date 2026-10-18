<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::title(fake()->unique()->words(3, true));
        $price = fake()->numberBetween(8000, 120000);

        return [
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'images' => [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
            ],
            'description' => fake()->paragraph(),
            'price' => $price,
            'compare_at_price' => null,
            'is_active' => true,
            'is_featured' => false,
            'in_stock' => true,
            'on_sale' => false,
            'stock_quantity' => 25,
            'low_stock_threshold' => 5,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => ['is_active' => false]);
    }

    public function featured(): static
    {
        return $this->state(fn (): array => ['is_featured' => true]);
    }

    public function onSale(): static
    {
        return $this->state(fn (array $attributes): array => [
            'on_sale' => true,
            'compare_at_price' => round(((float) $attributes['price']) * 1.2, 2),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => [
            'stock_quantity' => 0,
            'in_stock' => false,
        ]);
    }

    public function lowStock(): static
    {
        return $this->state(fn (): array => [
            'stock_quantity' => 3,
            'in_stock' => true,
        ]);
    }
}
