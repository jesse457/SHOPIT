<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the storefront home renders', function () {
    $this->get('/')
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Storefront/Home')
            ->has('name')
            ->has('shop')
            ->has('navCategories'));
});

test('unknown urls render the branded not found page', function () {
    $this->get('/does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('Error/NotFound'));
});
