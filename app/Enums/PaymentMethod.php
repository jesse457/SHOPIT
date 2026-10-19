<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Stripe = 'stripe';
    case CashOnDelivery = 'cod';

    public function label(): string
    {
        return match ($this) {
            self::Stripe => 'Card payment',
            self::CashOnDelivery => 'Cash on delivery',
        };
    }
}
