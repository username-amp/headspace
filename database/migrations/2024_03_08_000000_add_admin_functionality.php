<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAdminFunctionality extends Migration
{
    public function up(): void
    {
        // Add role to users table
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin'])->default('user')->after('email');
        });

        // Create courses table
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('duration');
            $table->boolean('is_published')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        // Create course lessons table
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('video_url');
            $table->string('duration');
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // Create user progress table
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_lesson_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('meditation_session_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('focus_session_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('progress_percentage')->default(0);
            $table->timestamp('last_accessed_at')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Create activity logs table
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('activity_type'); // 'meditation', 'focus', 'course'
            $table->string('activity_name');
            $table->integer('duration_minutes');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('user_progress');
        Schema::dropIfExists('course_lessons');
        Schema::dropIfExists('courses');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
}
