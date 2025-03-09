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
        Schema::create('user_meditations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('meditation_session_id')->constrained()->onDelete('cascade');
            $table->integer('duration_minutes');
            $table->string('section')->nullable(); // Featured, Today's Meditation, New & Popular, etc.
            $table->boolean('completed')->default(false);
            $table->timestamps();

            // Add unique constraint to prevent duplicate entries
            $table->unique(['user_id', 'meditation_session_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_meditations');
    }
};
