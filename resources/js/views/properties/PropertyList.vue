<template>
    <main class="property-index min-h-screen bg-surface">
        <div class="property-index__inner">
            <header class="property-index__header">
                <div class="min-w-0">
                    <router-link to="/neighborhoods" class="back-link"><span class="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span> Neighborhoods</router-link>
                    <h1 class="mt-7 text-[26px] md:text-[34px] font-extrabold leading-[1.1] tracking-[-0.025em] text-on-surface">Residential Catalog</h1>
                    <p class="mt-2 text-base md:text-lg text-on-surface-variant">{{ comparableSummary }}</p>
                </div>
                <div class="property-index__actions">
                    <label class="control-label control-label--status">
                        <span>Status</span>
                        <select :value="saleStatus" aria-label="Filter by status" @change="changeSaleStatus($event.target.value)">
                            <option value="all">All properties</option>
                            <option value="sold">Sold</option>
                            <option value="unsold">Unsold</option>
                        </select>
                    </label>
                    <label class="control-label control-label--sort">
                        <span>Sort</span>
                        <select :value="sortKey" aria-label="Sort comparables" @change="changeSort($event.target.value)">
                            <option v-for="option in availableSortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                        </select>
                    </label>
                    <router-link :to="`/neighborhoods/${neighborhoodId}/dashboard`" class="secondary-action"><span class="material-symbols-outlined text-base" aria-hidden="true">bar_chart</span> Dashboard</router-link>
                    <router-link :to="`/neighborhoods/${neighborhoodId}/properties/create`" class="primary-action"><span class="material-symbols-outlined text-base" aria-hidden="true">add</span><span class="hidden sm:inline">Add property</span><span class="sm:hidden">Add</span></router-link>
                </div>
            </header>

            <section v-if="target" class="target-panel" aria-labelledby="target-heading">
                <div class="target-panel__intro">
                    <div class="target-panel__label-row"><span id="target-heading" class="eyebrow">Target property</span><span class="baseline-tag">Baseline for every comparison</span><span v-if="target.matches_current_filter === false" class="target-filter-note">Not in current filter</span></div>
                    <h2 class="target-panel__address">{{ target.address }}</h2>
                    <p class="target-panel__location">{{ target.city }}, {{ target.state }} · {{ targetEvent.label }}<span v-if="targetEvent.date"> · {{ targetEvent.date }}</span></p>
                    <div class="target-panel__mobile-metrics"><strong>{{ formatPrice(target.market_price) ?? '—' }}</strong><span v-if="targetPricePerSquareFoot != null">{{ formatPrice(targetPricePerSquareFoot) }}/sq ft</span><small><span v-if="target.bedrooms != null">{{ target.bedrooms }} bd</span><span v-if="target.bathrooms != null"> · {{ target.bathrooms }} ba</span><span v-if="target.square_feet != null"> · {{ formatNumber(target.square_feet) }} sq ft</span><span v-if="target.acreage != null"> · {{ Number(target.acreage).toFixed(2) }} ac</span><span v-if="targetNeighborFeet != null"> · {{ targetNeighborFeet }} to neighbor</span></small></div>
                </div>
                <div class="target-panel__stats" aria-label="Target property baseline">
                    <div><span>Baseline price</span><strong>{{ formatPrice(target.market_price) ?? '—' }}</strong></div>
                    <div v-if="targetPricePerSquareFoot != null"><span>$/sq ft</span><strong>{{ formatPrice(targetPricePerSquareFoot) }}</strong></div>
                    <div v-if="target.bedrooms != null"><span>Beds</span><strong>{{ target.bedrooms }}</strong></div>
                    <div v-if="target.bathrooms != null"><span>Baths</span><strong>{{ target.bathrooms }}</strong></div>
                    <div v-if="target.square_feet != null"><span>Size</span><strong>{{ formatNumber(target.square_feet) }} sq ft</strong></div>
                    <div v-if="target.acreage != null"><span>Lot</span><strong>{{ Number(target.acreage).toFixed(2) }} ac</strong></div>
                    <div v-if="target.year_built != null"><span>Built</span><strong>{{ target.year_built }}</strong></div>
                    <div v-if="targetNeighborFeet != null"><span>Neighbor</span><strong>{{ targetNeighborFeet }} ft</strong></div>
                </div>
            </section>

            <section v-if="target && isScrolled" class="target-summary-sticky" aria-label="Pinned target summary">
                <div class="target-summary-sticky__address"><span class="eyebrow">Target property</span><strong>{{ target.address }}</strong></div>
                <div class="target-summary-sticky__facts"><span v-if="target.market_price != null">{{ formatPrice(target.market_price) }}</span><span v-if="targetPricePerSquareFoot != null">{{ formatPrice(targetPricePerSquareFoot) }}/sq ft</span><span v-if="target.bedrooms != null">{{ target.bedrooms }} bd</span><span v-if="target.bathrooms != null">{{ target.bathrooms }} ba</span><span v-if="target.square_feet != null">{{ formatNumber(target.square_feet) }} sq ft</span><span v-if="target.acreage != null">{{ Number(target.acreage).toFixed(2) }} ac</span><span v-if="targetNeighborFeet != null">{{ targetNeighborFeet }} ft neighbor</span></div>
            </section>

            <div v-if="loading" class="property-list" aria-busy="true" aria-label="Loading properties">
                <div v-for="index in 5" :key="index" class="skeleton-row"><span></span><span></span><span></span><span></span></div>
            </div>
            <div v-else-if="errorMessage" class="state-card" role="alert"><h2>We couldn't load the comparables</h2><p>{{ errorMessage }}</p><button type="button" class="primary-action mx-auto mt-5" @click="fetchProperties">Try again</button></div>
            <EmptyState v-else-if="properties.length === 0" :title="target ? 'No comparables match this filter' : 'No properties found'" :description="target ? 'Try clearing the status filter to see the rest of this neighborhood.' : 'Get started by adding your first property to track its price history and neighborhood performance.'">
                <template #action>
                    <button v-if="target && saleStatus !== 'all'" type="button" class="secondary-action mx-auto" @click="changeSaleStatus('all')">Clear filter</button>
                    <router-link v-else :to="`/neighborhoods/${neighborhoodId}/properties/create`" class="primary-action mx-auto"><span class="material-symbols-outlined text-base" aria-hidden="true">add</span> Add property</router-link>
                </template>
            </EmptyState>
            <template v-else>
                <div class="comparables-toolbar">
                    <h2 id="comparables-heading" tabindex="-1">Comparables<span class="hidden md:inline"> · {{ sortLabel }}</span></h2>
                    <div class="comparables-toolbar__mobile-controls"><label class="control-label"><span class="sr-only">Status</span><select :value="saleStatus" aria-label="Filter by status" @change="changeSaleStatus($event.target.value)"><option value="all">All properties</option><option value="sold">Sold</option><option value="unsold">Unsold</option></select></label><label class="control-label"><span class="sr-only">Sort</span><select :value="sortKey" aria-label="Sort comparables" @change="changeSort($event.target.value)"><option v-for="option in availableSortOptions" :key="option.value" :value="option.value">{{ option.shortLabel ?? option.label }}</option></select></label></div>
                </div>
                <div class="column-headings" :class="{ 'column-headings--with-neighbor': hasNeighborData }" aria-hidden="true"><span>Property</span><span>Price · vs target</span><span>$/sq ft · vs target</span><span v-if="hasNeighborData">Closest neighbor</span><span>Why it may differ</span></div>
                <div ref="listHeading" class="property-list" aria-labelledby="comparables-heading">
                    <PropertyListItem v-for="property in properties" :key="property.id" :property="property" :target="target" :show-neighbor="hasNeighborData" :neighborhood-id="neighborhoodId" />
                </div>
                <nav v-if="pagination.total > 0" class="pagination-wrap" aria-label="Property list pagination">
                    <div class="pagination-count"><span>Showing {{ showingStart }}–{{ showingEnd }} of {{ pagination.total }} comparables</span><label><span class="sr-only">Properties per page</span><select :value="perPage" @change="changePerPage(Number($event.target.value))"><option value="10">10</option><option value="25">25</option><option value="50">50</option></select></label></div>
                    <div v-if="pagination.total_pages > 1" class="pagination-buttons"><button type="button" :disabled="currentPage === 1" aria-label="Previous page" :aria-disabled="currentPage === 1" @click="goToPage(currentPage - 1)"><span class="material-symbols-outlined text-base" aria-hidden="true">chevron_left</span></button><template v-for="page in pageRange" :key="page"><span v-if="page === '...'" class="pagination-ellipsis">…</span><button v-else type="button" :aria-label="`Page ${page}`" :aria-current="page === currentPage ? 'page' : undefined" :class="{ 'is-current': page === currentPage }" @click="goToPage(page)">{{ page }}</button></template><button type="button" :disabled="currentPage === pagination.total_pages" aria-label="Next page" :aria-disabled="currentPage === pagination.total_pages" @click="goToPage(currentPage + 1)"><span class="material-symbols-outlined text-base" aria-hidden="true">chevron_right</span></button></div>
                </nav>
            </template>
        </div>
    </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';
import PropertyListItem from '@/components/properties/PropertyListItem.vue';

const route = useRoute();
const router = useRouter();
const neighborhoodId = computed(() => route.params.neighborhoodId);
const properties = ref([]);
const target = ref(null);
const loading = ref(true);
const errorMessage = ref('');
const currentPage = ref(1);
const perPage = ref(10);
const sortKey = ref('similarity');
const saleStatus = ref('all');
const isScrolled = ref(false);
const listHeading = ref(null);
const pagination = ref({ total: 0, count: 0, per_page: 10, current_page: 1, total_pages: 1 });

const sortOptions = [
    { value: 'similarity', label: 'Most similar to target', shortLabel: 'Most similar', params: { orderBy: 'similarity' } },
    { value: 'price_gap_desc', label: 'Largest price gap', shortLabel: 'Largest gap', params: { orderBy: 'price_gap', sortedBy: 'desc' } },
    { value: 'price_gap_asc', label: 'Smallest price gap', shortLabel: 'Smallest gap', params: { orderBy: 'price_gap', sortedBy: 'asc' } },
    { value: 'market_price_desc', label: 'Price high → low', shortLabel: 'Price high → low', params: { orderBy: 'market_price', sortedBy: 'desc' } },
    { value: 'market_price_asc', label: 'Price low → high', shortLabel: 'Price low → high', params: { orderBy: 'market_price', sortedBy: 'asc' } },
    { value: 'market_activity_desc', label: 'Newest activity', shortLabel: 'Newest activity', params: { orderBy: 'market_activity_date', sortedBy: 'desc' } },
    { value: 'market_activity_asc', label: 'Oldest activity', shortLabel: 'Oldest activity', params: { orderBy: 'market_activity_date', sortedBy: 'asc' } },
    { value: 'address_asc', label: 'Address A–Z', shortLabel: 'Address A–Z', params: { orderBy: 'address', sortedBy: 'asc' } },
    { value: 'address_desc', label: 'Address Z–A', shortLabel: 'Address Z–A', params: { orderBy: 'address', sortedBy: 'desc' } },
];
const targetOnlySorts = new Set(['similarity', 'price_gap_desc', 'price_gap_asc']);

const hasNeighborData = computed(() => properties.value.some(property => neighborMeters(property) != null));
const availableSortOptions = computed(() => target.value ? sortOptions : sortOptions.filter(option => !['similarity', 'price_gap_desc', 'price_gap_asc'].includes(option.value)));
const sortLabel = computed(() => sortOptions.find(option => option.value === sortKey.value)?.label ?? 'Most similar to target');
const comparableSummary = computed(() => `${pagination.value.total} comparables${target.value?.city ? ` measured against your target · ${target.value.city}, ${target.value.state}` : ''}`);
const pageRange = computed(() => {
    const total = pagination.value.total_pages;
    const current = currentPage.value;
    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', current - 1, current, current + 1, '...', total];
});
const showingStart = computed(() => pagination.value.total === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const showingEnd = computed(() => Math.min(currentPage.value * perPage.value, pagination.value.total));
const targetPricePerSquareFoot = computed(() => target.value?.price_per_square_foot != null ? Number(target.value.price_per_square_foot) : target.value?.market_price && target.value.square_feet ? Number(target.value.market_price) / Number(target.value.square_feet) : null);
const targetNeighborFeet = computed(() => target.value ? formatNeighborFeet(target.value) : null);
const targetEvent = computed(() => marketEvent(target.value));

onMounted(async () => {
    currentPage.value = Number(route.query.page ?? 1);
    perPage.value = Number(route.query.per_page ?? 10);
    if (route.query.sort && sortOptions.some(option => option.value === route.query.sort)) sortKey.value = route.query.sort;
    if (['sold', 'unsold'].includes(route.query.status)) saleStatus.value = route.query.status;
    window.addEventListener('scroll', updateScrollState, { passive: true });
    await fetchProperties();
});
onUnmounted(() => window.removeEventListener('scroll', updateScrollState));

async function fetchProperties() {
    loading.value = true;
    errorMessage.value = '';
    try {
        const params = { page: currentPage.value, per_page: perPage.value, ...(saleStatus.value !== 'all' ? { sale_status: saleStatus.value } : {}), ...selectedSortParams() };
        const response = await api.get(`/neighborhoods/${neighborhoodId.value}/properties`, { params });
        const responseProperties = response.data.data ?? [];
        target.value = response.data.meta?.target ?? responseProperties.find(property => property.is_pinned) ?? null;
        if (!target.value && targetOnlySorts.has(sortKey.value)) {
            sortKey.value = 'market_activity_desc';
            syncToUrl();
            await fetchProperties();
            return;
        }
        properties.value = responseProperties;
        properties.value = properties.value.filter(property => !property.is_pinned && property.id !== target.value?.id);
        pagination.value = response.data.meta?.pagination ?? pagination.value;
    } catch (error) {
        errorMessage.value = error.response?.data?.message ?? 'Please try again in a moment.';
    } finally {
        loading.value = false;
    }
}

function updateScrollState() { isScrolled.value = window.scrollY >= 120 && window.innerWidth >= 768; }
async function goToPage(page) { if (page < 1 || page > pagination.value.total_pages) return; currentPage.value = page; syncToUrl(); await fetchProperties(); await nextTick(); const heading = document.getElementById('comparables-heading'); heading?.focus(); heading?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function changePerPage(value) { perPage.value = value; currentPage.value = 1; syncToUrl(); fetchProperties(); }
function changeSort(value) { sortKey.value = value; currentPage.value = 1; syncToUrl(); fetchProperties(); }
function changeSaleStatus(value) { saleStatus.value = value; currentPage.value = 1; syncToUrl(); fetchProperties(); }
function selectedSortParams() { return sortOptions.find(option => option.value === sortKey.value)?.params ?? {}; }
function syncToUrl() { const query = {}; if (currentPage.value > 1) query.page = currentPage.value; if (perPage.value !== 10) query.per_page = perPage.value; if (sortKey.value !== 'similarity') query.sort = sortKey.value; if (saleStatus.value !== 'all') query.status = saleStatus.value; router.replace({ query }); }

function formatPrice(value) { return value == null ? null : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value); }
function formatNumber(value) { return value == null ? null : Number(value).toLocaleString('en-US'); }
function marketEvent(property) {
    if (!property) return { label: 'Market activity', date: null };
    if (property.price_event_type && property.market_activity_date) {
        return { label: marketEventLabel(property.price_event_type), date: formatDate(property.market_activity_date) };
    }
    if (property.last_sale_price != null || property.last_sale_date) return { label: 'Sold', date: formatDate(property.last_sale_date) };
    if (property.last_listing_price != null || property.last_listing_date) return { label: 'Listed', date: formatDate(property.last_listing_date) };
    return { label: 'Market activity', date: formatDate(property.market_activity_date) };
}
function formatDate(date) { return date ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)) : null; }
function neighborMeters(property) { return property?.closest_neighbor_distance_meters ?? property?.analysis?.neighbor_distance?.nearest_houses?.[0]?.distance_meters ?? null; }
function formatNeighborFeet(property) { const meters = neighborMeters(property); return meters == null ? null : `${Math.round(Number(meters) * 3.28084)} ft`; }
function marketEventLabel(type) {
    const labels = { sold: 'Sold', sale: 'Sold', listing: 'Listed', reduction: 'Price drop', price_drop: 'Price drop', increase: 'Price increase', price_increase: 'Price increase' };
    return labels[type] ?? 'Market activity';
}
</script>

<style scoped>
.property-index__inner { max-width: 1280px; margin: 0 auto; padding: 56px 44px 72px; }
.property-index__header { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; margin-bottom: 34px; }
.back-link { display: inline-flex; align-items: center; gap: 4px; color: var(--color-on-surface-variant); font-size: 14px; font-weight: 600; text-decoration: none; }
.back-link:hover, .back-link:focus-visible { color: var(--color-primary); }
.property-index__actions { display: flex; align-items: flex-end; gap: 12px; }
.control-label { display: flex; min-width: 0; flex-direction: column; gap: 7px; color: var(--color-on-surface-variant); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.control-label select, .pagination-count select { min-height: 44px; border: 0; border-radius: 4px; background-color: var(--color-surface-container-highest); color: var(--color-on-surface); padding: 0 34px 0 12px; font-size: 14px; font-weight: 600; letter-spacing: 0; text-transform: none; outline: none; }
.control-label select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--color-on-surface-variant) 50%), linear-gradient(135deg, var(--color-on-surface-variant) 50%, transparent 50%); background-position: calc(100% - 16px) 19px, calc(100% - 11px) 19px; background-repeat: no-repeat; background-size: 5px 5px, 5px 5px; }
.control-label select:focus-visible, .pagination-count select:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.primary-action, .secondary-action { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 8px; border-radius: 4px; padding: 0 16px; font-size: 14px; font-weight: 700; text-decoration: none; white-space: nowrap; outline: none; }
.primary-action { background: linear-gradient(145deg, var(--color-primary), var(--color-primary-dim)); color: var(--color-on-primary); }
.secondary-action { background: var(--color-surface-container-high); color: var(--color-on-surface); }
.primary-action:hover, .secondary-action:hover { opacity: .9; }
.primary-action:focus-visible, .secondary-action:focus-visible, .details-button:focus-visible, .pagination-buttons button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
.target-panel { display: flex; align-items: center; justify-content: space-between; gap: 28px; border-radius: 8px; background: var(--color-primary-container); padding: 28px 24px; color: var(--color-on-primary-container); }
.target-panel__label-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.eyebrow { color: var(--color-on-primary-container); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.baseline-tag, .target-filter-note { border-radius: 4px; background: rgba(255, 255, 255, .62); padding: 5px 9px; color: var(--color-on-primary-container); font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
.target-filter-note { background: rgba(255, 255, 255, .35); }
.target-panel__address { margin-top: 10px; color: var(--color-on-surface); font-size: 21px; font-weight: 800; line-height: 1.2; letter-spacing: -.01em; }
.target-panel__location { margin-top: 8px; color: var(--color-on-primary-container); font-size: 14px; }
.target-panel__mobile-metrics { display: none; }
.target-panel__stats { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 18px 26px; }
.target-panel__stats > div { text-align: right; }
.target-panel__stats span { display: block; color: var(--color-on-primary-container); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.target-panel__stats strong { display: block; margin-top: 6px; color: var(--color-on-surface); font-size: 17px; font-weight: 800; line-height: 1; white-space: nowrap; }
.target-summary-sticky { position: sticky; top: 64px; z-index: 10; display: flex; align-items: center; justify-content: space-between; min-height: 56px; margin: -1px 0 16px; border-radius: 8px; background: rgba(214, 227, 255, .95); padding: 10px 20px; box-shadow: 0 6px 24px rgba(43, 52, 55, .07); backdrop-filter: blur(20px); }
.target-summary-sticky__address { display: flex; align-items: center; gap: 12px; min-width: 0; }
.target-summary-sticky__address strong { overflow: hidden; color: var(--color-on-surface); font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
.target-summary-sticky__facts { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px 14px; color: var(--color-on-primary-container); font-size: 12px; font-weight: 700; }
.comparables-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 34px 0 14px; }
.comparables-toolbar h2 { color: var(--color-outline); font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.comparables-toolbar__mobile-controls { display: none; }
.column-headings { display: grid; grid-template-columns: minmax(0, 1fr) 200px 150px 300px; gap: 20px; padding: 0 24px 10px; color: var(--color-outline); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.column-headings--with-neighbor { grid-template-columns: minmax(0, 1fr) 200px 150px 132px 300px; }
.column-headings span:not(:first-child) { text-align: right; }
.column-headings span:last-child { text-align: left; }
.property-list { display: grid; gap: 10px; }
.pagination-wrap { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 28px; padding-top: 18px; }
.pagination-count { display: flex; align-items: center; gap: 12px; color: var(--color-on-surface-variant); font-size: 12px; font-weight: 600; }
.pagination-count select { min-height: 36px; padding-top: 0; padding-bottom: 0; font-size: 12px; }
.pagination-buttons { display: flex; align-items: center; gap: 4px; }
.pagination-buttons button, .pagination-ellipsis { display: inline-flex; width: 36px; height: 36px; align-items: center; justify-content: center; border: 0; border-radius: 4px; background: var(--color-surface-container-high); color: var(--color-on-surface-variant); font-size: 12px; font-weight: 700; }
.pagination-buttons button:hover:not(:disabled), .pagination-buttons button.is-current { background: var(--color-primary); color: var(--color-on-primary); }
.pagination-buttons button:disabled { cursor: default; opacity: .3; }
.pagination-ellipsis { background: transparent; }
.skeleton-row { display: grid; grid-template-columns: 1fr 200px 150px 132px 300px; gap: 20px; min-height: 88px; border-radius: 8px; background: var(--color-surface-container-lowest); padding: 24px; }
.skeleton-row span { height: 11px; border-radius: 4px; background: var(--color-surface-container-low); animation: pulse 1.4s ease-in-out infinite; }
.skeleton-row span:first-child { width: 44%; }
.skeleton-row span:nth-child(2) { width: 72%; margin-left: auto; }
.skeleton-row span:nth-child(3) { width: 68%; margin-left: auto; }
.skeleton-row span:last-child { width: 86%; }
.state-card { border-radius: 8px; background: var(--color-surface-container-lowest); padding: 48px 24px; text-align: center; }
.state-card h2 { color: var(--color-on-surface); font-size: 18px; font-weight: 800; }
.state-card p { margin-top: 8px; color: var(--color-on-surface-variant); font-size: 14px; }
@keyframes pulse { 0%, 100% { opacity: .6; } 50% { opacity: 1; } }
@media (max-width: 1279px) and (min-width: 1024px) { .column-headings { grid-template-columns: minmax(0, 1fr) 170px 130px minmax(210px, 1fr); gap: 14px; } .column-headings--with-neighbor { grid-template-columns: minmax(0, 1fr) 170px 130px 112px minmax(210px, 1fr); } }
@media (max-width: 1100px) and (min-width: 1024px) { .property-index__header { flex-wrap: wrap; } .property-index__actions { margin-left: auto; } }
@media (max-width: 1023px) and (min-width: 768px) { .property-index__inner { padding: 48px 32px 64px; } .property-index__header { align-items: flex-end; } .property-index__actions .control-label { display: none; } .comparables-toolbar__mobile-controls { display: flex; gap: 8px; } .comparables-toolbar__mobile-controls .control-label select { min-height: 44px; max-width: 180px; font-size: 13px; } .column-headings, .skeleton-row { display: none; } }
@media (max-width: 767px) {
    .property-index__inner { padding: 32px 18px 56px; }
    .property-index__header { align-items: flex-start; gap: 16px; margin-bottom: 28px; }
    .property-index__actions { flex-shrink: 0; }
    .property-index__actions .control-label, .property-index__actions .secondary-action { display: none; }
    .primary-action { padding: 0 14px; }
    .target-panel { display: block; padding: 26px 32px; }
    .target-panel__stats { display: none; }
    .target-panel__mobile-metrics { display: grid; grid-template-columns: max-content max-content; align-items: baseline; gap: 0 12px; margin-top: 12px; }
    .target-panel__mobile-metrics strong { color: var(--color-on-surface); font-size: 25px; font-weight: 800; line-height: 1; }
    .target-panel__mobile-metrics > span { color: var(--color-on-primary-container); font-size: 17px; font-weight: 700; }
    .target-panel__mobile-metrics small { grid-column: 1 / -1; margin-top: 12px; color: var(--color-on-primary-container); font-size: 14px; line-height: 1.6; }
    .target-panel__address { font-size: 20px; }
    .target-panel__location { font-size: 14px; line-height: 1.7; }
    .comparables-toolbar { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; margin-top: 28px; }
    .comparables-toolbar__mobile-controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .comparables-toolbar__mobile-controls .control-label select { width: 100%; min-height: 44px; max-width: none; font-size: 13px; }
    .column-headings { display: none; }
    .property-list { gap: 10px; }
    .pagination-wrap { display: block; }
    .pagination-count { justify-content: space-between; }
    .pagination-buttons { justify-content: center; margin-top: 14px; }
    .target-summary-sticky { display: none; }
}
@media (prefers-reduced-motion: reduce) { .skeleton-row span { animation: none; } }
</style>
