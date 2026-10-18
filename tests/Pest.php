<?php

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

pest()->extend(TestCase::class)->in('Feature', 'Unit');

uses(LazilyRefreshDatabase::class)->in('Feature');

beforeEach(function (): void {
    Cache::flush();
    $this->withoutVite();
});
