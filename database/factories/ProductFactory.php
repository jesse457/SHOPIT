<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'category_id' => \App\Models\Category::factory(), // Assuming you have a Category factory
            'brand_id' => \App\Models\Brand::factory(), // Assuming you have a Brand factory
            'name' => $name,
            'images' => json_encode([$this->faker->imageUrl()]),
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'is_active' => $this->faker->boolean(),
            'is_featured' => $this->faker->boolean(),
            'in_stock' => $this->faker->boolean(),
            'on_sale' => $this->faker->boolean(),
        ];
    }
}
