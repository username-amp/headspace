<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FocusController;
use App\Http\Controllers\MeditateController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\Admin\MeditationController as AdminMeditationController;
use App\Http\Controllers\Admin\FocusController as AdminFocusController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('meditate', [MeditateController::class, 'index'])->name('meditate');
    Route::post('meditate/{session}/complete', [MeditateController::class, 'complete'])->name('meditate.complete');
    Route::get('focus', [FocusController::class, 'index'])->name('focus');
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
    Route::resource('meditations', AdminMeditationController::class);

    // Focus Content Management
    Route::resource('focus', AdminFocusController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
