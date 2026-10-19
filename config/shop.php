<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Store Currency
    |--------------------------------------------------------------------------
    |
    | Prices are stored as decimal amounts in the store's presentment currency.
    | XAF is a zero-decimal currency, which is handled when amounts are sent to
    | Stripe (see StripeGateway).
    |
    */

    'currency' => 'XAF',
    'currency_locale' => 'fr-CM',

    /*
    |--------------------------------------------------------------------------
    | Shipping
    |--------------------------------------------------------------------------
    |
    | A single flat delivery rate, waived above the free-shipping threshold.
    | Amounts are in the store currency (XAF).
    |
    */

    'shipping' => [
        'free_threshold' => 50000,
        'flat_rate' => 2500,
    ],

    /*
    |--------------------------------------------------------------------------
    | Orders
    |--------------------------------------------------------------------------
    |
    | Card orders reserve stock for a limited window while the customer is on
    | Stripe Checkout. Expired sessions release the reservation automatically.
    |
    */

    'orders' => [
        'stripe_hold_minutes' => 45,
    ],

    /*
    |--------------------------------------------------------------------------
    | Catalog
    |--------------------------------------------------------------------------
    */

    'products' => [
        'page_size' => 12,
        'low_stock_threshold' => 5,
    ],

];
