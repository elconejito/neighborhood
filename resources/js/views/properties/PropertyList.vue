<template>
    <div class="min-h-screen bg-surface p-10">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <router-link to="/neighborhoods" class="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-3">
                        <span class="material-symbols-outlined text-sm">arrow_back</span> Neighborhoods
                    </router-link>
                    <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Residential Catalog</h1>
                    <p class="text-on-surface-variant font-medium">
                        Managing {{ pagination.total }} {{ pagination.total === 1 ? 'property' : 'properties' }}
                    </p>
                </div>
                <div class="flex flex-wrap items-end gap-3">
                    <label class="flex flex-col gap-2">
                        <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</span>
                        <select
                            :value="saleStatus"
                            @change="changeSaleStatus($event.target.value)"
                            class="bg-surface-container-highest text-on-surface-variant text-sm font-semibold rounded-lg px-3 py-2 border-0 outline-none cursor-pointer hover:bg-surface-container-high transition-colors appearance-none pr-8"
                            style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2343474e%22><path d=%22M7 10l5 5 5-5z%22/></svg>'); background-repeat: no-repeat; background-position: right 0.4rem center; background-size: 1.2rem;"
                        >
                            <option value="all">All Properties</option>
                            <option value="sold">Sold</option>
                            <option value="unsold">Unsold</option>
                        </select>
                    </label>
                    <label class="flex flex-col gap-2">
                        <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Sort</span>
                        <select
                            :value="sortKey"
                            @change="changeSort($event.target.value)"
                            class="bg-surface-container-highest text-on-surface-variant text-sm font-semibold rounded-lg px-3 py-2 border-0 outline-none cursor-pointer hover:bg-surface-container-high transition-colors appearance-none pr-8"
                            style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2343474e%22><path d=%22M7 10l5 5 5-5z%22/></svg>'); background-repeat: no-repeat; background-position: right 0.4rem center; background-size: 1.2rem;"
                        >
                            <option
                                v-for="option in sortOptions"
                                :key="option.value"
                                :value="option.value"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </label>
                    <router-link
                        :to="`/neighborhoods/${neighborhoodId}/dashboard`"
                        class="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
                    >
                        <span class="material-symbols-outlined text-sm">bar_chart</span> Dashboard
                    </router-link>
                    <router-link
                        :to="`/neighborhoods/${neighborhoodId}/properties/create`"
                        class="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
                    >
                        <span class="material-symbols-outlined text-sm">add</span> Add Asset
                    </router-link>
                </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>

            <!-- Empty State -->
            <EmptyState
                v-else-if="properties.length === 0"
                title="No properties found"
                description="Get started by adding your first property to track its price history and neighborhood performance."
            >
                <template #action>
                    <router-link
                        :to="`/neighborhoods/${neighborhoodId}/properties/create`"
                        class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
                    >
                        <span class="material-symbols-outlined text-sm">add</span>
                        Add Your First Property
                    </router-link>
                </template>
            </EmptyState>

            <template v-else>
                <!-- Catalog List -->
                <div class="space-y-3">
                    <PropertyListItem
                        v-if="pinnedProperty"
                        :property="pinnedProperty"
                        :isPinned="true"
                        :neighborhoodId="neighborhoodId"
                        :key="pinnedProperty.id"
                    />
                    <template v-if="unpinnedProperties.length">
                        <div v-if="pinnedProperty" class="px-6 py-1">
                            <h4 class="text-[10px] font-bold uppercase tracking-widest text-outline">Market Comparables</h4>
                        </div>
                        <PropertyListItem
                            v-for="property in unpinnedProperties"
                            :property="property"
                            :isPinned="false"
                            :pinnedProperty="pinnedProperty"
                            :neighborhoodId="neighborhoodId"
                            :key="property.id"
                        />
                    </template>
                </div>

                <!-- Pagination -->
                <div v-if="pagination.total > 0" class="flex items-center justify-between mt-8 pt-6 border-t border-outline-variant/20">
                    <!-- Per-page selector -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-on-surface-variant">Show</span>
                        <select
                            :value="perPage"
                            @change="changePerPage(Number($event.target.value))"
                            class="bg-surface-container-highest text-on-surface-variant text-sm font-semibold rounded-lg px-3 py-2 border-0 outline-none cursor-pointer hover:bg-surface-container-high transition-colors appearance-none pr-8"
                            style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2343474e%22><path d=%22M7 10l5 5 5-5z%22/></svg>'); background-repeat: no-repeat; background-position: right 0.4rem center; background-size: 1.2rem;"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <span class="text-sm text-on-surface-variant">of {{ pagination.total }}</span>
                    </div>

                    <div v-if="pagination.total_pages > 1" class="flex items-center gap-1">
                        <!-- Previous -->
                        <button
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage === 1"
                            class="flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                        >
                            <span class="material-symbols-outlined text-base">chevron_left</span>
                        </button>

                        <!-- Page numbers -->
                        <template v-for="page in pageRange" :key="page">
                            <span v-if="page === '...'" class="w-9 h-9 flex items-center justify-center text-sm text-on-surface-variant">
                                &hellip;
                            </span>
                            <button
                                v-else
                                @click="goToPage(page)"
                                :class="[
                                    'w-9 h-9 rounded-lg text-sm font-semibold transition-colors',
                                    page === currentPage
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high',
                                ]"
                            >
                                {{ page }}
                            </button>
                        </template>

                        <!-- Next -->
                        <button
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === pagination.total_pages"
                            class="flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                        >
                            <span class="material-symbols-outlined text-base">chevron_right</span>
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <!-- Mobile FAB -->
    <router-link
        :to="`/neighborhoods/${neighborhoodId}/properties/create`"
        class="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50"
    >
        <span class="material-symbols-outlined">add</span>
    </router-link>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';
import PropertyListItem from '@/components/properties/PropertyListItem.vue';

const route = useRoute();
const router = useRouter();

const neighborhoodId = computed(() => route.params.neighborhoodId);

const properties = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const perPage = ref(10);
const sortKey = ref('recent');
const saleStatus = ref('all');
const pagination = ref({ total: 0, count: 0, per_page: 10, current_page: 1, total_pages: 1 });

const sortOptions = [
    { value: 'recent', label: 'Newest Added', params: {} },
    { value: 'oldest', label: 'Oldest Added', params: { orderBy: 'created_at', sortedBy: 'asc' } },
    { value: 'address_asc', label: 'Address A-Z', params: { orderBy: 'address', sortedBy: 'asc' } },
    { value: 'address_desc', label: 'Address Z-A', params: { orderBy: 'address', sortedBy: 'desc' } },
    { value: 'market_price_desc', label: 'Price High-Low', params: { orderBy: 'market_price', sortedBy: 'desc' } },
    { value: 'market_price_asc', label: 'Price Low-High', params: { orderBy: 'market_price', sortedBy: 'asc' } },
    { value: 'market_activity_desc', label: 'Latest Market Activity', params: { orderBy: 'market_activity_date', sortedBy: 'desc' } },
    { value: 'market_activity_asc', label: 'Oldest Market Activity', params: { orderBy: 'market_activity_date', sortedBy: 'asc' } },
];

const pinnedProperty = computed(() => properties.value.find(p => p.is_pinned) ?? null);
const unpinnedProperties = computed(() => properties.value.filter(p => !p.is_pinned));

const pageRange = computed(() => {
    const total = pagination.value.total_pages;
    const current = currentPage.value;

    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = [];
    if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
    } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
    } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
    return pages;
});

onMounted(async () => {
    if (route.query.page) currentPage.value = Number(route.query.page);
    if (route.query.per_page) perPage.value = Number(route.query.per_page);
    if (route.query.sort && sortOptions.some(option => option.value === route.query.sort)) {
        sortKey.value = route.query.sort;
    }
    if (['sold', 'unsold'].includes(route.query.status)) {
        saleStatus.value = route.query.status;
    }
    await fetchProperties();
});

async function fetchProperties() {
    loading.value = true;
    try {
        const params = {
            page: currentPage.value,
            per_page: perPage.value,
            ...(saleStatus.value !== 'all' ? { sale_status: saleStatus.value } : {}),
            ...selectedSortParams(),
        };
        const response = await api.get(`/neighborhoods/${neighborhoodId.value}/properties`, { params });
        properties.value = response.data.data;
        pagination.value = response.data.meta.pagination;
    } catch (error) {
        console.error('Failed to load properties', error);
    } finally {
        loading.value = false;
    }
}

function goToPage(page) {
    if (page < 1 || page > pagination.value.total_pages) return;
    currentPage.value = page;
    syncToUrl();
    fetchProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changePerPage(value) {
    perPage.value = value;
    currentPage.value = 1;
    syncToUrl();
    fetchProperties();
}

function changeSort(value) {
    sortKey.value = value;
    currentPage.value = 1;
    syncToUrl();
    fetchProperties();
}

function changeSaleStatus(value) {
    saleStatus.value = value;
    currentPage.value = 1;
    syncToUrl();
    fetchProperties();
}

function selectedSortParams() {
    return sortOptions.find(option => option.value === sortKey.value)?.params ?? {};
}

function syncToUrl() {
    const query = {};
    if (currentPage.value > 1) query.page = currentPage.value;
    if (perPage.value !== 10) query.per_page = perPage.value;
    if (sortKey.value !== 'recent') query.sort = sortKey.value;
    if (saleStatus.value !== 'all') query.status = saleStatus.value;
    router.replace({ query });
}
</script>
