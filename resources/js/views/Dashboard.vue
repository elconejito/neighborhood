<template>
    <div class="min-h-screen bg-surface">
        <main class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <!-- Header -->
            <section class="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                    <router-link
                        v-if="neighborhoodId"
                        to="/neighborhoods"
                        class="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-3"
                    >
                        <span class="material-symbols-outlined text-sm">arrow_back</span> Neighborhoods
                    </router-link>
                    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight mb-2">
                        {{ neighborhoodId ? (stats.neighborhood_name || 'Neighborhood Dashboard') : 'Dashboard' }}
                    </h1>
                    <p class="text-on-surface-variant text-lg">Performance metrics for the last 12 months.</p>
                </div>
                <div class="w-full lg:w-auto flex flex-col sm:flex-row gap-3 lg:mt-2 shrink-0">
                    <router-link
                        v-if="neighborhoodId"
                        :to="`/neighborhoods/${neighborhoodId}/properties`"
                        class="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high transition-colors"
                    >
                        <span class="material-symbols-outlined text-base">home_work</span>
                        View Properties
                    </router-link>
                    <button
                        @click="showDistanceCheck = true"
                        class="w-full sm:w-auto justify-center flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors"
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
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <!-- Average Sale Price -->
                        <div class="min-w-0 bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
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
                            <p v-if="hasAvgSalePrices" class="mt-4 text-xs text-on-surface-variant">
                                {{ avgPriceSampleContext }}
                            </p>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sale data yet.</p>
                        </div>

                        <!-- Days on Market by Month -->
                        <div class="min-w-0 bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
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
                            <p v-if="hasDomData" class="mt-4 text-xs text-on-surface-variant">
                                {{ domSampleContext }}
                            </p>
                            <p v-else class="h-60 flex items-center justify-center text-sm text-on-surface-variant">No sold listing data yet.</p>
                        </div>

                        <!-- Sales Volume -->
                        <div class="min-w-0 bg-surface-container-lowest p-4 sm:p-6 lg:p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
                            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8">
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

const hasAvgSalePrices = computed(() => monthlyAvgSalePrices.value.some((item) => toNullableNumber(item.avg_price) !== null));
const hasDomData = computed(() => monthlyDom.value.some((item) => toNullableNumber(item.avg_days) !== null));
const hasSalesData = computed(() => monthlySales.value.some((item) => Number(item.count) > 0));

const avgPriceSampleContext = computed(() => formatSampleContext(
    monthlyAvgSalePrices.value,
    'sale',
));

const domSampleContext = computed(() => formatSampleContext(
    monthlyDom.value,
    'closed listing',
));

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
        type: 'numeric',
        min: 0,
        max: Math.max(monthLabels.value.length - 1, 0),
        tickAmount: Math.max(monthLabels.value.length - 1, 1),
        labels: {
            rotate: 0,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            formatter: (value) => formatMonthAxisLabel(value),
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
    responsive: [{
        breakpoint: 640,
        options: {
            xaxis: {
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                    offsetY: 4,
                    formatter: (value) => formatMonthAxisLabel(value),
                    style: {
                        fontSize: '9px',
                    },
                },
            },
        },
    }],
    tooltip: {
        theme: 'light',
        x: {
            show: true,
            formatter: (value) => formatMonthAxisLabel(value),
        },
    },
}));

const avgPriceSeries = computed(() => [{
    name: 'Average Sale Price',
    data: toObservedPoints(monthlyAvgSalePrices.value, 'avg_price'),
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
        type: 'solid',
        opacity: 0.88,
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
    data: toObservedPoints(monthlyDom.value, 'avg_days'),
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
        type: 'solid',
        opacity: 0.88,
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
            formatter: (value) => formatDays(value),
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

const salesTrend = computed(() => {
    const months = monthlySales.value;
    const completeMonths = months.slice(0, -1);
    const latestThree = completeMonths.slice(-3);
    const priorThree = completeMonths.slice(-6, -3);
    const latestThreeCount = sumSales(latestThree);
    const priorThreeCount = sumSales(priorThree);
    const totalSales = sumSales(months);

    if (completeMonths.length < 6 || latestThreeCount + priorThreeCount < 3) {
        return {
            icon: 'horizontal_rule',
            label: formatSalesSummary(totalSales),
        };
    }

    if (latestThreeCount > priorThreeCount) {
        return {
            icon: 'trending_up',
            label: `More sales: ${latestThreeCount} in the latest 3 complete months vs ${priorThreeCount} in the prior 3`,
        };
    }

    if (latestThreeCount < priorThreeCount) {
        return {
            icon: 'trending_down',
            label: `Fewer sales: ${latestThreeCount} in the latest 3 complete months vs ${priorThreeCount} in the prior 3`,
        };
    }

    return {
        icon: 'horizontal_rule',
        label: `Same sales: ${latestThreeCount} in each 3-month period`,
    };
});

const salesTrendIcon = computed(() => salesTrend.value.icon);
const salesTrendLabel = computed(() => salesTrend.value.label);

function toNullableNumber(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) && number >= 0 ? number : null;
}

function toObservedPoints(items, valueKey) {
    return items.reduce((points, item, index) => {
        const value = toNullableNumber(item[valueKey]);

        if (value !== null) {
            points.push({
                x: index,
                y: value,
            });
        }

        return points;
    }, []);
}

function formatMonthAxisLabel(value) {
    const index = Math.round(Number(value));

    return monthLabels.value[index] || '';
}

function formatSampleContext(items, noun) {
    const samples = items.reduce((total, item) => {
        const sampleSize = Number(item.sample_size);

        return total + (Number.isFinite(sampleSize) && sampleSize > 0 ? sampleSize : 0);
    }, 0);
    const observedMonths = items.filter((item) => toNullableNumber(item.avg_price ?? item.avg_days) !== null).length;

    if (samples === 0) {
        return '';
    }

    const sampleLabel = `${samples} ${noun}${samples === 1 ? '' : 's'}`;
    const monthLabel = observedMonths === 1 ? '1 month' : `${observedMonths} months`;

    return `Based on ${sampleLabel} across ${monthLabel}; months without observations have no dots.`;
}

function sumSales(items) {
    return items.reduce((total, item) => total + (Number(item.count) || 0), 0);
}

function formatSalesSummary(totalSales) {
    if (totalSales === 0) {
        return 'No sales in the last 12 months';
    }

    return `${totalSales} sale${totalSales === 1 ? '' : 's'} in the last 12 months`;
}

function formatPrice(price) {
    if (price === null || price === undefined || !Number.isFinite(Number(price))) {
        return '—';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price);
}

function formatCompactPrice(price) {
    if (price === null || price === undefined || !Number.isFinite(Number(price))) {
        return '—';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(price);
}

function formatDays(days) {
    if (days === null || days === undefined || !Number.isFinite(Number(days))) {
        return 'No observations';
    }

    return `${Math.round(days)} Days`;
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
