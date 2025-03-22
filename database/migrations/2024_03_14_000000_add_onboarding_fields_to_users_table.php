<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('preferred_time')->default('morning');
            $table->integer('daily_goal_minutes')->default(10);
            $table->boolean('notifications_enabled')->default(true);
            $table->json('interests')->nullable();
            $table->boolean('onboarding_completed')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'preferred_time',
                'daily_goal_minutes',
                'notifications_enabled',
                'interests',
                'onboarding_completed',
            ]);
        });
    }
}; 