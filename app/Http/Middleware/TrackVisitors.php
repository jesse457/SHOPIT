<?php

namespace App\Http\Middleware;

use App\Services\VisitorTracker;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitors
{
    public function __construct(private VisitorTracker $tracker) {}

    public function handle(Request $request, Closure $next): Response
    {
        $this->tracker->track($request);

        return $next($request);
    }
}
