<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserMeditation extends Model
{
    protected $fillable = [
        'user_id',
        'meditation_session_id',
        'duration_minutes',
        'section',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function meditationSession(): BelongsTo
    {
        return $this->belongsTo(MeditationSession::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeCompleted($query)
    {
        return $query->whereNotNull('completed_at');
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('completed_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
    }

    public function scopeLastTwoWeeks($query)
    {
        return $query->whereBetween('completed_at', [Carbon::now()->subWeeks(2), Carbon::now()]);
    }

    public function scopeBySection($query, string $section)
    {
        return $query->where('section', $section);
    }

    /**
     * Get meditations completed on a specific date
     */
    public function scopeOnDate($query, Carbon $date)
    {
        return $query->whereDate('completed_at', $date);
    }

    /**
     * Get meditations completed between two dates
     */
    public function scopeBetweenDates($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('completed_at', [$startDate, $endDate]);
    }
}
