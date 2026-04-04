<template>
    <div class="min-h-screen bg-surface">
        <main class="max-w-screen-2xl mx-auto px-8 py-12">
            <!-- Header -->
            <section class="mb-16">
                <h1 class="text-5xl font-extrabold text-primary tracking-tight mb-2">Dashboard</h1>
                <p class="text-on-surface-variant text-lg">Performance metrics for the last 6 months.</p>
            </section>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-24">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>

            <template v-else>
                <!-- Market Trends & Analytics -->
                <section>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Average Sale Price Trends -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">show_chart</span>
                                    Average Sale Price Trends
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Last 6 Months</span>
                            </div>

                            <div v-if="hasAvgSalePrices" class="h-60 w-full flex items-end justify-between px-2 gap-2 relative">
                                <!-- Grid lines -->
                                <div class="absolute inset-0 flex flex-col justify-between pt-4 pb-8 pointer-events-none opacity-10">
                                    <div class="w-full border-t border-primary"></div>
                                    <div class="w-full border-t border-primary"></div>
                                    <div class="w-full border-t border-primary"></div>
                                    <div class="w-full border-t border-primary"></div>
                                </div>
                                <div
                                    v-for="item in analytics.monthly_avg_sale_prices"
                                    :key="item.month"
                                    class="flex-1 flex flex-col items-center group"
                                >
                                    <div
                                        class="w-full bg-primary/15 rounded-t-xl mb-4 transition-all group-hover:bg-primary/25 relative"
                                        :style="{ height: `${avgPriceBarHeight(item.avg_price)}%` }"
                                    >
                                        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-primary text-on-primary text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {{ formatPrice(item.avg_price) }}
                                        </div>
                                    </div>
                                    <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">{{ item.month }}</span>
                                </div>
                            </div>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sale data yet.</p>
                        </div>

                        <!-- Days on Market by Neighborhood -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">bar_chart</span>
                                    Days on Market by Neighborhood
                                </h3>
                            </div>

                            <div v-if="analytics.days_on_market_by_neighborhood.length" class="space-y-6 pt-4">
                                <div
                                    v-for="item in analytics.days_on_market_by_neighborhood"
                                    :key="item.name"
                                    class="flex flex-col"
                                >
                                    <div class="flex justify-between text-xs font-semibold mb-2">
                                        <span class="text-primary truncate max-w-[60%]">{{ item.name }}</span>
                                        <span class="text-on-surface-variant shrink-0">{{ item.avg_days }} Days</span>
                                    </div>
                                    <div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                                        <div
                                            class="h-full bg-primary rounded-full transition-all"
                                            :style="{ width: `${domBarWidth(item.avg_days)}%` }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <p v-else class="pt-4 text-sm text-on-surface-variant">No sold listing data yet.</p>
                        </div>

                        <!-- Monthly Sales Trend -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">timeline</span>
                                    Sales Volume Trend
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Last 6 Months</span>
                            </div>

                            <div class="h-52 w-full relative flex items-center">
                                <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                                    <path
                                        v-if="absorptionPath"
                                        :d="absorptionPath"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2.5"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="text-primary"
                                    />
                                    <circle
                                        v-for="(pt, i) in absorptionPoints"
                                        :key="i"
                                        :cx="pt.cx"
                                        :cy="pt.cy"
                                        r="4"
                                        fill="currentColor"
                                        class="text-primary"
                                    />
                                </svg>
                                <div class="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[10px] text-on-surface-variant font-bold uppercase">
                                    <span v-for="item in analytics.monthly_sold_counts" :key="item.month">{{ item.month }}</span>
                                </div>
                            </div>

                            <div class="mt-6 flex items-center justify-center text-sm text-primary font-semibold gap-1">
                                <span class="material-symbols-outlined text-sm">{{ salesTrendIcon }}</span>
                                {{ salesTrendLabel }}
                            </div>
                        </div>

                        <!-- Property Inventory per Neighborhood -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">inventory_2</span>
                                    Property Inventory
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Active Units</span>
                            </div>

                            <div v-if="analytics.inventory_by_neighborhood.length" class="flex justify-around items-end h-52 pt-4 gap-2">
                                <div
                                    v-for="item in analytics.inventory_by_neighborhood"
                                    :key="item.name"
                                    class="flex flex-col items-center gap-3 flex-1"
                                >
                                    <div
                                        class="w-full max-w-16 bg-primary rounded-t-2xl flex items-center justify-center relative"
                                        :style="{ height: `${inventoryBarHeight(item.count)}%` }"
                                    >
                                        <span class="text-on-primary font-bold text-sm">{{ item.count }}</span>
                                    </div>
                                    <span class="text-[9px] font-bold text-on-surface-variant text-center uppercase tracking-tight leading-tight">{{ item.name }}</span>
                                </div>
                            </div>
                            <p v-else class="h-52 flex items-center justify-center text-sm text-on-surface-variant">No neighborhood data yet.</p>
                        </div>
                    </div>
                </section>
            </template>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api';

const loading = ref(true);
const stats = ref({
    total_properties: 0,
    analyzed_properties: 0,
    recently_sold: [],
    recently_listed: [],
    analytics: {
        monthly_avg_sale_prices: [],
        days_on_market_by_neighborhood: [],
        monthly_sold_counts: [],
        inventory_by_neighborhood: [],
    },
});

const analytics = computed(() => stats.value.analytics);

// ── Chart helpers ─────────────────────────────────────────────────────────────

const maxAvgPrice = computed(() =>
    Math.max(...analytics.value.monthly_avg_sale_prices.map((m) => m.avg_price), 1),
);

const hasAvgSalePrices = computed(() =>
    analytics.value.monthly_avg_sale_prices.some((m) => m.avg_price > 0),
);

function avgPriceBarHeight(price) {
    return Math.max((price / maxAvgPrice.value) * 100, 4);
}

const maxDom = computed(() =>
    Math.max(...analytics.value.days_on_market_by_neighborhood.map((n) => n.avg_days), 1),
);

function domBarWidth(days) {
    return Math.max((days / maxDom.value) * 100, 4);
}

const maxInventory = computed(() =>
    Math.max(...analytics.value.inventory_by_neighborhood.map((n) => n.count), 1),
);

function inventoryBarHeight(count) {
    return Math.max((count / maxInventory.value) * 85, 8); // cap at 85% to leave label room
}

// SVG path for monthly sales trend
const absorptionPoints = computed(() => {
    const data = analytics.value.monthly_sold_counts;
    if (!data.length) return [];
    const max = Math.max(...data.map((m) => m.count), 1);
    const svgW = 400;
    const svgH = 80;
    return data.map((m, i) => ({
        cx: data.length > 1 ? (i / (data.length - 1)) * svgW : svgW / 2,
        cy: svgH - (m.count / max) * svgH + 10,
    }));
});

const absorptionPath = computed(() => {
    if (!absorptionPoints.value.length) return '';
    return absorptionPoints.value
        .map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.cx},${pt.cy}`)
        .join(' ');
});

const salesTrendIcon = computed(() => {
    const counts = analytics.value.monthly_sold_counts.map((m) => m.count);
    if (counts.length < 2) return 'horizontal_rule';
    const first = counts[0];
    const last = counts[counts.length - 1];
    if (last > first) return 'trending_up';
    if (last < first) return 'trending_down';
    return 'horizontal_rule';
});

const salesTrendLabel = computed(() => {
    const counts = analytics.value.monthly_sold_counts.map((m) => m.count);
    if (counts.length < 2) return 'No trend data yet';
    const first = counts[0];
    const last = counts[counts.length - 1];
    if (last > first) return 'Sales volume trending up';
    if (last < first) return 'Sales volume trending down';
    return 'Sales volume stable';
});

// ── Formatting ────────────────────────────────────────────────────────────────

function formatPrice(price) {
    if (!price) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

// ── Data fetching ─────────────────────────────────────────────────────────────

onMounted(async () => {
    try {
        const response = await api.get('/dashboard/stats');
        stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to load dashboard stats', error);
    } finally {
        loading.value = false;
    }
});
</script>
