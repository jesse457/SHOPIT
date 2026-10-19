<?php

namespace App\Services;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Throwable;

class VisitorTracker
{
    /**
     * Record a public page view at most once per visitor and path every
     * thirty minutes. The cache add is atomic, so concurrent requests cannot
     * both win the window.
     */
    public function track(Request $request): void
    {
        if (! $request->isMethod('GET')) {
            return;
        }

        if ($request->is('admin/*') || $request->is('stripe/*') || $request->is('up')) {
            return;
        }

        $path = '/'.ltrim($request->path(), '/');
        $key = 'visitor:'.hash('sha256', $request->ip().'|'.$path);

        if (! Cache::add($key, true, now()->addMinutes(30))) {
            return;
        }

        try {
            Visitor::create([
                'ip_address' => $request->ip(),
                'path' => $path,
                'visited_at' => now(),
            ]);
        } catch (Throwable $error) {
            Log::debug('Visitor tracking failed.', [
                'message' => $error->getMessage(),
            ]);
        }
    }
}
