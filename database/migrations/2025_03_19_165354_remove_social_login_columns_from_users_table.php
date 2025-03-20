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
        Schema::table('users', function (Blueprint $table) {
            // Drop unique indexes first
            $table->dropIndex('users_google_id_unique');
            $table->dropIndex('users_facebook_id_unique');

            // Then drop the columns
            $table->dropColumn([
                'google_id',
                'facebook_id',
                'google_token',
                'facebook_token',
                'google_refresh_token',
                'facebook_refresh_token'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->unique();
            $table->string('facebook_id')->nullable()->unique();
            $table->text('google_token')->nullable();
            $table->text('facebook_token')->nullable();
            $table->text('google_refresh_token')->nullable();
            $table->text('facebook_refresh_token')->nullable();
        });
    }
};
