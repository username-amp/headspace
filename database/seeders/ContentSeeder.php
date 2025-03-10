<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\FocusSession;
use App\Models\MeditationSession;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // Create placeholder files
        $meditationImagePath = 'public/meditation-images/placeholder.jpg';
        $meditationVideoPath = 'public/meditation-videos/placeholder.mp4';
        $focusImagePath = 'public/focus-images/placeholder.jpg';
        $focusAudioPath = 'public/focus-audio/placeholder.mp3';

        // Ensure storage directories exist
        Storage::makeDirectory('public/meditation-images');
        Storage::makeDirectory('public/meditation-videos');
        Storage::makeDirectory('public/focus-images');
        Storage::makeDirectory('public/focus-audio');

        // Copy placeholder files if they don't exist
        if (!Storage::exists($meditationImagePath)) {
            Storage::copy(resource_path('seed-assets/placeholder-meditation.jpg'), $meditationImagePath);
        }
        if (!Storage::exists($meditationVideoPath)) {
            Storage::copy(resource_path('seed-assets/placeholder-meditation.mp4'), $meditationVideoPath);
        }
        if (!Storage::exists($focusImagePath)) {
            Storage::copy(resource_path('seed-assets/placeholder-focus.jpg'), $focusImagePath);
        }
        if (!Storage::exists($focusAudioPath)) {
            Storage::copy(resource_path('seed-assets/placeholder-focus.mp3'), $focusAudioPath);
        }

        // Create meditation sessions for each section
        $meditationSections = [
            'featured' => [
                [
                    'title' => 'Morning Mindfulness',
                    'category' => 'Mindfulness',
                    'duration' => '10',
                    'description' => 'Start your day with a peaceful mindfulness meditation.',
                    'is_featured' => true,
                ],
                [
                    'title' => 'Stress Relief',
                    'category' => 'Anxiety & Stress',
                    'duration' => '15',
                    'description' => 'Release tension and find inner peace.',
                    'is_featured' => true,
                ],
            ],
            'today' => [
                [
                    'title' => 'Daily Calm',
                    'category' => 'Daily Practice',
                    'duration' => '10',
                    'description' => 'Your daily dose of tranquility.',
                ],
            ],
            'new_popular' => [
                [
                    'title' => 'Sleep Better',
                    'category' => 'Sleep',
                    'duration' => '20',
                    'description' => 'Drift into peaceful sleep with this guided meditation.',
                ],
                [
                    'title' => 'Anxiety Relief',
                    'category' => 'Anxiety & Stress',
                    'duration' => '15',
                    'description' => 'Find relief from anxiety and worry.',
                ],
            ],
            'quick' => [
                [
                    'title' => 'Quick Focus',
                    'category' => 'Focus',
                    'duration' => '5',
                    'description' => 'A quick meditation to enhance focus.',
                ],
                [
                    'title' => 'Power Pause',
                    'category' => 'Mindfulness',
                    'duration' => '3',
                    'description' => 'Take a short break to reset your mind.',
                ],
            ],
            'courses' => [
                [
                    'title' => 'Mindfulness Basics',
                    'category' => 'Beginner',
                    'duration' => '10',
                    'description' => 'Learn the fundamentals of mindfulness meditation.',
                ],
                [
                    'title' => 'Advanced Meditation',
                    'category' => 'Advanced',
                    'duration' => '20',
                    'description' => 'Deepen your meditation practice.',
                ],
            ],
            'singles' => [
                [
                    'title' => 'Loving-Kindness',
                    'category' => 'Compassion',
                    'duration' => '15',
                    'description' => 'Cultivate compassion and kindness.',
                ],
                [
                    'title' => 'Body Scan',
                    'category' => 'Body Awareness',
                    'duration' => '20',
                    'description' => 'Connect with your body through mindful awareness.',
                ],
            ],
        ];

        foreach ($meditationSections as $section => $meditations) {
            foreach ($meditations as $meditation) {
                MeditationSession::create([
                    'title' => $meditation['title'],
                    'section' => $section,
                    'category' => $meditation['category'],
                    'duration' => $meditation['duration'],
                    'description' => $meditation['description'],
                    'image_url' => Storage::url($meditationImagePath),
                    'video_url' => Storage::url($meditationVideoPath),
                    'type' => 'video',
                    'is_featured' => $meditation['is_featured'] ?? false,
                ]);
            }
        }

        // Create focus sessions for each section
        $focusSections = [
            'featured' => [
                [
                    'title' => 'Deep Focus',
                    'type' => 'music',
                    'category' => 'Focus Music',
                    'duration' => '60',
                    'description' => 'Enhance concentration with ambient sounds.',
                    'is_featured' => true,
                ],
            ],
            'binaural_beats' => [
                [
                    'title' => 'Alpha Waves',
                    'type' => 'binaural',
                    'category' => 'Concentration',
                    'duration' => '45',
                    'description' => 'Binaural beats for enhanced focus.',
                ],
                [
                    'title' => 'Theta Meditation',
                    'type' => 'binaural',
                    'category' => 'Meditation',
                    'duration' => '30',
                    'description' => 'Deep meditation with theta waves.',
                ],
            ],
            'focus_music' => [
                [
                    'title' => 'Study Session',
                    'type' => 'music',
                    'category' => 'Study',
                    'duration' => '120',
                    'description' => 'Perfect background music for studying.',
                ],
                [
                    'title' => 'Work Flow',
                    'type' => 'music',
                    'category' => 'Work',
                    'duration' => '90',
                    'description' => 'Stay productive with ambient music.',
                ],
            ],
            'soundscapes' => [
                [
                    'title' => 'Rain Forest',
                    'type' => 'soundscape',
                    'category' => 'Nature',
                    'duration' => '60',
                    'description' => 'Immerse yourself in peaceful forest sounds.',
                ],
                [
                    'title' => 'Ocean Waves',
                    'type' => 'soundscape',
                    'category' => 'Nature',
                    'duration' => '60',
                    'description' => 'Calming ocean sounds for relaxation.',
                ],
            ],
        ];

        foreach ($focusSections as $section => $sessions) {
            foreach ($sessions as $session) {
                FocusSession::create([
                    'title' => $session['title'],
                    'type' => $session['type'],
                    'section' => $section,
                    'category' => $session['category'],
                    'duration' => $session['duration'],
                    'description' => $session['description'],
                    'image_url' => Storage::url($focusImagePath),
                    'audio_url' => Storage::url($focusAudioPath),
                    'is_featured' => $session['is_featured'] ?? false,
                ]);
            }
        }

        // Create courses
        $course = Course::create([
            'title' => 'Mindfulness for Beginners',
            'description' => 'A comprehensive introduction to mindfulness meditation.',
            'image_url' => Storage::url($meditationImagePath),
            'duration' => '8 weeks',
            'is_published' => true,
            'created_by' => 1, // Admin user ID
        ]);

        // Create course lessons
        $lessons = [
            [
                'title' => 'Introduction to Mindfulness',
                'description' => 'Learn the basics of mindfulness meditation.',
                'video_url' => Storage::url($meditationVideoPath),
                'duration' => '15',
                'order' => 1,
            ],
            [
                'title' => 'Breath Awareness',
                'description' => 'Focus on the breath to anchor your attention.',
                'video_url' => Storage::url($meditationVideoPath),
                'duration' => '20',
                'order' => 2,
            ],
        ];

        foreach ($lessons as $lesson) {
            CourseLesson::create([
                'course_id' => $course->id,
                'title' => $lesson['title'],
                'description' => $lesson['description'],
                'video_url' => $lesson['video_url'],
                'duration' => $lesson['duration'],
                'order' => $lesson['order'],
            ]);
        }
    }
}
