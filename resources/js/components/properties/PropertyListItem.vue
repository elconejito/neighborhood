<script setup>
import { computed, ref } from 'vue';

const NEIGHBOR_GOOD_FT = 100;

const props = defineProps({
    property: { type: Object, required: true },
    target: { type: Object, default: null },
    neighborhoodId: { type: [String, Number], required: true },
    showNeighbor: { type: Boolean, default: true },
});

const expanded = ref(false);
const fmtCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtNumber = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const latestMarketEvent = computed(() => {
    if (props.property.price_event_type && props.property.market_activity_date) {
        const label = marketEventLabel(props.property.price_event_type);
        return { label, priceValue: props.property.market_price, price: formatPrice(props.property.market_price), date: formatDate(props.property.market_activity_date) };
    }
    if (props.property.last_sale_price != null || props.property.last_sale_date) {
        return { label: 'Sold', priceValue: props.property.last_sale_price ?? props.property.market_price, price: formatPrice(props.property.last_sale_price ?? props.property.market_price), date: formatDate(props.property.last_sale_date) };
    }
    if (props.property.last_listing_price != null || props.property.last_listing_date) {
        const listingLabels = { reduction: 'Price drop', increase: 'Price increase', listing: 'Listed' };
        return { label: listingLabels[props.property.last_listing_event_type] ?? 'Listed', priceValue: props.property.last_listing_price ?? props.property.market_price, price: formatPrice(props.property.last_listing_price ?? props.property.market_price), date: formatDate(props.property.last_listing_date) };
    }
    return { label: 'Market activity', priceValue: props.property.market_price, price: formatPrice(props.property.market_price), date: formatDate(props.property.market_activity_date) };
});

const marketPrice = computed(() => props.property.market_price ?? latestMarketEvent.value.priceValue);
const targetPrice = computed(() => props.target?.market_price ?? null);
const pricePerSquareFoot = computed(() => {
    if (props.property.price_per_square_foot != null) return Number(props.property.price_per_square_foot);
    if (marketPrice.value == null || props.property.square_feet == null || props.property.square_feet <= 0) return null;
    return Number(marketPrice.value) / Number(props.property.square_feet);
});
const targetPricePerSquareFoot = computed(() => {
    if (props.target?.price_per_square_foot != null) return Number(props.target.price_per_square_foot);
    if (targetPrice.value == null || props.target?.square_feet == null || props.target.square_feet <= 0) return null;
    return Number(targetPrice.value) / Number(props.target.square_feet);
});
const priceDelta = computed(() => delta(marketPrice.value, targetPrice.value));
const pricePercentageDelta = computed(() => {
    if (priceDelta.value == null || targetPrice.value == null || Number(targetPrice.value) === 0) return null;
    return priceDelta.value / Number(targetPrice.value) * 100;
});
const pricePerSquareFootDelta = computed(() => delta(pricePerSquareFoot.value, targetPricePerSquareFoot.value));

const neighborDistanceMeters = computed(() => {
    if (props.property.closest_neighbor_distance_meters != null) return Number(props.property.closest_neighbor_distance_meters);
    return props.property.analysis?.neighbor_distance?.nearest_houses?.[0]?.distance_meters ?? null;
});
const neighborDistanceFeet = computed(() => neighborDistanceMeters.value == null ? null : Math.round(Number(neighborDistanceMeters.value) * 3.28084));
const neighborReading = computed(() => neighborDistanceFeet.value != null && neighborDistanceFeet.value >= NEIGHBOR_GOOD_FT ? 'Well spaced' : 'Close');

const differences = computed(() => {
    if (!props.target) return [];
    const values = [
        difference(props.property.bedrooms, props.target.bedrooms, 2, formatBedrooms),
        difference(props.property.bathrooms, props.target.bathrooms, 1.5, formatBathrooms),
        difference(props.property.square_feet, props.target.square_feet, 1200, formatSquareFeet),
        difference(props.property.acreage, props.target.acreage, 0.3, formatAcreage),
        difference(props.property.year_built, props.target.year_built, 20, formatYear),
    ].filter(Boolean);
    return values.sort((a, b) => b.contribution - a.contribution);
});
const visibleDifferences = computed(() => expanded.value ? differences.value : differences.value.slice(0, 2));
const formattedSquareFeet = computed(() => props.property.square_feet == null ? null : fmtNumber.format(props.property.square_feet));
const conciseAccessibleName = computed(() => {
    const price = marketPrice.value == null ? 'no market price' : formatPrice(marketPrice.value);
    const deltaText = priceDelta.value == null ? '' : priceDelta.value === 0 ? ', same as target' : `, ${formatSignedCurrency(priceDelta.value)} ${priceDelta.value < 0 ? 'below' : 'above'} target`;
    return `${props.property.address}, ${latestMarketEvent.value.label.toLowerCase()} ${price}${deltaText}. Property details.`;
});

function delta(value, baseline) {
    if (value == null || baseline == null) return null;
    const result = Number(value) - Number(baseline);
    return Math.abs(result) < 0.000001 ? 0 : result;
}

function difference(value, baseline, normalizer, formatter) {
    const amount = delta(value, baseline);
    if (amount == null || amount === 0) return null;
    return { text: formatter(amount), contribution: Math.abs(amount) / normalizer };
}

function formatPrice(value) {
    return value == null ? null : fmtCurrency.format(value);
}

function formatSignedCurrency(value) {
    if (value == null) return '';
    return `${value < 0 ? '−' : '+'}${fmtCurrency.format(Math.abs(value))}`;
}

function formatSignedNumber(value, digits = 0) {
    const formatted = Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
    return `${value < 0 ? '−' : '+'}${formatted}`;
}

function formatBedrooms(value) { return `${formatSignedNumber(value)} ${Math.abs(value) === 1 ? 'bed' : 'beds'}`; }
function formatBathrooms(value) { return `${formatSignedNumber(value, 1).replace(/\.0$/, '')} ${Math.abs(value) === 1 ? 'bath' : 'baths'}`; }
function formatSquareFeet(value) { return `${formatSignedNumber(value)} sq ft`; }
function formatAcreage(value) { return `${formatSignedNumber(value, 2)} ac`; }
function formatYear(value) { return `${Math.abs(value).toLocaleString('en-US')} yr ${value < 0 ? 'older' : 'newer'}`; }
function formatDate(date) { return date ? fmtDate.format(new Date(`${date}T00:00:00Z`)) : null; }
function direction(value) { return value == null || value === 0 ? '' : value > 0 ? '▲' : '▼'; }
function marketEventLabel(type) {
    const labels = { sold: 'Sold', sale: 'Sold', listing: 'Listed', reduction: 'Price drop', price_drop: 'Price drop', increase: 'Price increase', price_increase: 'Price increase' };
    return labels[type] ?? 'Market activity';
}
</script>

<template>
    <article class="property-row group">
        <router-link
            :to="`/neighborhoods/${props.neighborhoodId}/properties/${property.id}`"
            class="property-row-link"
            :class="{ 'property-row-link--without-neighbor': !showNeighbor }"
            :aria-label="conciseAccessibleName"
            :aria-describedby="`property-${property.id}-differences`"
        >
            <div class="property-cell property-cell--address">
                <h3 class="text-[15px] md:text-base font-bold leading-tight text-on-surface group-hover:text-primary transition-colors">{{ property.address }}</h3>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                    <span class="status-chip">{{ latestMarketEvent.label }}</span>
                    <span v-if="latestMarketEvent.date">{{ latestMarketEvent.date }}</span>
                </div>
            </div>
            <div class="property-cell property-cell--price">
                <p class="text-xl md:text-[20px] font-extrabold leading-none tracking-[-0.015em] text-on-surface">{{ formatPrice(marketPrice) ?? 'Price unavailable' }}</p>
                <p v-if="priceDelta != null" class="mt-2 text-xs font-semibold text-on-surface-variant">
                    <template v-if="priceDelta === 0"><span>same as target</span></template>
                    <template v-else><span aria-hidden="true">{{ direction(priceDelta) }}</span><span>{{ formatSignedCurrency(priceDelta) }} · {{ pricePercentageDelta == null ? '' : `${pricePercentageDelta < 0 ? '−' : '+'}${Math.abs(pricePercentageDelta).toFixed(1)}%` }}</span><span class="sr-only">{{ priceDelta < 0 ? ' below ' : ' above ' }}target</span></template>
                </p>
                <p v-else class="mt-2 text-xs text-outline">No target comparison</p>
                <div v-if="priceDelta != null && targetPrice" class="magnitude-bar" aria-hidden="true">
                    <span class="magnitude-bar__fill" :class="priceDelta < 0 ? 'magnitude-bar__fill--negative' : 'magnitude-bar__fill--positive'" :style="{ width: `${Math.min(Math.abs(pricePercentageDelta ?? 0) / 25 * 50, 50)}%` }"></span>
                </div>
            </div>
            <div class="property-cell property-cell--psf">
                <template v-if="pricePerSquareFoot != null">
                    <p class="text-base font-bold text-on-surface">{{ formatPrice(pricePerSquareFoot) }}</p>
                    <p v-if="pricePerSquareFootDelta != null && Math.abs(pricePerSquareFootDelta) >= 1" class="mt-2 text-xs font-semibold text-on-surface-variant"><span aria-hidden="true">{{ direction(pricePerSquareFootDelta) }}</span> {{ formatSignedCurrency(pricePerSquareFootDelta) }}/sq ft</p>
                    <p v-else-if="pricePerSquareFootDelta != null" class="mt-2 text-xs font-semibold text-on-surface-variant">same as target</p>
                </template>
                <p v-else class="text-xs text-outline">Not available</p>
            </div>
            <div v-if="showNeighbor" class="property-cell property-cell--neighbor">
                <template v-if="neighborDistanceFeet != null">
                    <p class="text-base font-bold" :class="neighborDistanceFeet >= NEIGHBOR_GOOD_FT ? 'text-primary' : 'text-on-surface'">{{ neighborDistanceFeet }} ft</p>
                    <p class="mt-2 text-xs font-semibold" :class="neighborDistanceFeet >= NEIGHBOR_GOOD_FT ? 'text-primary' : 'text-on-surface-variant'">{{ neighborReading }}</p>
                </template>
                <p v-else class="text-xs text-outline">Not surveyed</p>
            </div>
            <div :id="`property-${property.id}-differences`" class="property-cell property-cell--why" aria-label="Why it may differ">
                <span v-for="difference in visibleDifferences" :key="difference.text" class="difference-chip">{{ difference.text }}</span>
                <span v-if="!differences.length && target" class="text-xs text-outline">Matches target attributes</span>
            </div>
            <div class="property-facts" aria-label="Property facts">
                <span v-if="property.bedrooms != null">{{ property.bedrooms }} bd</span>
                <span v-if="property.bathrooms != null">{{ property.bathrooms }} ba</span>
                <span v-if="formattedSquareFeet != null">{{ formattedSquareFeet }} sq ft</span>
                <span v-if="property.acreage != null">{{ Number(property.acreage).toFixed(2) }} ac</span>
                <span v-if="pricePerSquareFoot != null">{{ formatPrice(pricePerSquareFoot) }}/sq ft<span v-if="pricePerSquareFootDelta != null && Math.abs(pricePerSquareFootDelta) >= 1"> {{ formatSignedCurrency(pricePerSquareFootDelta) }}</span><span v-else-if="pricePerSquareFootDelta != null"> same as target</span></span>
                <span v-if="showNeighbor && neighborDistanceFeet != null" :class="neighborDistanceFeet >= NEIGHBOR_GOOD_FT ? 'text-primary' : 'text-on-surface-variant'">{{ neighborReading.toLowerCase() }} · {{ neighborDistanceFeet }} ft to neighbor</span>
                <span v-else-if="showNeighbor && neighborDistanceFeet == null" class="text-outline">Not surveyed</span>
            </div>
        </router-link>
        <div class="mobile-card-details">
            <p class="mobile-compared-label">Compared with target</p>
            <div class="mobile-fact-grid" :class="{ 'mobile-fact-grid--without-neighbor': !showNeighbor }">
                <div v-if="pricePerSquareFoot != null" class="mobile-fact-tile"><span>$/sq ft</span><strong>{{ formatPrice(pricePerSquareFoot) }}</strong><small v-if="pricePerSquareFootDelta != null && Math.abs(pricePerSquareFootDelta) >= 1"><span aria-hidden="true">{{ direction(pricePerSquareFootDelta) }}</span> {{ formatSignedCurrency(pricePerSquareFootDelta) }}</small><small v-else-if="pricePerSquareFootDelta != null">same as target</small></div>
                <div v-if="formattedSquareFeet != null" class="mobile-fact-tile"><span>Sq ft</span><strong>{{ formattedSquareFeet }}</strong><small v-if="props.target?.square_feet != null && property.square_feet !== props.target.square_feet">{{ formatSignedNumber(property.square_feet - props.target.square_feet) }}</small></div>
                <div v-if="showNeighbor" class="mobile-fact-tile"><span>Neighbor</span><strong v-if="neighborDistanceFeet != null" :class="neighborDistanceFeet >= NEIGHBOR_GOOD_FT ? 'text-primary' : ''">{{ neighborDistanceFeet }} ft</strong><strong v-else class="text-outline">Not surveyed</strong><small v-if="neighborDistanceFeet != null">{{ neighborReading }}</small></div>
            </div>
            <div class="mobile-difference-row">
                <span v-for="difference in visibleDifferences" :key="`mobile-${difference.text}`" class="difference-chip">{{ difference.text }}</span>
                <button v-if="differences.length > 2" type="button" class="details-button" :aria-expanded="expanded" @click="expanded = !expanded">{{ expanded ? 'Hide details' : 'All details' }} <span class="material-symbols-outlined text-base" aria-hidden="true">{{ expanded ? 'expand_less' : 'expand_more' }}</span></button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.property-row { position: relative; background: var(--color-surface-container-lowest); border-radius: 8px; transition: box-shadow 120ms ease, background-color 120ms ease; }
.property-row:hover { box-shadow: 0 2px 8px rgba(43, 52, 55, 0.05); }
.property-row-link { display: grid; grid-template-columns: minmax(0, 1fr) 200px 150px 132px 300px; gap: 20px; align-items: center; min-height: 88px; padding: 14px 24px; color: inherit; text-decoration: none; outline: none; }
.property-row-link--without-neighbor { grid-template-columns: minmax(0, 1fr) 200px 150px 300px; }
.property-row-link:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 8px; }
.property-cell--price, .property-cell--psf, .property-cell--neighbor { text-align: right; }
.property-cell--why { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.status-chip, .difference-chip { display: inline-flex; align-items: center; width: fit-content; border-radius: 4px; background: var(--color-surface-container); color: var(--color-on-surface-variant); }
.status-chip { padding: 4px 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.difference-chip { padding: 7px 10px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.magnitude-bar { position: relative; height: 5px; margin-top: 10px; overflow: visible; border-radius: 999px; background: var(--color-surface-container-low); }
.magnitude-bar::before { position: absolute; left: 50%; top: -2px; width: 1px; height: 9px; content: ''; background: var(--color-outline-variant); }
.magnitude-bar__fill { position: absolute; top: 0; height: 5px; border-radius: 999px; background: #7f8b9c; }
.magnitude-bar__fill--negative { right: 50%; }
.magnitude-bar__fill--positive { left: 50%; }
.property-facts, .mobile-card-details { display: none; }
@media (max-width: 1279px) and (min-width: 1024px) { .property-row-link { grid-template-columns: minmax(0, 1fr) 170px 130px 112px minmax(210px, 1fr); gap: 14px; } .property-row-link--without-neighbor { grid-template-columns: minmax(0, 1fr) 170px 130px minmax(210px, 1fr); } }
@media (max-width: 1023px) {
    .property-row-link { display: grid; grid-template-columns: minmax(0, 1fr) max-content; gap: 9px 20px; min-height: 105px; padding: 14px 20px; }
    .property-cell--address { grid-column: 1; grid-row: 1; }
    .property-cell--price { grid-column: 2; grid-row: 1; }
    .property-cell--psf, .property-cell--neighbor { display: none; }
    .property-cell--why { display: flex; grid-column: 2; grid-row: 2; justify-content: flex-end; }
    .property-row-link--without-neighbor { grid-template-columns: minmax(0, 1fr) max-content; }
    .property-facts { display: flex; grid-column: 1; grid-row: 2; min-width: 0; flex-wrap: wrap; align-items: center; gap: 4px 10px; color: var(--color-on-surface-variant); font-size: 12px; font-weight: 600; line-height: 1.4; }
    .property-facts > span:not(:last-child)::after { content: ' ·'; color: var(--color-outline-variant); }
    .magnitude-bar { display: none; }
}
@media (max-width: 767px) {
    .property-row { overflow: hidden; }
    .property-row-link { display: grid; grid-template-columns: minmax(0, 1fr) max-content; gap: 0 10px; min-height: 0; padding: 14px 16px 0; }
    .property-cell--address { grid-column: 1; grid-row: 1; }
    .property-cell--price { grid-column: 2; grid-row: 1; }
    .property-cell--why { display: none; }
    .property-cell--price p:first-child { font-size: 18px; }
    .property-cell--price p:nth-child(2) { white-space: nowrap; }
    .property-facts { display: none; }
    .mobile-card-details { display: block; padding: 11px 16px 14px; }
    .mobile-compared-label { margin: 0 0 8px; color: var(--color-outline); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
    .mobile-fact-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .mobile-fact-grid--without-neighbor { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .mobile-fact-tile { min-width: 0; padding: 8px 9px; border-radius: 4px; background: var(--color-surface-container-low); }
    .mobile-fact-tile span { display: block; color: var(--color-outline); font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .mobile-fact-tile strong { display: block; margin-top: 6px; overflow: hidden; color: var(--color-on-surface); font-size: 16px; line-height: 1; text-overflow: ellipsis; white-space: nowrap; }
    .mobile-fact-tile small { display: block; margin-top: 6px; color: var(--color-on-surface-variant); font-size: 12px; font-weight: 600; line-height: 1.1; }
    .mobile-difference-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 10px; }
    .details-button { display: inline-flex; align-items: center; gap: 2px; min-height: 44px; margin-left: auto; padding: 8px 0 8px 10px; color: var(--color-primary); font-size: 13px; font-weight: 700; }
}
@media (prefers-reduced-motion: reduce) { .property-row { transition: none; } }
</style>
