<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Course extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'duration',
        'is_published',
        'created_by',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class)->orderBy('order');
    }

    public function progress(): HasManyThrough
    {
        return $this->hasManyThrough(
            UserProgress::class,   // The final related model (progress records)
            CourseLesson::class,   // The intermediate model (lessons)
            'course_id',           // Foreign key on CourseLesson table linking to Course
            'course_lesson_id',    // Foreign key on UserProgress table linking to CourseLesson
            'id',                  // Local key on Course table (typically id)
            'id'                   // Local key on CourseLesson table (typically id)
        );
    }

    protected static function boot()
    {
        parent::boot();

        static::forceDeleted(function ($course) {
            // Clean up image file when the course is force deleted
            if ($course->image_url) {
                Storage::delete(str_replace('/storage/', 'public/', $course->image_url));
            }

            // Force delete all lessons
            $course->lessons()->withTrashed()->get()->each(function ($lesson) {
                $lesson->forceDelete();
            });
        });
    }
}
