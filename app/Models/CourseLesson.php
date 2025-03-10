<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class CourseLesson extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'video_url',
        'duration',
        'order',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::forceDeleted(function ($lesson) {
            // Clean up video file when the lesson is force deleted
            if ($lesson->video_url) {
                Storage::delete(str_replace('/storage/', 'public/', $lesson->video_url));
            }
        });
    }
}
