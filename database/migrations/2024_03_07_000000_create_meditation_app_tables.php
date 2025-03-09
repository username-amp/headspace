<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMeditationAppTables extends Migration
{
    public function up(): void
    {
        // Create meditation sessions table for the Meditate section
        Schema::create('meditation_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('section', ['featured', 'today', 'new_popular', 'quick', 'courses', 'singles']);
            $table->string('category');
            $table->string('duration')->default('10'); // in minutes
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // Create focus sessions table for the Focus section
        Schema::create('focus_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('section', ['featured', 'binaural_beats', 'focus_music', 'soundscapes']);
            $table->string('category');
            $table->string('duration')->default('30'); // in minutes
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });

        // Create user meditation history table for the Dashboard section
        Schema::create('user_meditations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('meditation_session_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('duration_minutes')->default(10);
            $table->timestamp('completed_at')->useCurrent();
            $table->timestamps();
        });

        // Create user preferences table for personalization
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('daily_goal_minutes')->default(10);
            $table->string('preferred_time')->nullable();
            $table->boolean('notifications_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
        Schema::dropIfExists('user_meditations');
        Schema::dropIfExists('focus_sessions');
        Schema::dropIfExists('meditation_sessions');
    }
}
