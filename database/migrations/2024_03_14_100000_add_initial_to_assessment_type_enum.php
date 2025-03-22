<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mood_assessments', function (Blueprint $table) {
            // Drop the existing enum column
            $table->dropColumn('assessment_type');
        });

        Schema::table('mood_assessments', function (Blueprint $table) {
            // Recreate the column with the new enum values
            $table->enum('assessment_type', ['pre', 'post', 'initial'])->after('meditation_session_id');
        });
    }

    public function down(): void
    {
        Schema::table('mood_assessments', function (Blueprint $table) {
            // Drop the modified enum column
            $table->dropColumn('assessment_type');
        });

        Schema::table('mood_assessments', function (Blueprint $table) {
            // Restore the original enum values
            $table->enum('assessment_type', ['pre', 'post'])->after('meditation_session_id');
        });
    }
}; 