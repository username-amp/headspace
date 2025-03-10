<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class MeditationSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'section',
        'category',
        'duration',
        'description',
        'image_url',
        'video_url',
        'is_featured',
    ];
    

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function userMeditations(): HasMany
    {
        return $this->hasMany(UserMeditation::class, 'meditation_session_id', 'id');
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserProgress::class, 'meditation_session_id', 'id');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    protected static function boot()
    {
        parent::boot();

        static::forceDeleted(function ($session) {
            // Clean up files when the session is force deleted
            if ($session->image_url) {
                Storage::delete(str_replace('/storage/', 'public/', $session->image_url));
            }
            if ($session->video_url) {
                Storage::delete(str_replace('/storage/', 'public/', $session->video_url));
            }
        });
    }
}
