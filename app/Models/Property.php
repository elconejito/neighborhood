<?php

namespace App\Models;

use App\Traits\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Property extends Model
{
    use Filterable, HasFactory;

    public array $searchable = ['address', 'city', 'zip_code'];

    public array $filterable = ['bedrooms', 'bathrooms', 'city', 'state', 'is_pinned', 'neighborhood_id'];

    public array $sortable = [
        'created_at',
        'updated_at',
        'address',
        'city',
        'last_sale_date',
        'market_price',
        'market_activity_date',
    ];

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
        'geocoding_source',
        'geocoding_accuracy',
        'geocoding_accuracy_score',
        'geocoding_match_type',
        'geocoding_data_source',
        'geocoding_matched_address',
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
            'geocoding_accuracy_score' => 'float',
            'basement_walkout' => 'boolean',
            'fireplace' => 'boolean',
            'main_level_primary_bedroom' => 'boolean',
            'pool' => 'boolean',
            'last_sale_date' => 'date',
            'last_listing_date' => 'date',
            'market_price' => 'decimal:2',
            'market_activity_date' => 'date',
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

    public function lastSoldHistory(): HasOne
    {
        return $this->hasOne(PriceHistory::class)
            ->where('type', 'sold')
            ->latestOfMany('price_date');
    }

    public function lastListingHistory(): HasOne
    {
        return $this->hasOne(PriceHistory::class)
            ->whereIn('type', ['listing', 'reduction', 'increase'])
            ->latestOfMany('price_date');
    }

    public function lastListingCycle(): HasOne
    {
        return $this->hasOne(ListingCycle::class)
            ->whereNotNull('listed_at')
            ->latestOfMany('listed_at');
    }

    public function lastSoldCycle(): HasOne
    {
        return $this->hasOne(ListingCycle::class)
            ->where('status', 'sold')
            ->whereNotNull('sold_at')
            ->latestOfMany('sold_at');
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

    public function scopeWithMarketSummary(Builder $query): Builder
    {
        $propertyId = $this->qualifyColumn($this->getKeyName());

        $lastSalePrice = PriceHistory::query()
            ->select('price')
            ->whereColumn('property_id', $propertyId)
            ->where('type', 'sold')
            ->orderByDesc('price_date')
            ->orderByDesc('id')
            ->limit(1);

        $lastSaleDate = PriceHistory::query()
            ->select('price_date')
            ->whereColumn('property_id', $propertyId)
            ->where('type', 'sold')
            ->orderByDesc('price_date')
            ->orderByDesc('id')
            ->limit(1);

        $lastListingPrice = PriceHistory::query()
            ->select('price')
            ->whereColumn('property_id', $propertyId)
            ->whereIn('type', ['listing', 'reduction', 'increase'])
            ->orderByDesc('price_date')
            ->orderByDesc('id')
            ->limit(1);

        $lastListingDate = PriceHistory::query()
            ->select('price_date')
            ->whereColumn('property_id', $propertyId)
            ->whereIn('type', ['listing', 'reduction', 'increase'])
            ->orderByDesc('price_date')
            ->orderByDesc('id')
            ->limit(1);

        $lastListingEventType = PriceHistory::query()
            ->select('type')
            ->whereColumn('property_id', $propertyId)
            ->whereIn('type', ['listing', 'reduction', 'increase'])
            ->orderByDesc('price_date')
            ->orderByDesc('id')
            ->limit(1);

        return $query
            ->select($this->qualifyColumn('*'))
            ->addSelect([
                'last_sale_price' => clone $lastSalePrice,
                'last_sale_date' => clone $lastSaleDate,
                'last_listing_price' => clone $lastListingPrice,
                'last_listing_date' => clone $lastListingDate,
                'last_listing_event_type' => $lastListingEventType,
            ])
            ->selectRaw(
                "COALESCE(({$lastSalePrice->toSql()}), ({$lastListingPrice->toSql()})) as market_price",
                [...$lastSalePrice->getBindings(), ...$lastListingPrice->getBindings()],
            )
            ->selectRaw(
                "COALESCE(({$lastSaleDate->toSql()}), ({$lastListingDate->toSql()})) as market_activity_date",
                [...$lastSaleDate->getBindings(), ...$lastListingDate->getBindings()],
            );
    }

    public function scopeWhereSaleStatus(Builder $query, ?string $saleStatus): Builder
    {
        if ($saleStatus === 'sold') {
            return $query->where(function (Builder $query): void {
                $query
                    ->whereHas('priceHistories', fn (Builder $query) => $query->where('type', 'sold'))
                    ->orWhereHas('listingCycles', fn (Builder $query) => $query->where('status', 'sold'));
            });
        }

        if ($saleStatus === 'unsold') {
            return $query
                ->whereDoesntHave('priceHistories', fn (Builder $query) => $query->where('type', 'sold'))
                ->whereDoesntHave('listingCycles', fn (Builder $query) => $query->where('status', 'sold'));
        }

        return $query;
    }

    public function applyMarketPriceSort(Builder $query, string $direction): void
    {
        $query
            ->orderByRaw('market_price IS NULL')
            ->orderBy('market_price', $direction);
    }

    public function applyMarketActivityDateSort(Builder $query, string $direction): void
    {
        $query
            ->orderByRaw('market_activity_date IS NULL')
            ->orderBy('market_activity_date', $direction);
    }

    public function applyAddressSort(Builder $query, string $direction): void
    {
        $address = $this->qualifyColumn('address');

        $query
            ->orderByRaw("LOWER(TRIM(SUBSTR(TRIM({$address}), INSTR(TRIM({$address}), ' ') + 1))) {$direction}")
            ->orderByRaw("(TRIM({$address}) + 0) {$direction}")
            ->orderBy($address, $direction);
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip_code}";
    }
}
