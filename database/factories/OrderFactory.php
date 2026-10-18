<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'grand_total' => 27500,
            'payment_method' => PaymentMethod::CashOnDelivery,
            'payment_status' => PaymentStatus::Pending,
            'status' => OrderStatus::New,
            'currency' => 'XAF',
            'shipping_amount' => 2500,
            'shipping_method' => 'standard',
            'notes' => null,
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (): array => [
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => now(),
        ]);
    }

    public function stripePending(): static
    {
        return $this->state(fn (): array => [
            'payment_method' => PaymentMethod::Stripe,
            'payment_status' => PaymentStatus::Pending,
            'stripe_checkout_session_id' => 'cs_test_'.Str::random(24),
            'expires_at' => now()->addMinutes(30),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Cancelled,
            'stock_released_at' => now(),
        ]);
    }
}
