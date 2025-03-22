<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoodAssessment extends Model
{
    protected $fillable = [
        'user_id',
        'meditation_session_id',
        'assessment_type',
        'emotions',
        'mood_rating',
        'physical_symptoms',
        'mood_shift',
        'emotional_state',
        'reflections',
    ];

    protected $casts = [
        'emotions' => 'array',
        'physical_symptoms' => 'array',
        'mood_rating' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function meditationSession(): BelongsTo
    {
        return $this->belongsTo(MeditationSession::class);
    }

    public function scopePreAssessments($query)
    {
        return $query->where('assessment_type', 'pre');
    }

    public function scopePostAssessments($query)
    {
        return $query->where('assessment_type', 'post');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForSession($query, $sessionId)
    {
        return $query->where('meditation_session_id', $sessionId);
    }
} 