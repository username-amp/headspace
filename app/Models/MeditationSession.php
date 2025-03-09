<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MeditationSession extends Model
{
    protected $fillable = [
        'title',
        'type',
        'duration',
        'description',
        'image_url',
        'category',
        'is_featured',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function userMeditations(): HasMany
    {
        return $this->hasMany(UserMeditation::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
