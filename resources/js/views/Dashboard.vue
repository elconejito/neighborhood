<template>
    <div class="min-h-screen bg-surface">
        <main class="max-w-screen-2xl mx-auto px-8 py-12">
            <!-- Header -->
            <section class="mb-16 flex items-start justify-between gap-4">
                <div>
                    <router-link
                        v-if="neighborhoodId"
                        to="/neighborhoods"
                        class="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-3"
                    >
                        <span class="material-symbols-outlined text-sm">arrow_back</span> Neighborhoods
                    </router-link>
                    <h1 class="text-5xl font-extrabold text-primary tracking-tight mb-2">
                        {{ neighborhoodId ? (stats.neighborhood_name || 'Neighborhood Dashboard') : 'Dashboard' }}
                    </h1>
                    <p class="text-on-surface-variant text-lg">Performance metrics for the last 12 months.</p>
                </div>
                <div class="flex flex-wrap gap-3 mt-2 shrink-0">
                    <router-link
                        v-if="neighborhoodId"
                        :to="`/neighborhoods/${neighborhoodId}/properties`"
                        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                        <span class="material-symbols-outlined text-base">home_work</span>
                        View Properties
                    </router-link>
                    <button
                        @click="showDistanceCheck = true"
                        class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                    >
                        <span class="material-symbols-outlined text-base">social_distance</span>
                        Distance Check
                    </button>
                </div>
            </section>

            <DistanceCheckModal v-if="showDistanceCheck" @close="showDistanceCheck = false" />

            <!-- Loading -->
            <div v-if="loading" class="text-center py-24">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>

            <template v-else>
                <!-- Market Trends & Analytics -->
                <section>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Average Sale Price -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">show_chart</span>
                                    Average Sale Price
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Last 12 Months</span>
                            </div>

                            <div v-if="hasAvgSalePrices" class="h-60">
                                <VueApexCharts
                                    type="line"
                                    :height="240"
                                    :options="avgPriceChartOptions"
                                    :series="avgPriceSeries"
                                />
                            </div>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sale data yet.</p>
                        </div>

                        <!-- Days on Market by Month -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">show_chart</span>
                                    Days on Market by Month
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Last 12 Months</span>
                            </div>

                            <div v-if="hasDomData" class="h-60">
                                <VueApexCharts
                                    type="line"
                                    :height="240"
                                    :options="domChartOptions"
                                    :series="domSeries"
                                />
                            </div>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sold listing data yet.</p>
                        </div>

                        <!-- Sales Volume -->
                        <div class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex items-center justify-between mb-8">
                                <h3 class="font-bold text-primary flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary/70">bar_chart</span>
                                    Sales Volume
                                </h3>
                                <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Last 12 Months</span>
                            </div>

                            <div v-if="hasSalesData" class="h-60">
                                <VueApexCharts
                                    type="bar"
                                    :height="240"
                                    :options="salesChartOptions"
                                    :series="salesSeries"
                                />
                            </div>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sales data yet.</p>

                            <div v-if="hasSalesData" class="mt-6 flex items-center justify-center text-sm text-primary font-semibold gap-1">
                                <span class="material-symbols-outlined text-sm">{{ salesTrendIcon }}</span>
                                {{ salesTrendLabel }}
                            </div>
                        </div>
                    </div>
                </section>
            </template>
        </main>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import api from '@/api';
import DistanceCheckModal from '@/components/DistanceCheckModal.vue';

const route = useRoute();
const neighborhoodId = computed(() => route.params.neighborhoodId);
const showDistanceCheck = ref(false);

const loading = ref(true);
const stats = ref({
    total_properties: 0,
    analyzed_properties: 0,
    recently_sold: [],
    recently_listed: [],
    analytics: {
        monthly_avg_sale_prices: [],
        monthly_days_on_market: [],
        monthly_sold_counts: [],
    },
});

const analytics = computed(() => stats.value.analytics || {
    monthly_avg_sale_prices: [],
    monthly_days_on_market: [],
    monthly_sold_counts: [],
});

const monthlyAvgSalePrices = computed(() => analytics.value.monthly_avg_sale_prices || []);
const monthlyDom = computed(() => analytics.value.monthly_days_on_market || []);
const monthlySales = computed(() => analytics.value.monthly_sold_counts || []);

const monthLabels = computed(() => {
    const labels = monthlySales.value.map((item) => item.month);

    if (labels.length > 0) {
        return labels;
    }

    return monthlyAvgSalePrices.value.map((item) => item.month);
});

const hasAvgSalePrices = computed(() => monthlyAvgSalePrices.value.some((item) => Number(item.avg_price) > 0));
const hasDomData = computed(() => monthlyDom.value.some((item) => Number(item.avg_days) > 0));
const hasSalesData = computed(() => monthlySales.value.some((item) => Number(item.count) > 0));

const chartBaseOptions = computed(() => ({
    chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: '#6b7280',
        fontFamily: 'inherit',
    },
    dataLabels: { enabled: false },
    grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
    },
    xaxis: {
        categories: monthLabels.value,
        labels: {
            rotate: 0,
            style: {
                colors: '#6b7280',
                fontSize: '10px',
                fontWeight: 700,
            },
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
    },
    yaxis: {
        labels: {
            style: {
                colors: '#6b7280',
                fontSize: '10px',
                fontWeight: 600,
            },
        },
    },
    legend: { show: false },
    tooltip: {
        theme: 'light',
        x: { show: true },
    },
}));

const avgPriceSeries = computed(() => [{
    name: 'Average Sale Price',
    data: monthlyAvgSalePrices.value.map((item) => Number(item.avg_price) || 0),
}]);

const avgPriceChartOptions = computed(() => ({
    ...chartBaseOptions.value,
    stroke: {
        curve: 'smooth',
        width: 3,
    },
    colors: ['#2563eb'],
    markers: {
        size: 4,
        strokeWidth: 2,
        strokeColors: '#ffffff',
        hover: { size: 6 },
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.2,
            opacityTo: 0.04,
            stops: [0, 90, 100],
        },
    },
    yaxis: {
        ...chartBaseOptions.value.yaxis,
        forceNiceScale: true,
        labels: {
            ...chartBaseOptions.value.yaxis.labels,
            formatter: (value) => formatCompactPrice(value),
        },
    },
    tooltip: {
        ...chartBaseOptions.value.tooltip,
        y: {
            formatter: (value) => formatPrice(value),
        },
    },
}));

const domSeries = computed(() => [{
    name: 'Days on Market',
    data: monthlyDom.value.map((item) => Number(item.avg_days) || 0),
}]);

const domChartOptions = computed(() => ({
    ...chartBaseOptions.value,
    stroke: {
        curve: 'smooth',
        width: 3,
    },
    colors: ['#0f766e'],
    markers: {
        size: 4,
        strokeWidth: 2,
        strokeColors: '#ffffff',
        hover: { size: 6 },
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.2,
            opacityTo: 0.04,
            stops: [0, 90, 100],
        },
    },
    yaxis: {
        ...chartBaseOptions.value.yaxis,
        forceNiceScale: true,
        labels: {
            ...chartBaseOptions.value.yaxis.labels,
            formatter: (value) => `${Math.round(value)}`,
        },
    },
    tooltip: {
        ...chartBaseOptions.value.tooltip,
        y: {
            formatter: (value) => `${Math.round(value)} Days`,
        },
    },
}));

const salesSeries = computed(() => [{
    name: 'Sales',
    data: monthlySales.value.map((item) => Number(item.count) || 0),
}]);

const salesChartOptions = computed(() => ({
    ...chartBaseOptions.value,
    chart: {
        ...chartBaseOptions.value.chart,
        stacked: false,
    },
    colors: ['#1d4ed8'],
    plotOptions: {
        bar: {
            borderRadius: 8,
            borderRadiusApplication: 'end',
            columnWidth: '56%',
            distributed: false,
        },
    },
    yaxis: {
        ...chartBaseOptions.value.yaxis,
        forceNiceScale: true,
        labels: {
            ...chartBaseOptions.value.yaxis.labels,
            formatter: (value) => `${Math.round(value)}`,
        },
    },
    tooltip: {
        ...chartBaseOptions.value.tooltip,
        y: {
            formatter: (value) => `${Math.round(value)} Sales`,
        },
    },
}));

const salesTrendIcon = computed(() => {
    const counts = monthlySales.value.map((item) => Number(item.count) || 0);

    if (counts.length < 2) {
        return 'horizontal_rule';
    }

    const first = counts[0];
    const last = counts[counts.length - 1];

    if (last > first) {
        return 'trending_up';
    }

    if (last < first) {
        return 'trending_down';
    }

    return 'horizontal_rule';
});

const salesTrendLabel = computed(() => {
    const counts = monthlySales.value.map((item) => Number(item.count) || 0);

    if (counts.length < 2) {
        return 'No trend data yet';
    }

    const first = counts[0];
    const last = counts[counts.length - 1];

    if (last > first) {
        return 'Sales volume trending up';
    }

    if (last < first) {
        return 'Sales volume trending down';
    }

    return 'Sales volume stable';
});

function formatPrice(price) {
    if (!price) {
        return '—';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price);
}

function formatCompactPrice(price) {
    if (!price) {
        return '$0';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(price);
}

async function loadStats() {
    loading.value = true;

    try {
        const url = neighborhoodId.value
            ? `/neighborhoods/${neighborhoodId.value}/stats`
            : '/dashboard/stats';
        const response = await api.get(url);
        stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to load dashboard stats', error);
    } finally {
        loading.value = false;
    }
}

onMounted(loadStats);
watch(neighborhoodId, loadStats);
</script>
