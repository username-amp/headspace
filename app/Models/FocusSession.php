<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class FocusSession extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'type',
        'section',
        'category',
        'duration',
        'description',
        'image_url',
        'audio_url',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class);
    }

    public function activities()
    {
        return $this->morphMany(UserActivity::class, 'trackable');
    }

    protected static function boot()
    {
        parent::boot();

        // When force deleting, clean up files
        static::forceDeleted(function ($focusSession) {
            if ($focusSession->image_url) {
                Storage::delete(str_replace('/storage/', 'public/', $focusSession->image_url));
            }
            if ($focusSession->audio_url) {
                Storage::delete(str_replace('/storage/', 'public/', $focusSession->audio_url));
            }
        });
    }
}
