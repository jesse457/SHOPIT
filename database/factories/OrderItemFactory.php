<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productName = fake()->words(3, true);

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name' => $productName,
            'product_image' => null,
            'quantity' => 1,
            'unit_amount' => 12000,
            'total_amount' => 12000,
        ];
    }
}
