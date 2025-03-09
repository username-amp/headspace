<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meditation_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type')->default('meditation');
            $table->integer('duration')->comment('Duration in minutes');
            $table->text('description');
            $table->string('image_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->string('category')->default('general');
            $table->string('section')->default('general')->comment('Featured, Today\'s Meditation, New & Popular, Quick, Courses, Singles');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meditation_sessions');
    }
};
