<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
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

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
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
}; 