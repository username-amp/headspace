<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingIsComplete
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()->onboarding_completed && !$request->routeIs('onboarding.*')) {
            return redirect()->route('onboarding.show');
        }

        return $next($request);
    }
} 