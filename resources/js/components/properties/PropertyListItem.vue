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

const lastSalePrice = computed(() => {
    if (!props.property.last_sale_price) return null;
    return fmtCurrency.format(props.property.last_sale_price);
});

const lastSaleDate = computed(() => {
    if (!props.property.last_sale_date) return null;
    return fmtDate.format(new Date(`${props.property.last_sale_date}T00:00:00Z`));
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
                <div class="md:col-span-2">
                    <h3 class="text-base font-bold text-primary leading-tight">{{ property.address }}</h3>
                    <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
                </div>
                <div class="md:col-span-1 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bed</p>
                    <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }}</p>
                </div>
                <div class="md:col-span-1 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bath</p>
                    <p class="text-sm font-semibold">{{ property.bathrooms ?? '—' }}</p>
                </div>
                <div class="md:col-span-1 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Square Ft</p>
                    <p class="text-sm font-semibold">{{ property.square_feet ?? '—' }}</p>
                </div>
                <div class="md:col-span-1 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Acreage</p>
                    <p class="text-sm font-semibold">{{ property.acreage ?? '—' }}</p>
                </div>
                <div class="md:col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Closest Neighbor</p>
                    <p class="text-sm font-semibold text-primary">{{ neighborLabel }}</p>
                </div>
                <div class="md:col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Last Sold</p>
                    <p class="text-sm font-semibold">{{ lastSaleDate ?? '—' }}</p>
                </div>
                <div class="md:col-span-2 text-right md:pr-4">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Last Sale Price</p>
                    <p class="text-base font-black text-primary md:text-lg">{{ lastSalePrice ?? '—' }}</p>
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
            <div class="md:col-span-2">
                <h3 class="text-base font-bold text-on-surface leading-tight">{{ property.address }}</h3>
                <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
            </div>
            <div class="md:col-span-1 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bed</p>
                <div class="flex items-center justify-center gap-1">
                    <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }}</p>
                    <ComparisonIndicator :comparison="bedroomComparison" />
                </div>
            </div>
            <div class="md:col-span-1 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bath</p>
                <div class="flex items-center justify-center gap-1">
                    <p class="text-sm font-semibold">{{ property.bathrooms ?? '—' }}</p>
                    <ComparisonIndicator :comparison="bathroomComparison" />
                </div>
            </div>
            <div class="md:col-span-1 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Square Ft</p>
                <div class="flex items-center justify-center gap-1">
                    <p class="text-sm font-semibold">{{ property.square_feet ?? '—' }}</p>
                    <ComparisonIndicator :comparison="sqftComparison" />
                </div>
            </div>
            <div class="md:col-span-1 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Acreage</p>
                <div class="flex items-center justify-center gap-1">
                    <p class="text-sm font-semibold">{{ property.acreage ?? '—' }}</p>
                    <ComparisonIndicator :comparison="acreageComparison" />
                </div>
            </div>
            <div class="md:col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Neighbor</p>
                <p class="text-sm font-semibold">{{ neighborLabel }}</p>
            </div>
            <div class="md:col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Last Sold</p>
                <p class="text-sm font-semibold">{{ lastSaleDate ?? '—' }}</p>
            </div>
            <div class="md:col-span-2 text-right md:pr-4">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Last Sale Price</p>
                <p class="text-base font-black text-on-surface md:text-lg">{{ lastSalePrice ?? '—' }}</p>
            </div>
        </div>
    </router-link>
</template>
