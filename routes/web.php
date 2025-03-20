<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\FocusController as AdminFocusController;
use App\Http\Controllers\Admin\MeditationController as AdminMeditationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FocusController;
use App\Http\Controllers\MeditateController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\Settings\AppearanceController;
use App\Http\Controllers\ActivityController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('meditate', [MeditateController::class, 'index'])->name('meditate');
    Route::get('meditate/{meditation}', [MeditateController::class, 'show'])->name('meditate.details');
    Route::post('meditate/{session}/complete', [MeditateController::class, 'complete'])->name('meditate.complete');
    Route::get('focus', [FocusController::class, 'index'])->name('focus');
    Route::get('/music', [MusicController::class, 'index'])->name('music');
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::post('meditations/upload-chunk', [AdminMeditationController::class, 'uploadChunk'])->name('meditations.upload-chunk');
    });
});

Route::middleware(['auth'])->group(function () {
    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/appearance', [AppearanceController::class, 'index'])->name('settings.appearance');
        Route::post('/appearance', [AppearanceController::class, 'update'])->name('settings.appearance.update');
    });
    Route::post('/activity/track', [ActivityController::class, 'track'])->name('activity.track');
});

// Admin Routes
Route::middleware(['web', 'auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    // Admin Dashboard
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/analytics', [AdminController::class, 'analytics'])->name('analytics');

    // User Management
    Route::get('/users', [AdminController::class, 'users'])->name('users.index');
    Route::get('/users/{user}', [AdminController::class, 'userDetails'])->name('users.show');
    Route::post('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('users.toggle-status');

    // Meditation Content Management
    Route::delete('meditations/{meditation}/force', [AdminMeditationController::class, 'forceDelete'])->name('meditations.force-delete');
    Route::resource('meditations', AdminMeditationController::class);

    // Focus Content Management
    Route::post('focus/upload-chunk', [AdminFocusController::class, 'uploadChunk'])->name('focus.upload-chunk');
    Route::delete('focus/{focusSession}/force', [AdminFocusController::class, 'forceDelete'])->name('focus.force-delete');
    Route::resource('focus', AdminFocusController::class);
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
