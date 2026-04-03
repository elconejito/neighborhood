<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Property extends Model
{
    use HasFactory, Filterable;

    public array $searchable = ['address', 'city', 'zip_code'];

    public array $filterable = ['bedrooms', 'bathrooms', 'city', 'state', 'is_pinned', 'neighborhood_id'];

    public array $sortable = ['created_at', 'updated_at', 'address', 'city'];

    protected $fillable = [
        'user_id',
        'neighborhood_id',
        'is_pinned',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'acreage',
        'bedrooms',
        'bathrooms',
        'square_feet',
        'year_built',
        'garage',
        'basement',
        'basement_walkout',
        'fireplace',
        'main_level_primary_bedroom',
        'pool',
        'fence',
        'deck',
        'water',
        'sewer',
        'reference_hvac_type_id',
        'hoa',
        'listing_url',
        'analysis',
        'analyzed_at',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'acreage' => 'decimal:2',
            'bathrooms' => 'decimal:1',
            'analysis' => 'array',
            'analyzed_at' => 'datetime',
            'is_pinned' => 'boolean',
            'basement_walkout' => 'boolean',
            'fireplace' => 'boolean',
            'main_level_primary_bedroom' => 'boolean',
            'pool' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }

    public function hvacType(): BelongsTo
    {
        return $this->belongsTo(ReferenceHvacType::class, 'reference_hvac_type_id');
    }

    public function priceHistories(): HasMany
    {
        return $this->hasMany(PriceHistory::class)->orderByDesc('price_date');
    }

    public function listingCycles(): HasMany
    {
        return $this->hasMany(ListingCycle::class)->orderByDesc('listed_at');
    }

    public function currentListingCycle(): ?ListingCycle
    {
        return $this->listingCycles()->where('status', 'listed')->first();
    }

    public function notes(): MorphMany
    {
        return $this->morphMany(Note::class, 'notable');
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->team_id) {
            return $query->whereIn('neighborhood_id', $user->team->neighborhoods()->pluck('id'));
        }

        return $query->where('user_id', $user->id);
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip_code}";
    }
}
