<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PriceHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'listing_cycle_id',
        'price',
        'price_date',
        'type',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_date' => 'date',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function listingCycle(): BelongsTo
    {
        return $this->belongsTo(ListingCycle::class);
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'notable');
    }
}
