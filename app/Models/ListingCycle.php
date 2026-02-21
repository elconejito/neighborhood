<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ListingCycle extends Model
{
    /** @use HasFactory<\Database\Factories\ListingCycleFactory> */
    use HasFactory;

    protected $fillable = [
        'property_id',
        'status',
        'list_price',
        'sold_price',
        'listed_at',
        'sold_at',
        'off_market_at',
    ];

    protected $casts = [
        'list_price' => 'decimal:2',
        'sold_price' => 'decimal:2',
        'listed_at' => 'datetime',
        'sold_at' => 'datetime',
        'off_market_at' => 'datetime',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function priceHistories(): HasMany
    {
        return $this->hasMany(PriceHistory::class)->orderBy('price_date');
    }

    public function getPriceDifference(): ?float
    {
        if ($this->status !== 'sold' || $this->list_price === null || $this->sold_price === null) {
            return null;
        }

        return (float) ($this->sold_price - $this->list_price);
    }

    public function getIsSoldOverList(): bool
    {
        return $this->getPriceDifference() > 0;
    }

    public function getPercentOfListPrice(): ?float
    {
        if ($this->list_price == 0 || $this->list_price === null || $this->sold_price === null) {
            return null;
        }

        return round((float) (($this->sold_price / $this->list_price) * 100), 2);
    }
}
