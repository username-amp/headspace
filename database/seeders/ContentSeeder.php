<?php

namespace Database\Seeders;

use App\Models\MeditationSession;
use App\Models\FocusSession;
use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
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
                    'image_url' => '/images/meditation-placeholder.jpg',
                    'audio_url' => '/audio/meditation-placeholder.mp3',
                    'is_featured' => $meditation['is_featured'] ?? false,
                ]);
            }
        }

        // Create focus sessions for each section
        $focusSections = [
            'featured' => [
                [
                    'title' => 'Deep Focus',
                    'category' => 'Focus Music',
                    'duration' => '60',
                    'description' => 'Enhance concentration with ambient sounds.',
                    'is_featured' => true,
                ],
            ],
            'binaural_beats' => [
                [
                    'title' => 'Alpha Waves',
                    'category' => 'Concentration',
                    'duration' => '45',
                    'description' => 'Binaural beats for enhanced focus.',
                ],
                [
                    'title' => 'Theta Meditation',
                    'category' => 'Meditation',
                    'duration' => '30',
                    'description' => 'Deep meditation with theta waves.',
                ],
            ],
            'focus_music' => [
                [
                    'title' => 'Study Session',
                    'category' => 'Study',
                    'duration' => '120',
                    'description' => 'Perfect background music for studying.',
                ],
                [
                    'title' => 'Work Flow',
                    'category' => 'Work',
                    'duration' => '90',
                    'description' => 'Stay productive with ambient music.',
                ],
            ],
            'soundscapes' => [
                [
                    'title' => 'Rain Forest',
                    'category' => 'Nature',
                    'duration' => '60',
                    'description' => 'Immerse yourself in peaceful forest sounds.',
                ],
                [
                    'title' => 'Ocean Waves',
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
                    'section' => $section,
                    'category' => $session['category'],
                    'duration' => $session['duration'],
                    'description' => $session['description'],
                    'image_url' => '/images/focus-placeholder.jpg',
                    'audio_url' => '/audio/focus-placeholder.mp3',
                    'is_featured' => $session['is_featured'] ?? false,
                ]);
            }
        }

        // Create courses
        $course = Course::create([
            'title' => 'Mindfulness for Beginners',
            'description' => 'A comprehensive introduction to mindfulness meditation.',
            'image_url' => '/images/course-placeholder.jpg',
            'duration' => '8 weeks',
            'is_published' => true,
            'created_by' => 1, // Admin user ID
        ]);

        // Create course lessons
        $lessons = [
            [
                'title' => 'Introduction to Mindfulness',
                'description' => 'Learn the basics of mindfulness meditation.',
                'video_url' => '/videos/lesson-1.mp4',
                'duration' => '15',
                'order' => 1,
            ],
            [
                'title' => 'Breath Awareness',
                'description' => 'Focus on the breath as an anchor for attention.',
                'video_url' => '/videos/lesson-2.mp4',
                'duration' => '20',
                'order' => 2,
            ],
            [
                'title' => 'Body Scan Meditation',
                'description' => 'Develop body awareness through meditation.',
                'video_url' => '/videos/lesson-3.mp4',
                'duration' => '25',
                'order' => 3,
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
