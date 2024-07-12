<?php

namespace App\Http\Middleware;

use App\Models\Visitor;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class TrackVisitors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            DB::beginTransaction();

            $ip = $request->ip();
            Visitor::create([
                'ip_address' => $ip,
                'visited_at' => now(), // Added visited URL
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            // Log the error, but don't interrupt the request
            \Log::error('Visitor tracking failed: ' . $e->getMessage());
        }

        return $next($request);
    }
}
