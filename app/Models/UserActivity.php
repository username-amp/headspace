<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserActivity extends Model
{
    protected $fillable = [
        'user_id',
        'trackable_type',
        'trackable_id',
        'action',
        'duration',
    ];

    protected $casts = [
        'duration' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function trackable(): MorphTo
    {
        return $this->morphTo()->withTrashed();
    }

    public function getMorphClass()
    {
        return self::class;
    }

    protected function morphClass()
    {
        return [
            'meditation' => \App\Models\MeditationSession::class,
            'focus' => \App\Models\FocusSession::class,
        ];
    }
} 