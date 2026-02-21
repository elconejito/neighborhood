<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Neighborhood extends Model
{
    use HasFactory;

    protected $fillable = ['team_id', 'name'];

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    public function listingCycles(): HasManyThrough
    {
        return $this->hasManyThrough(ListingCycle::class, Property::class);
    }

    public function getAveragePercentOfListPrice(): ?float
    {
        $cycles = $this->listingCycles()
            ->where('status', 'sold')
            ->whereNotNull('list_price')
            ->whereNotNull('sold_price')
            ->get();

        if ($cycles->isEmpty()) {
            return null;
        }

        $percents = $cycles->map(fn ($cycle) => $cycle->getPercentOfListPrice())
            ->filter(fn ($percent) => $percent !== null);

        if ($percents->isEmpty()) {
            return null;
        }

        return (float) ($percents->average());
    }
}
