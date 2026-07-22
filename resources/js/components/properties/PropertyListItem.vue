<script setup>
import { computed } from 'vue';
import { formatRelativeDistance } from '@/helpers';
import ComparisonIndicator from './ComparisonIndicator.vue';

const props = defineProps({
    property: { type: Object, required: true },
    isPinned: { type: Boolean, default: false },
    pinnedProperty: { type: Object, default: null },
    neighborhoodId: { type: [String, Number], required: true },
});

const fmtCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const nearestNeighbor = computed(() => props.property.analysis?.neighbor_distance?.nearest_houses?.[0]);

const neighborLabel = computed(() => {
    if (!nearestNeighbor.value) return '—';
    return formatRelativeDistance(nearestNeighbor.value.distance_meters);
});

function formatPrice(price) {
    return price == null ? null : fmtCurrency.format(price);
}

function formatDate(date) {
    return date ? fmtDate.format(new Date(`${date}T00:00:00Z`)) : null;
}

const latestMarketEvent = computed(() => {
    if (props.property.last_sale_date) {
        return {
            label: 'Last Sold',
            price: formatPrice(props.property.last_sale_price),
            date: formatDate(props.property.last_sale_date),
            tone: 'text-primary',
        };
    }

    if (props.property.last_listing_date) {
        return {
            label: 'Last Listed',
            price: formatPrice(props.property.last_listing_price),
            date: formatDate(props.property.last_listing_date),
            tone: 'text-tertiary',
        };
    }

    return {
        label: 'No Market History',
        price: null,
        date: null,
        tone: 'text-on-surface-variant',
    };
});

const formattedSquareFeet = computed(() => {
    return props.property.square_feet == null ? '—' : props.property.square_feet.toLocaleString();
});

function compareToPin(val, pinVal) {
    if (val == null || pinVal == null) return null;
    if (val > pinVal) return 'up';
    if (val < pinVal) return 'down';
    return 'equal';
}

const bedroomComparison = computed(() => {
    if (!props.pinnedProperty) return null;
    return compareToPin(props.property.bedrooms, props.pinnedProperty.bedrooms);
});

const bathroomComparison = computed(() => {
    if (!props.pinnedProperty) return null;
    return compareToPin(props.property.bathrooms, props.pinnedProperty.bathrooms);
});

const sqftComparison = computed(() => {
    if (!props.pinnedProperty) return null;
    return compareToPin(props.property.square_feet, props.pinnedProperty.square_feet);
});

const acreageComparison = computed(() => {
    if (!props.pinnedProperty) return null;
    return compareToPin(props.property.acreage, props.pinnedProperty.acreage);
});
</script>

<template>
    <!-- Active Holding (Pinned) -->
    <div
        v-if="isPinned"
        class="bg-primary-container/30 border-l-4 border-primary rounded-xl p-4 flex items-center gap-8 relative overflow-hidden"
    >
        <router-link :to="`/neighborhoods/${props.neighborhoodId}/properties/${property.id}`" class="flex items-center gap-8 grow min-w-0">
            <div class="hidden md:flex w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-primary-container items-center justify-center">
                <span class="material-symbols-outlined text-primary/50 text-2xl">home</span>
            </div>
            <div class="grow grid gap-4 items-center md:grid-cols-12">
                <div class="md:col-span-4">
                    <h3 class="text-base font-bold text-primary leading-tight">{{ property.address }}</h3>
                    <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
                </div>
                <div class="md:col-span-3 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Beds / Baths</p>
                        <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }} / {{ property.bathrooms ?? '—' }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Size</p>
                        <p class="text-sm font-semibold">{{ formattedSquareFeet }} sq ft · {{ property.acreage ?? '—' }} ac</p>
                    </div>
                </div>
                <div class="md:col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Closest Neighbor</p>
                    <p class="text-sm font-semibold text-primary">{{ neighborLabel }}</p>
                </div>
                <div class="md:col-span-3 text-right md:pr-4">
                    <p class="text-[10px] font-bold uppercase mb-1" :class="latestMarketEvent.tone">{{ latestMarketEvent.label }}</p>
                    <p class="text-base font-black md:text-lg" :class="latestMarketEvent.tone">{{ latestMarketEvent.price ?? '—' }}</p>
                    <p class="text-xs text-on-surface-variant">{{ latestMarketEvent.date ?? '—' }}</p>
                </div>
            </div>
        </router-link>
    </div>

    <!-- Standard Catalog Row -->
    <router-link
        v-else
        :to="`/neighborhoods/${props.neighborhoodId}/properties/${property.id}`"
        class="bg-surface-container-lowest border border-transparent hover:border-primary-container rounded-xl p-4 flex items-center gap-8 hover:bg-surface-container-low transition-colors group"
    >
        <div class="hidden md:flex w-14 h-14 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 items-center justify-center">
            <span class="material-symbols-outlined text-outline-variant">home</span>
        </div>
        <div class="grow grid gap-4 items-center md:grid-cols-12">
            <div class="md:col-span-4">
                <h3 class="text-base font-bold text-on-surface leading-tight">{{ property.address }}</h3>
                <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
            </div>
            <div class="md:col-span-3 grid grid-cols-2 gap-4 text-center">
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Beds / Baths</p>
                    <div class="flex items-center justify-center gap-1">
                        <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }}</p>
                        <ComparisonIndicator :comparison="bedroomComparison" />
                        <span class="text-on-surface-variant">/</span>
                        <p class="text-sm font-semibold">{{ property.bathrooms ?? '—' }}</p>
                        <ComparisonIndicator :comparison="bathroomComparison" />
                    </div>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Size</p>
                    <div class="flex items-center justify-center gap-1">
                        <p class="text-sm font-semibold">{{ formattedSquareFeet }} sq ft</p>
                        <ComparisonIndicator :comparison="sqftComparison" />
                        <span class="text-on-surface-variant">·</span>
                        <p class="text-sm font-semibold">{{ property.acreage ?? '—' }} ac</p>
                        <ComparisonIndicator :comparison="acreageComparison" />
                    </div>
                </div>
            </div>
            <div class="md:col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Neighbor</p>
                <p class="text-sm font-semibold">{{ neighborLabel }}</p>
            </div>
            <div class="md:col-span-3 text-right md:pr-4">
                <p class="text-[10px] font-bold uppercase mb-1" :class="latestMarketEvent.tone">{{ latestMarketEvent.label }}</p>
                <p class="text-base font-black md:text-lg" :class="latestMarketEvent.tone">{{ latestMarketEvent.price ?? '—' }}</p>
                <p class="text-xs text-on-surface-variant">{{ latestMarketEvent.date ?? '—' }}</p>
            </div>
        </div>
    </router-link>
</template>
