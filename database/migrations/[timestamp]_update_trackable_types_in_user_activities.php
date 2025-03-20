<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('user_activities')
            ->where('trackable_type', 'App\Models\Meditation')
            ->update(['trackable_type' => 'meditation']);

        DB::table('user_activities')
            ->where('trackable_type', 'App\Models\MeditationSession')
            ->update(['trackable_type' => 'meditation']);

        DB::table('user_activities')
            ->where('trackable_type', 'App\Models\FocusSession')
            ->update(['trackable_type' => 'focus']);
    }

    public function down(): void
    {
        DB::table('user_activities')
            ->where('trackable_type', 'meditation')
            ->update(['trackable_type' => 'App\Models\MeditationSession']);

        DB::table('user_activities')
            ->where('trackable_type', 'focus')
            ->update(['trackable_type' => 'App\Models\FocusSession']);
    }
}; 