<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'price',
        'acreage',
        'bedrooms',
        'bathrooms',
        'square_feet',
        'listing_url',
        'notes',
        'analysis',
        'analyzed_at',
        'is_favorite',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'price' => 'decimal:2',
        'acreage' => 'decimal:2',
        'bathrooms' => 'decimal:1',
        'analysis' => 'array',
        'analyzed_at' => 'datetime',
        'is_favorite' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function priceHistories(): HasMany
    {
        return $this->hasMany(PriceHistory::class)->orderByDesc('price_date');
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip_code}";
    }
}
