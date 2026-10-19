<?php

namespace App\Support;

final readonly class CheckoutSession
{
    public function __construct(
        public string $id,
        public string $url,
    ) {}
}
