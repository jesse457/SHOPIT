<?php

use App\Http\Middleware\CheckIsField;
use App\Http\Middleware\TrackVisitors;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
          'is_admin'=>CheckIsField::class,
          'track_visitors'=>TrackVisitors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

    })->create();
