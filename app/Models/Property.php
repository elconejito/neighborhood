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
                "CASE
                    WHEN ({$lastSaleDate->toSql()}) IS NULL THEN ({$lastListingPrice->toSql()})
                    WHEN ({$lastListingDate->toSql()}) IS NULL THEN ({$lastSalePrice->toSql()})
                    WHEN ({$lastListingDate->toSql()}) > ({$lastSaleDate->toSql()}) THEN ({$lastListingPrice->toSql()})
                    ELSE ({$lastSalePrice->toSql()})
                END as market_price",
                [
                    ...$lastSaleDate->getBindings(),
                    ...$lastListingPrice->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastSalePrice->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastSaleDate->getBindings(),
                    ...$lastListingPrice->getBindings(),
                    ...$lastSalePrice->getBindings(),
                ],
            )
            ->selectRaw(
                "CASE
                    WHEN ({$lastSaleDate->toSql()}) IS NULL THEN ({$lastListingDate->toSql()})
                    WHEN ({$lastListingDate->toSql()}) IS NULL THEN ({$lastSaleDate->toSql()})
                    WHEN ({$lastListingDate->toSql()}) > ({$lastSaleDate->toSql()}) THEN ({$lastListingDate->toSql()})
                    ELSE ({$lastSaleDate->toSql()})
                END as market_activity_date",
                [
                    ...$lastSaleDate->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastSaleDate->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastSaleDate->getBindings(),
                    ...$lastListingDate->getBindings(),
                    ...$lastSaleDate->getBindings(),
                ],
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

    public function applyMarketPriceGapSort(Builder $query, float $targetMarketPrice, string $direction): void
    {
        $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

        $query
            ->orderByRaw('market_price IS NULL')
            ->orderByRaw("ABS(market_price - ?) {$direction}", [$targetMarketPrice]);

        $this->applyMarketActivityDateSort($query, 'desc');
    }

    public function applyAddressSort(Builder $query, string $direction): void
    {
        $address = $this->qualifyColumn('address');

        $query
            ->orderByRaw("LOWER(TRIM(SUBSTR(TRIM({$address}), INSTR(TRIM({$address}), ' ') + 1))) {$direction}")
            ->orderByRaw("(TRIM({$address}) + 0) {$direction}")
            ->orderBy($address, $direction);
    }

    /**
     * Sort properties by their normalized difference from a pinned target.
     *
     * Rows with fewer than three comparable attributes are ordered after rows
     * with enough data, so incomplete records cannot receive an artificially
     * favorable similarity ranking.
     */
    public function applySimilaritySort(Builder $query, Property $target): void
    {
        $axes = [
            'bedrooms' => 2,
            'bathrooms' => 1.5,
            'square_feet' => 1200,
            'acreage' => 0.30,
            'year_built' => 20,
        ];

        $validAxisClauses = [];
        $validAxisBindings = [];
        $termClauses = [];
        $termBindings = [];

        foreach ($axes as $attribute => $normalizer) {
            $column = $this->qualifyColumn($attribute);
            $targetValue = $target->getAttribute($attribute);
            $normalizerSql = number_format($normalizer, 6, '.', '');

            $validAxisClauses[] = "CASE WHEN {$column} IS NOT NULL AND ? IS NOT NULL THEN 1 ELSE 0 END";
            $validAxisBindings[] = $targetValue;

            $termClauses[] = "CASE WHEN {$column} IS NULL OR ? IS NULL THEN 0 ELSE ABS({$column} - ?) / {$normalizerSql} END";
            $termBindings[] = $targetValue;
            $termBindings[] = $targetValue;
        }

        $validAxisSql = implode(' + ', $validAxisClauses);
        $termSql = implode(' + ', $termClauses);

        $query->selectRaw("{$validAxisSql} as similarity_valid_axes", $validAxisBindings);
        $query->selectRaw(
            "CASE WHEN ({$validAxisSql}) = 0 THEN NULL ELSE (({$termSql}) / ({$validAxisSql}) * 5 + (5 - ({$validAxisSql})) * 0.25) END as similarity_score",
            [...$validAxisBindings, ...$termBindings, ...$validAxisBindings, ...$validAxisBindings],
        );
        $query
            ->orderByRaw('similarity_valid_axes < 3')
            ->orderBy('similarity_score');

        $this->applyMarketActivityDateSort($query, 'desc');
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->zip_code}";
    }
}
