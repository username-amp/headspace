<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update any FocusTrack references to use FocusSession
        DB::table('user_activities')
            ->where('trackable_type', 'App\Models\FocusTrack')
            ->update(['trackable_type' => 'focus']);
    }

    public function down(): void
    {
        // If needed, revert the changes
        DB::table('user_activities')
            ->where('trackable_type', 'focus')
            ->update(['trackable_type' => 'App\Models\FocusTrack']);
    }
}; 