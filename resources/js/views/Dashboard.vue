<template>
    <main class="min-h-screen bg-surface">
        <div class="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
            <header class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div class="min-w-0">
                    <router-link v-if="neighborhoodId" to="/neighborhoods" class="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary">
                        <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span> Neighborhoods
                    </router-link>
                    <p class="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Neighborhood overview</p>
                    <h1 class="truncate text-3xl font-extrabold tracking-[-0.035em] text-on-surface sm:text-4xl lg:text-[44px]">{{ dashboardTitle }}</h1>
                    <p class="mt-2 max-w-2xl text-base text-on-surface-variant">Homes, market movement, and the latest activity in one place.</p>
                </div>
                <div v-if="neighborhoodId" class="flex flex-wrap gap-2.5">
                    <button type="button" class="secondary-action" @click="showDistanceCheck = true"><span class="material-symbols-outlined text-base" aria-hidden="true">straighten</span>Distance check</button>
                    <router-link :to="propertyListRoute" class="secondary-action"><span class="material-symbols-outlined text-base" aria-hidden="true">format_list_bulleted</span>List view</router-link>
                    <router-link :to="`${propertyListRoute}/create`" class="primary-action"><span class="material-symbols-outlined text-base" aria-hidden="true">add</span>Add property</router-link>
                </div>
            </header>

            <DistanceCheckModal v-if="showDistanceCheck" @close="showDistanceCheck = false" />

            <section class="relative z-20 mt-8" aria-label="Property search">
                <form class="dashboard-search" role="search" @submit.prevent="submitSearch" @focusin="searchFocused = true" @focusout="closeSearchResults">
                    <span class="material-symbols-outlined text-on-surface-variant" aria-hidden="true">search</span>
                    <label for="dashboard-property-search" class="sr-only">Search neighborhood properties</label>
                    <input id="dashboard-property-search" v-model="searchQuery" type="search" autocomplete="street-address" :placeholder="neighborhoodId ? 'Search this neighborhood by address' : 'Search mapped homes by address'" @keydown.escape="searchFocused = false">
                    <button v-if="searchQuery" type="button" class="search-clear" aria-label="Clear search" @click="searchQuery = ''"><span class="material-symbols-outlined text-lg" aria-hidden="true">close</span></button>
                    <button type="submit" class="search-submit">Search</button>
                </form>
                <div v-if="showSearchResults" class="search-results">
                    <router-link v-for="property in matchingProperties" :key="property.id" :to="propertyRoute(property)" class="search-result">
                        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-container/60 text-primary"><span class="material-symbols-outlined text-lg" aria-hidden="true">home</span></span>
                        <span class="min-w-0 flex-1"><strong class="block truncate text-sm text-on-surface">{{ property.address }}</strong><span class="block truncate text-xs text-on-surface-variant">{{ property.city }}, {{ property.state }} {{ property.zip_code }}</span></span>
                        <span class="material-symbols-outlined text-lg text-outline" aria-hidden="true">arrow_forward</span>
                    </router-link>
                    <div v-if="matchingProperties.length === 0" class="px-4 py-5 text-center text-sm text-on-surface-variant">No mapped property matches “{{ searchQuery.trim() }}”.</div>
                    <button v-if="neighborhoodId" type="button" class="search-all" @mousedown.prevent="submitSearch">Search the full property list <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></button>
                </div>
            </section>

            <div v-if="loading" class="grid min-h-[460px] place-items-center" aria-label="Loading dashboard" aria-busy="true"><div class="h-9 w-9 animate-spin rounded-full border-4 border-primary-container border-t-primary"></div></div>
            <div v-else-if="errorMessage" class="mt-8 rounded-xl border border-error/20 bg-error/5 px-6 py-12 text-center" role="alert">
                <span class="material-symbols-outlined mb-3 text-4xl text-error" aria-hidden="true">error</span>
                <h2 class="text-lg font-bold text-on-surface">We couldn’t load this dashboard</h2><p class="mt-1 text-sm text-on-surface-variant">{{ errorMessage }}</p>
                <button type="button" class="primary-action mt-5" @click="loadStats">Try again</button>
            </div>

            <template v-else>
                <section class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" aria-label="Neighborhood statistics">
                    <article class="stat-card"><div class="stat-icon"><span class="material-symbols-outlined" aria-hidden="true">home_work</span></div><div><p class="stat-label">Homes tracked</p><p class="stat-value">{{ formatNumber(stats.total_properties) }}</p><p class="stat-note">{{ formatNumber(stats.properties_with_location) }} shown on the map</p></div></article>
                    <article class="stat-card"><div class="stat-icon"><span class="material-symbols-outlined" aria-hidden="true">payments</span></div><div><p class="stat-label">Average sale</p><p class="stat-value">{{ formatCompactPrice(averageSalePrice) }}</p><p class="stat-note">Last 12 months</p></div></article>
                    <article class="stat-card"><div class="stat-icon"><span class="material-symbols-outlined" aria-hidden="true">schedule</span></div><div><p class="stat-label">Market time</p><p class="stat-value">{{ averageDaysOnMarket === null ? '—' : `${Math.round(averageDaysOnMarket)} days` }}</p><p class="stat-note">Average sold listing</p></div></article>
                    <article class="stat-card"><div class="stat-icon"><span class="material-symbols-outlined" aria-hidden="true">contract</span></div><div><p class="stat-label">Sales</p><p class="stat-value">{{ formatNumber(recentSalesCount) }}</p><p class="stat-note">Closed in 12 months</p></div></article>
                </section>

                <section class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12" aria-label="Neighborhood map and market pulse">
                    <article class="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm lg:col-span-8">
                        <div class="flex flex-wrap items-start justify-between gap-4 px-5 py-5 sm:px-6">
                            <div><p class="section-eyebrow">Location intelligence</p><h2 class="mt-1 text-xl font-bold tracking-tight text-on-surface">Homes in the neighborhood</h2></div>
                            <div class="flex items-center gap-4 text-xs font-semibold text-on-surface-variant"><span class="inline-flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-primary"></i> Property</span><span class="inline-flex items-center gap-1.5"><i class="h-2.5 w-2.5 rounded-full bg-tertiary"></i> Target</span></div>
                        </div>
                        <div class="relative min-h-[410px] bg-surface-container-low sm:min-h-[500px]">
                            <div v-show="mappedProperties.length > 0" ref="mapContainer" class="absolute inset-0 z-0" aria-label="Map of neighborhood homes"></div>
                            <div v-if="mappedProperties.length === 0" class="absolute inset-0 grid place-items-center p-8 text-center"><div class="max-w-sm"><span class="material-symbols-outlined mb-3 text-5xl text-outline-variant" aria-hidden="true">map</span><h3 class="font-bold text-on-surface">No mapped homes yet</h3><p class="mt-1 text-sm leading-6 text-on-surface-variant">Properties will appear here once their locations are available.</p><router-link v-if="neighborhoodId" :to="`${propertyListRoute}/create`" class="primary-action mt-5">Add the first property</router-link></div></div>
                            <div v-if="mappedProperties.length" class="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-lg bg-surface-container-lowest/95 px-3 py-2 text-xs font-semibold text-on-surface-variant shadow-lg backdrop-blur">{{ mapSummary }}</div>
                        </div>
                    </article>

                    <aside class="flex min-w-0 flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm sm:p-6 lg:col-span-4">
                        <div class="flex items-start justify-between gap-3"><div><p class="section-eyebrow">Market pulse</p><h2 class="mt-1 text-xl font-bold tracking-tight text-on-surface">Sale price trend</h2></div><span class="rounded-full bg-primary-container/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-primary-container">12 months</span></div>
                        <div v-if="hasSalePriceData" class="mt-4 min-h-[220px] flex-1"><VueApexCharts type="area" height="230" :options="salePriceChartOptions" :series="salePriceSeries" /></div>
                        <div v-else class="grid min-h-[220px] flex-1 place-items-center text-center text-sm text-on-surface-variant">Sale prices will chart here after a home closes.</div>
                        <div class="mt-4 border-t border-surface-container-high pt-5"><div class="flex items-end justify-between gap-3"><div><p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Analysis coverage</p><p class="mt-1 text-2xl font-extrabold text-on-surface">{{ analysisCoverage }}%</p></div><p class="text-right text-xs leading-5 text-on-surface-variant">{{ formatNumber(stats.analyzed_properties) }} of {{ formatNumber(stats.total_properties) }} homes</p></div><div class="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high"><div class="h-full rounded-full bg-primary transition-[width] duration-500" :style="{ width: `${analysisCoverage}%` }"></div></div></div>
                    </aside>
                </section>

                <section class="mt-4 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm" aria-labelledby="recent-transactions-heading">
                    <div class="flex items-center justify-between gap-4 border-b border-surface-container-high px-5 py-5 sm:px-6"><div><p class="section-eyebrow">Latest movement</p><h2 id="recent-transactions-heading" class="mt-1 text-xl font-bold tracking-tight text-on-surface">Recent transactions</h2></div><router-link v-if="neighborhoodId" :to="propertyListRoute" class="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">View all homes <span class="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span></router-link></div>
                    <div v-if="recentTransactions.length === 0" class="px-6 py-14 text-center"><span class="material-symbols-outlined mb-3 text-4xl text-outline-variant" aria-hidden="true">receipt_long</span><p class="font-bold text-on-surface">No market activity yet</p><p class="mt-1 text-sm text-on-surface-variant">Listings, price changes, and sales will appear here.</p></div>
                    <div v-else>
                        <div class="hidden grid-cols-[minmax(0,1fr)_150px_160px_44px] gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant md:grid"><span>Property</span><span>Activity</span><span class="text-right">Price</span><span></span></div>
                        <router-link v-for="transaction in recentTransactions" :key="transaction.id" :to="transactionRoute(transaction)" class="transaction-row group">
                            <div class="flex min-w-0 items-center gap-3.5"><span class="transaction-icon" :class="{ 'is-sale': transaction.type === 'sold' }"><span class="material-symbols-outlined text-lg" aria-hidden="true">{{ transactionIcon(transaction.type) }}</span></span><span class="min-w-0"><strong class="block truncate text-sm text-on-surface sm:text-base">{{ transaction.property.address }}</strong><span class="block truncate text-xs text-on-surface-variant">{{ transaction.property.city }}, {{ transaction.property.state }} {{ transaction.property.zip_code }}</span></span></div>
                            <div><span class="activity-pill" :class="{ 'is-sale': transaction.type === 'sold' }">{{ transactionLabel(transaction.type) }}</span><span class="mt-1 block text-xs text-on-surface-variant">{{ formatDate(transaction.price_date) }}</span></div>
                            <strong class="text-left text-base text-on-surface md:text-right">{{ formatPrice(transaction.price) }}</strong><span class="material-symbols-outlined hidden text-outline transition-transform group-hover:translate-x-1 md:block" aria-hidden="true">chevron_right</span>
                        </router-link>
                    </div>
                </section>
            </template>
        </div>
    </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import VueApexCharts from 'vue3-apexcharts';
import api from '@/api';
import DistanceCheckModal from '@/components/DistanceCheckModal.vue';

const route = useRoute();
const router = useRouter();
const neighborhoodId = computed(() => route.params.neighborhoodId);
const propertyListRoute = computed(() => `/neighborhoods/${neighborhoodId.value}/properties`);
const loading = ref(true);
const errorMessage = ref('');
const showDistanceCheck = ref(false);
const searchQuery = ref('');
const searchFocused = ref(false);
const mapContainer = ref(null);
const stats = ref(emptyStats());
const dashboardTitle = computed(() => neighborhoodId.value ? stats.value.neighborhood_name || 'Neighborhood' : 'Portfolio overview');
let map = null;
let markerLayer = null;
let searchCloseTimer = null;
const markers = new Map();

const analytics = computed(() => stats.value.analytics || emptyStats().analytics);
const mappedProperties = computed(() => stats.value.map_properties || []);
const recentTransactions = computed(() => stats.value.recent_transactions || []);
const recentSalesCount = computed(() => analytics.value.monthly_sold_counts.reduce((total, month) => total + (Number(month.count) || 0), 0));
const averageSalePrice = computed(() => weightedAverage(analytics.value.monthly_avg_sale_prices, 'avg_price'));
const averageDaysOnMarket = computed(() => weightedAverage(analytics.value.monthly_days_on_market, 'avg_days'));
const analysisCoverage = computed(() => stats.value.total_properties ? Math.round((stats.value.analyzed_properties / stats.value.total_properties) * 100) : 0);
const hasSalePriceData = computed(() => analytics.value.monthly_avg_sale_prices.some(month => toNumber(month.avg_price) !== null));
const salePriceSeries = computed(() => [{ name: 'Average sale price', data: analytics.value.monthly_avg_sale_prices.map(month => toNumber(month.avg_price)) }]);
const salePriceChartOptions = computed(() => ({
    chart: { toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'inherit', foreColor: '#586064' },
    colors: ['#455f88'], dataLabels: { enabled: false }, stroke: { curve: 'smooth', width: 3 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 0, opacityFrom: 0.3, opacityTo: 0.02, stops: [0, 100] } },
    grid: { borderColor: '#e3e9ec', strokeDashArray: 4, padding: { left: 4, right: 8 } },
    xaxis: { categories: analytics.value.monthly_avg_sale_prices.map(month => month.month), axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontSize: '10px', fontWeight: 700 } } },
    yaxis: { labels: { formatter: value => formatCompactPrice(value), style: { fontSize: '10px' } } }, tooltip: { y: { formatter: value => formatPrice(value) } },
    markers: { size: 3, strokeWidth: 2, strokeColors: '#ffffff', hover: { size: 5 } },
}));
const matchingProperties = computed(() => {
    const query = normalizeSearch(searchQuery.value);
    if (!query) return [];
    return mappedProperties.value.filter(property => normalizeSearch([property.address, property.city, property.state, property.zip_code].join(' ')).includes(query)).slice(0, 6);
});
const showSearchResults = computed(() => searchFocused.value && searchQuery.value.trim().length > 0);
const mapSummary = computed(() => {
    const mapped = mappedProperties.value.length;
    const total = Number(stats.value.total_properties) || 0;
    return mapped === total ? `${formatNumber(mapped)} ${mapped === 1 ? 'home' : 'homes'} mapped` : `${formatNumber(mapped)} of ${formatNumber(total)} homes mapped`;
});

function emptyStats() {
    return { neighborhood_name: null, total_properties: 0, analyzed_properties: 0, properties_with_location: 0, map_properties: [], recent_transactions: [], analytics: { monthly_avg_sale_prices: [], monthly_days_on_market: [], monthly_sold_counts: [] } };
}
function weightedAverage(items, valueKey) {
    const totals = items.reduce((result, item) => {
        const value = toNumber(item[valueKey]);
        const weight = Number(item.sample_size) || 0;
        if (value !== null && weight > 0) { result.sum += value * weight; result.weight += weight; }
        return result;
    }, { sum: 0, weight: 0 });
    return totals.weight > 0 ? totals.sum / totals.weight : null;
}
function toNumber(value) { if (value === null || value === undefined || value === '') return null; const number = Number(value); return Number.isFinite(number) ? number : null; }
function normalizeSearch(value) { return String(value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US'); }
function propertyRoute(property) { return `/neighborhoods/${property.neighborhood_id || neighborhoodId.value}/properties/${property.id}`; }
function transactionRoute(transaction) { return propertyRoute(transaction.property); }
function submitSearch() {
    const query = searchQuery.value.trim();
    if (!query) return;
    searchFocused.value = false;
    if (neighborhoodId.value) { router.push({ path: propertyListRoute.value, query: { search: query } }); return; }
    if (matchingProperties.value.length > 0) router.push(propertyRoute(matchingProperties.value[0]));
}
function closeSearchResults() { window.clearTimeout(searchCloseTimer); searchCloseTimer = window.setTimeout(() => { searchFocused.value = false; }, 120); }
function transactionLabel(type) { return { sold: 'Sold', listing: 'Listed', reduction: 'Price reduced', increase: 'Price increased', off_market: 'Off market' }[type] || 'Activity'; }
function transactionIcon(type) { return { sold: 'real_estate_agent', listing: 'sell', reduction: 'trending_down', increase: 'trending_up', off_market: 'visibility_off' }[type] || 'receipt_long'; }
function formatPrice(value) { const price = toNumber(value); return price === null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price); }
function formatCompactPrice(value) { const price = toNumber(value); return price === null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(price); }
function formatNumber(value) { return new Intl.NumberFormat('en-US').format(Number(value) || 0); }
function formatDate(value) { return value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : 'Date unavailable'; }
function createMarkerContent(property) {
    const content = document.createElement('div'); const address = document.createElement('strong'); const location = document.createElement('span');
    content.className = 'dashboard-map-tooltip'; address.textContent = property.address; location.textContent = `${property.city}, ${property.state} ${property.zip_code}`; content.append(address, location); return content;
}
function renderMap() {
    if (!mapContainer.value || mappedProperties.value.length === 0) { destroyMap(); return; }
    if (!map) {
        map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    }
    if (markerLayer) markerLayer.clearLayers(); else markerLayer = L.layerGroup().addTo(map);
    markers.clear(); const bounds = [];
    mappedProperties.value.forEach(property => {
        const latitude = Number(property.latitude); const longitude = Number(property.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        const marker = L.circleMarker([latitude, longitude], markerStyle(property));
        marker.bindTooltip(createMarkerContent(property), { direction: 'top', offset: [0, -8], opacity: 1 });
        marker.on('click', () => router.push(propertyRoute(property))); marker.addTo(markerLayer); markers.set(property.id, marker); bounds.push([latitude, longitude]);
    });
    if (bounds.length === 1) map.setView(bounds[0], 16); else if (bounds.length > 1) map.fitBounds(bounds, { padding: [38, 38], maxZoom: 16 });
    window.setTimeout(() => map?.invalidateSize(), 0); highlightSearch();
}
function markerStyle(property, isMatch = true) { const color = property.is_pinned ? '#655e52' : '#455f88'; return { radius: isMatch ? (property.is_pinned ? 10 : 8) : 6, color: '#ffffff', weight: 2.5, fillColor: color, fillOpacity: isMatch ? 0.95 : 0.22, opacity: isMatch ? 1 : 0.35 }; }
function highlightSearch() {
    const query = normalizeSearch(searchQuery.value);
    mappedProperties.value.forEach(property => { const haystack = normalizeSearch([property.address, property.city, property.state, property.zip_code].join(' ')); markers.get(property.id)?.setStyle(markerStyle(property, !query || haystack.includes(query))); });
}
function destroyMap() { if (map) { map.remove(); map = null; markerLayer = null; markers.clear(); } }
async function loadStats() {
    loading.value = true; errorMessage.value = ''; destroyMap();
    try {
        const url = neighborhoodId.value ? `/neighborhoods/${neighborhoodId.value}/stats` : '/dashboard/stats';
        const response = await api.get(url); stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to load dashboard stats', error); errorMessage.value = error.response?.data?.message || 'Please try again in a moment.';
    } finally {
        loading.value = false; await nextTick(); if (mappedProperties.value.length > 0) renderMap();
    }
}

onMounted(loadStats);
onUnmounted(() => { destroyMap(); window.clearTimeout(searchCloseTimer); });
watch(neighborhoodId, () => { searchQuery.value = ''; loadStats(); });
watch(searchQuery, highlightSearch);
</script>

<style scoped>
.primary-action,.secondary-action{display:inline-flex;min-height:44px;align-items:center;justify-content:center;gap:8px;border-radius:6px;padding:0 16px;font-size:14px;font-weight:700;text-decoration:none;white-space:nowrap}.primary-action{background:linear-gradient(145deg,var(--color-primary),var(--color-primary-dim));color:var(--color-on-primary);box-shadow:0 8px 20px color-mix(in srgb,var(--color-primary) 18%,transparent)}.primary-action:hover,.primary-action:focus-visible{opacity:.92}.secondary-action{background:var(--color-surface-container-high);color:var(--color-on-surface)}.secondary-action:hover,.secondary-action:focus-visible{background:var(--color-surface-container-highest)}
.dashboard-search{display:flex;min-height:58px;align-items:center;gap:12px;border:1px solid color-mix(in srgb,var(--color-outline-variant) 48%,transparent);border-radius:10px;background:var(--color-surface-container-lowest);padding:6px 6px 6px 18px;box-shadow:0 8px 30px rgba(43,52,55,.06)}.dashboard-search:focus-within{border-color:var(--color-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--color-primary) 13%,transparent),0 10px 30px rgba(43,52,55,.07)}.dashboard-search input{min-width:0;flex:1;border:0;background:transparent;color:var(--color-on-surface);font-size:15px;outline:none}.dashboard-search input::placeholder{color:var(--color-outline)}.search-clear{display:grid;height:40px;width:40px;flex:none;place-items:center;border-radius:6px;color:var(--color-on-surface-variant)}.search-clear:hover{background:var(--color-surface-container-low)}.search-submit{min-height:44px;border-radius:6px;background:var(--color-primary);padding:0 20px;color:var(--color-on-primary);font-size:14px;font-weight:700}.search-results{position:absolute;top:calc(100% + 8px);right:0;left:0;overflow:hidden;border:1px solid color-mix(in srgb,var(--color-outline-variant) 35%,transparent);border-radius:10px;background:var(--color-surface-container-lowest);box-shadow:0 18px 50px rgba(43,52,55,.14)}.search-result{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--color-surface-container-high);padding:11px 14px}.search-result:hover,.search-result:focus-visible{background:var(--color-surface-container-low)}.search-all{display:flex;width:100%;align-items:center;justify-content:center;gap:6px;padding:13px;color:var(--color-primary);font-size:13px;font-weight:800}
.stat-card{display:flex;min-width:0;align-items:flex-start;gap:14px;border:1px solid color-mix(in srgb,var(--color-outline-variant) 22%,transparent);border-radius:10px;background:var(--color-surface-container-lowest);padding:18px;box-shadow:0 2px 10px rgba(43,52,55,.035)}.stat-icon{display:grid;height:40px;width:40px;flex:none;place-items:center;border-radius:9px;background:color-mix(in srgb,var(--color-primary-container) 62%,white);color:var(--color-primary)}.stat-label,.section-eyebrow{color:var(--color-on-surface-variant);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.stat-value{margin-top:4px;color:var(--color-on-surface);font-size:clamp(20px,2vw,27px);font-weight:800;letter-spacing:-.025em;line-height:1.15}.stat-note{margin-top:5px;color:var(--color-on-surface-variant);font-size:11px;line-height:1.35}
.transaction-row{display:grid;grid-template-columns:minmax(0,1fr) 150px 160px 44px;align-items:center;gap:16px;border-top:1px solid var(--color-surface-container-high);padding:15px 24px;transition:background-color .15s ease}.transaction-row:hover,.transaction-row:focus-visible{background:var(--color-surface-container-low)}.transaction-icon{display:grid;height:42px;width:42px;flex:none;place-items:center;border-radius:50%;background:var(--color-surface-container-high);color:var(--color-on-surface-variant)}.transaction-icon.is-sale{background:color-mix(in srgb,var(--color-primary-container) 66%,white);color:var(--color-primary)}.activity-pill{display:inline-flex;border-radius:999px;background:var(--color-surface-container-high);padding:4px 9px;color:var(--color-on-surface-variant);font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}.activity-pill.is-sale{background:var(--color-primary-container);color:var(--color-on-primary-container)}
:deep(.leaflet-container){background:var(--color-surface-container-low);font-family:inherit}:deep(.leaflet-control-zoom){overflow:hidden;border:0;border-radius:8px;box-shadow:0 4px 16px rgba(43,52,55,.13)}:deep(.leaflet-control-zoom a){border:0;color:var(--color-primary)}:deep(.leaflet-tooltip){border:0;border-radius:8px;box-shadow:0 8px 24px rgba(43,52,55,.16);color:var(--color-on-surface);padding:10px 12px}:deep(.dashboard-map-tooltip strong),:deep(.dashboard-map-tooltip span){display:block}:deep(.dashboard-map-tooltip strong){font-size:13px}:deep(.dashboard-map-tooltip span){margin-top:2px;color:var(--color-on-surface-variant);font-size:11px}:deep(.leaflet-control-attribution){font-size:9px}
@media(max-width:767px){.search-submit{padding:0 13px}.stat-card{display:block;padding:15px}.stat-icon{margin-bottom:12px}.transaction-row{grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:15px 18px}.transaction-row>:nth-child(2){text-align:right}.transaction-row>:nth-child(3){grid-column:1/-1;padding-left:56px}}
</style>
