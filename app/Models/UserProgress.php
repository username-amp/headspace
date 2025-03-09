<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProgress extends Model
{
    protected $fillable = [
        'user_id',
        'course_lesson_id',
        'meditation_session_id',
        'focus_session_id',
        'progress_percentage',
        'last_accessed_at',
        'is_completed',
        'completed_at',
    ];

    protected $casts = [
        'last_accessed_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_completed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function courseLesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class);
    }

    public function meditationSession(): BelongsTo
    {
        return $this->belongsTo(MeditationSession::class);
    }

    public function focusSession(): BelongsTo
    {
        return $this->belongsTo(FocusSession::class);
    }
}
