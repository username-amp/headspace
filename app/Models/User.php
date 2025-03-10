<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'appearance',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function meditations(): HasMany
    {
        return $this->hasMany(UserMeditation::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }

    /**
     * Get the user's current meditation streak.
     * A streak is maintained if the user has meditated at least once per day.
     * The streak breaks if a day is missed.
     */
    public function getCurrentStreak(): int
    {
        $meditations = $this->meditations()
            ->select('completed_at')
            ->orderBy('completed_at', 'desc')
            ->get()
            ->groupBy(function ($meditation) {
                return Carbon::parse($meditation->completed_at)->format('Y-m-d');
            });

        if ($meditations->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $currentDate = Carbon::now()->startOfDay();
        $lastMeditationDate = Carbon::parse($meditations->keys()->first())->startOfDay();

        // If the user hasn't meditated today, check if they meditated yesterday
        if (! $currentDate->equalTo($lastMeditationDate)) {
            if ($currentDate->subDay()->equalTo($lastMeditationDate)) {
                // User meditated yesterday, start counting from yesterday
                $currentDate = $lastMeditationDate;
            } else {
                // User missed a day, streak is broken
                return 0;
            }
        }

        // Count consecutive days
        foreach ($meditations->keys() as $dateString) {
            $date = Carbon::parse($dateString)->startOfDay();

            if ($currentDate->equalTo($date)) {
                $streak++;
                $currentDate->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}
