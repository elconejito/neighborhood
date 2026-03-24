<script setup>
import { computed } from 'vue';
import { formatRelativeDistance } from '@/helpers';

const props = defineProps({
    property: { type: Object, required: true },
    isPinned: { type: Boolean, default: false },
});

const nearestNeighbor = computed(() => {
    return props.property.analysis?.neighbor_distance?.nearest_houses?.[0];
});

const neighborLabel = computed(() => {
    if (!nearestNeighbor.value) return '—';
    return formatRelativeDistance(nearestNeighbor.value.distance_meters);
});
</script>

<template>
    <!-- Active Holding (Pinned) -->
    <div
        v-if="isPinned"
        class="bg-primary-container/30 border-l-4 border-primary rounded-xl p-4 flex items-center gap-8 relative overflow-hidden"
    >
        <div class="absolute top-3 right-6 flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest">
            <span class="material-symbols-outlined text-base" style="font-variation-settings: 'FILL' 1;">flag</span>
            Active Holding
        </div>
        <router-link :to="`/properties/${property.id}`" class="flex items-center gap-8 flex-grow min-w-0">
            <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-primary-container flex items-center justify-center">
                <span class="material-symbols-outlined text-primary/50 text-2xl">home</span>
            </div>
            <div class="flex-grow grid grid-cols-12 gap-4 items-center">
                <div class="col-span-3">
                    <h3 class="text-base font-bold text-primary leading-tight">{{ property.address }}</h3>
                    <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
                </div>
                <div class="col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bed/Bath</p>
                    <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }} / {{ property.bathrooms ?? '—' }}</p>
                </div>
                <div class="col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Dimensions</p>
                    <p class="text-sm font-semibold">{{ property.square_feet ? `${property.square_feet.toLocaleString()} sqft` : '—' }}</p>
                </div>
                <div class="col-span-2 text-center">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Closest Neighbor</p>
                    <p class="text-sm font-semibold text-primary">{{ neighborLabel }}</p>
                </div>
                <div class="col-span-3 text-right pr-12">
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">HOA</p>
                    <p class="text-lg font-black text-primary">{{ property.hoa ?? '—' }}</p>
                </div>
            </div>
        </router-link>
    </div>

    <!-- Standard Catalog Row -->
    <router-link
        v-else
        :to="`/properties/${property.id}`"
        class="bg-surface-container-lowest border border-transparent hover:border-primary-container rounded-xl p-4 flex items-center gap-8 hover:bg-surface-container-low transition-colors group"
    >
        <div class="w-14 h-14 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            <span class="material-symbols-outlined text-outline-variant">home</span>
        </div>
        <div class="flex-grow grid grid-cols-12 gap-4 items-center">
            <div class="col-span-3">
                <h3 class="text-base font-bold text-on-surface leading-tight">{{ property.address }}</h3>
                <p class="text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
            </div>
            <div class="col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Bed/Bath</p>
                <p class="text-sm font-semibold">{{ property.bedrooms ?? '—' }} / {{ property.bathrooms ?? '—' }}</p>
            </div>
            <div class="col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Dimensions</p>
                <p class="text-sm font-semibold">{{ property.square_feet ? `${property.square_feet.toLocaleString()} sqft` : '—' }}</p>
            </div>
            <div class="col-span-2 text-center">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Neighbor</p>
                <p class="text-sm font-semibold">{{ neighborLabel }}</p>
            </div>
            <div class="col-span-3 text-right pr-4">
                <p class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">HOA</p>
                <p class="text-lg font-black text-on-surface">{{ property.hoa ?? '—' }}</p>
            </div>
        </div>
    </router-link>
</template>
