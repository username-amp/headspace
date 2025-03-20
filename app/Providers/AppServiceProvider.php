<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Database\Eloquent\Relations\Relation;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (str_contains(config('app.url'), 'ngrok-free.app')) {
            URL::forceScheme('https');
        }

        Relation::morphMap([
            'meditation' => \App\Models\MeditationSession::class,
            'focus' => \App\Models\FocusSession::class,
            'App\Models\FocusTrack' => \App\Models\FocusSession::class,
        ]);
    }
}
