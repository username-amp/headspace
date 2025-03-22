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
use App\Http\Controllers\MoodAssessmentController;
use App\Http\Controllers\OnboardingController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Basic auth routes that don't require onboarding
Route::middleware(['auth'])->group(function () {
    // Settings routes
    Route::prefix('settings')->group(function () {
        Route::get('/appearance', [AppearanceController::class, 'index'])->name('settings.appearance');
        Route::post('/appearance', [AppearanceController::class, 'update'])->name('settings.appearance.update');
    });

    Route::post('/activity/track', [ActivityController::class, 'track'])->name('activity.track');

    // Mood assessment routes
    Route::post('/mood-assessments', [MoodAssessmentController::class, 'store'])->name('mood-assessments.store');
    Route::get('/mood-assessments/session/{sessionId}', [MoodAssessmentController::class, 'getSessionAssessments'])->name('mood-assessments.session');
    Route::get('/mood-assessments/history', [MoodAssessmentController::class, 'getUserMoodHistory'])->name('mood-assessments.history');

    // Onboarding routes (no onboarding middleware)
    Route::get('/onboarding', [OnboardingController::class, 'show'])->name('onboarding.show');
    Route::post('/onboarding', [OnboardingController::class, 'save'])->name('onboarding.save');
});

// Protected routes that require completed onboarding
Route::middleware(['auth', \App\Http\Middleware\EnsureOnboardingIsComplete::class])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/meditate', [MeditateController::class, 'index'])->name('meditate');
    Route::get('/meditate/{meditation}', [MeditateController::class, 'show'])->name('meditate.details');
    Route::post('/meditate/{session}/complete', [MeditateController::class, 'complete'])->name('meditate.complete');
    Route::get('/focus', [FocusController::class, 'index'])->name('focus');
    Route::get('/music', [MusicController::class, 'index'])->name('music');
});

// Admin Routes
Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
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
    Route::post('meditations/upload-chunk', [AdminMeditationController::class, 'uploadChunk'])->name('meditations.upload-chunk');

    // Focus Content Management
    Route::post('focus/upload-chunk', [AdminFocusController::class, 'uploadChunk'])->name('focus.upload-chunk');
    Route::delete('focus/{focusSession}/force', [AdminFocusController::class, 'forceDelete'])->name('focus.force-delete');
    Route::resource('focus', AdminFocusController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
