<?php

namespace Database\Seeders;

use App\Models\FocusSession;
use App\Models\MeditationSession;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed meditation sessions
        $this->seedMeditationSessions();

        // Seed focus sessions
        $this->seedFocusSessions();
    }

    private function seedMeditationSessions(): void
    {
        // Featured meditations
        MeditationSession::create([
            'title' => 'Morning Mindfulness',
            'type' => 'meditation',
            'duration' => '10 min',
            'description' => 'Start your day with clarity and purpose',
            'image_url' => '/images/meditations/morning-mindfulness.jpg',
            'category' => 'featured',
            'is_featured' => true,
        ]);

        MeditationSession::create([
            'title' => 'Stress Relief',
            'type' => 'meditation',
            'duration' => '15 min',
            'description' => 'Find peace in the midst of chaos',
            'image_url' => '/images/meditations/stress-relief.jpg',
            'category' => 'featured',
            'is_featured' => true,
        ]);

        // Quick meditations
        MeditationSession::create([
            'title' => 'Quick Reset',
            'type' => 'meditation',
            'duration' => '5 min',
            'description' => 'A quick break to reset your mind',
            'image_url' => '/images/meditations/quick-reset.jpg',
            'category' => 'quick',
        ]);

        MeditationSession::create([
            'title' => 'Mindful Minute',
            'type' => 'meditation',
            'duration' => '1 min',
            'description' => 'One minute of focused breathing',
            'image_url' => '/images/meditations/mindful-minute.jpg',
            'category' => 'quick',
        ]);

        // Courses
        MeditationSession::create([
            'title' => 'Basics of Mindfulness',
            'type' => 'course',
            'duration' => '10 days',
            'description' => 'Learn the fundamentals of mindfulness meditation',
            'image_url' => '/images/courses/basics.jpg',
            'category' => 'courses',
        ]);

        MeditationSession::create([
            'title' => 'Sleep Better',
            'type' => 'course',
            'duration' => '7 days',
            'description' => 'Improve your sleep quality with meditation',
            'image_url' => '/images/courses/sleep.jpg',
            'category' => 'courses',
        ]);

        // Daily meditations
        MeditationSession::create([
            'title' => 'Daily Calm',
            'type' => 'meditation',
            'duration' => '10 min',
            'description' => 'Your daily dose of tranquility',
            'image_url' => '/images/meditations/daily-calm.jpg',
            'category' => 'daily',
        ]);
    }

    private function seedFocusSessions(): void
    {
        // Featured focus content
        FocusSession::create([
            'title' => 'Deep Focus',
            'type' => 'binaural',
            'duration' => '60 min',
            'description' => 'Enhanced concentration with alpha waves',
            'image_url' => '/images/focus/deep-focus.jpg',
            'audio_url' => '/audio/focus/deep-focus.mp3',
            'category' => 'featured',
            'is_featured' => true,
        ]);

        // Binaural beats
        FocusSession::create([
            'title' => 'Alpha Flow',
            'type' => 'binaural',
            'duration' => '45 min',
            'description' => 'Alpha waves for improved focus',
            'image_url' => '/images/focus/alpha-flow.jpg',
            'audio_url' => '/audio/focus/alpha-flow.mp3',
            'category' => 'binaural_beats',
        ]);

        FocusSession::create([
            'title' => 'Beta Boost',
            'type' => 'binaural',
            'duration' => '30 min',
            'description' => 'Beta waves for enhanced alertness',
            'image_url' => '/images/focus/beta-boost.jpg',
            'audio_url' => '/audio/focus/beta-boost.mp3',
            'category' => 'binaural_beats',
        ]);

        // Focus music
        FocusSession::create([
            'title' => 'Lo-Fi Focus',
            'type' => 'music',
            'duration' => '120 min',
            'description' => 'Relaxing lo-fi beats for deep work',
            'image_url' => '/images/focus/lofi-focus.jpg',
            'audio_url' => '/audio/focus/lofi-focus.mp3',
            'category' => 'focus_music',
        ]);

        FocusSession::create([
            'title' => 'Classical Flow',
            'type' => 'music',
            'duration' => '90 min',
            'description' => 'Classical music for concentration',
            'image_url' => '/images/focus/classical-flow.jpg',
            'audio_url' => '/audio/focus/classical-flow.mp3',
            'category' => 'focus_music',
        ]);

        // Soundscapes
        FocusSession::create([
            'title' => 'Rain Forest',
            'type' => 'soundscape',
            'duration' => '60 min',
            'description' => 'Immersive rainforest ambiance',
            'image_url' => '/images/focus/rain-forest.jpg',
            'audio_url' => '/audio/focus/rain-forest.mp3',
            'category' => 'soundscapes',
        ]);

        FocusSession::create([
            'title' => 'Ocean Waves',
            'type' => 'soundscape',
            'duration' => '60 min',
            'description' => 'Calming ocean waves',
            'image_url' => '/images/focus/ocean-waves.jpg',
            'audio_url' => '/audio/focus/ocean-waves.mp3',
            'category' => 'soundscapes',
        ]);
    }
}
