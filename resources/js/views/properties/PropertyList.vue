<template>
    <div class="min-h-screen bg-surface p-10">
        <div class="max-w-6xl mx-auto">
            <!-- Header & Filters -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Residential Catalog</h1>
                    <p class="text-on-surface-variant font-medium">
                        Managing {{ pagination.total }} {{ pagination.total === 1 ? 'property' : 'properties' }}
                    </p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <!-- Neighborhood filter -->
                    <div class="relative" ref="filterDropdownRef">
                        <button
                            @click="showNeighborhoodFilter = !showNeighborhoodFilter"
                            :class="[
                                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                                selectedNeighborhoodIds.length > 0
                                    ? 'bg-primary text-on-primary'
                                    : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high',
                            ]"
                        >
                            <span class="material-symbols-outlined text-base">filter_list</span>
                            Neighborhoods
                            <span
                                v-if="selectedNeighborhoodIds.length > 0"
                                class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-on-primary text-primary text-xs font-bold"
                            >
                                {{ selectedNeighborhoodIds.length }}
                            </span>
                        </button>

                        <!-- Dropdown panel -->
                        <div
                            v-if="showNeighborhoodFilter"
                            class="absolute right-0 top-full mt-2 w-64 bg-surface-container rounded-xl shadow-lg z-10 overflow-hidden"
                        >
                            <div class="px-4 py-3 border-b border-outline-variant flex justify-between items-center">
                                <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Filter by Neighborhood</span>
                                <button
                                    v-if="selectedNeighborhoodIds.length > 0"
                                    @click="clearFilter"
                                    class="text-xs text-primary font-semibold hover:opacity-75 transition-opacity"
                                >
                                    Clear
                                </button>
                            </div>
                            <div class="max-h-64 overflow-y-auto">
                                <p v-if="neighborhoods.length === 0" class="p-4 text-sm text-on-surface-variant text-center">
                                    No neighborhoods found
                                </p>
                                <button
                                    v-for="neighborhood in neighborhoods"
                                    :key="neighborhood.id"
                                    @click="toggleNeighborhood(neighborhood.id)"
                                    class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors text-left"
                                >
                                    <span
                                        class="material-symbols-outlined text-base"
                                        :class="isSelected(neighborhood.id) ? 'text-primary' : 'text-outline'"
                                    >
                                        {{ isSelected(neighborhood.id) ? 'check_box' : 'check_box_outline_blank' }}
                                    </span>
                                    <span class="text-sm text-on-surface">{{ neighborhood.name }}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <router-link
                        to="/properties/create"
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
                        to="/properties/create"
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
                        v-if="showPinnedSection && pinnedProperty"
                        :property="pinnedProperty"
                        :isPinned="true"
                        :key="pinnedProperty.id"
                    />
                    <template v-if="unpinnedProperties.length">
                        <div v-if="showPinnedSection && pinnedProperty" class="px-6 py-1">
                            <h4 class="text-[10px] font-bold uppercase tracking-widest text-outline">Market Comparables</h4>
                        </div>
                        <PropertyListItem
                            v-for="property in unpinnedProperties"
                            :property="property"
                            :isPinned="false"
                            :pinnedProperty="showPinnedSection ? pinnedProperty : null"
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
        to="/properties/create"
        class="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center z-50"
    >
        <span class="material-symbols-outlined">add</span>
    </router-link>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';
import PropertyListItem from '@/components/properties/PropertyListItem.vue';

const route = useRoute();
const router = useRouter();

const properties = ref([]);
const neighborhoods = ref([]);
const loading = ref(true);
const showNeighborhoodFilter = ref(false);
const selectedNeighborhoodIds = ref([]);
const filterDropdownRef = ref(null);
const currentPage = ref(1);
const perPage = ref(10);
const pagination = ref({ total: 0, count: 0, per_page: 10, current_page: 1, total_pages: 1 });

// Only show pinned section when 0 or 1 neighborhood is selected
const showPinnedSection = computed(() => selectedNeighborhoodIds.value.length === 1);
const pinnedProperty = computed(() => showPinnedSection.value ? (properties.value.find(p => p.is_pinned) ?? null) : null);
const unpinnedProperties = computed(() => showPinnedSection.value
    ? properties.value.filter(p => !p.is_pinned)
    : properties.value,
);

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
    const urlNeighborhoods = route.query.neighborhoods;
    if (urlNeighborhoods) {
        selectedNeighborhoodIds.value = urlNeighborhoods.split(',').map(Number);
    }
    if (route.query.page) {
        currentPage.value = Number(route.query.page);
    }
    if (route.query.per_page) {
        perPage.value = Number(route.query.per_page);
    }

    document.addEventListener('mousedown', onDocumentClick);
    await Promise.all([fetchNeighborhoods(), fetchProperties()]);
});

onUnmounted(() => {
    document.removeEventListener('mousedown', onDocumentClick);
});

function onDocumentClick(e) {
    if (filterDropdownRef.value && !filterDropdownRef.value.contains(e.target)) {
        showNeighborhoodFilter.value = false;
    }
}

async function fetchNeighborhoods() {
    try {
        const response = await api.get('/neighborhoods');
        neighborhoods.value = response.data.data;
    } catch (error) {
        console.error('Failed to load neighborhoods', error);
    }
}

async function fetchProperties() {
    loading.value = true;
    try {
        const params = { page: currentPage.value, per_page: perPage.value };
        if (selectedNeighborhoodIds.value.length > 0) {
            params.search = selectedNeighborhoodIds.value.join(',');
            params.searchFields = 'neighborhood_id:in';
        }
        const response = await api.get('/properties', { params });
        properties.value = response.data.data;
        pagination.value = response.data.meta.pagination;
    } catch (error) {
        console.error('Failed to load properties', error);
    } finally {
        loading.value = false;
    }
}

function isSelected(id) {
    return selectedNeighborhoodIds.value.includes(id);
}

function toggleNeighborhood(id) {
    const idx = selectedNeighborhoodIds.value.indexOf(id);
    if (idx === -1) {
        selectedNeighborhoodIds.value.push(id);
    } else {
        selectedNeighborhoodIds.value.splice(idx, 1);
    }
    currentPage.value = 1;
    syncToUrl();
    fetchProperties();
}

function clearFilter() {
    selectedNeighborhoodIds.value = [];
    currentPage.value = 1;
    syncToUrl();
    fetchProperties();
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

function syncToUrl() {
    const query = { ...route.query };
    if (selectedNeighborhoodIds.value.length > 0) {
        query.neighborhoods = selectedNeighborhoodIds.value.join(',');
    } else {
        delete query.neighborhoods;
    }
    if (currentPage.value > 1) {
        query.page = currentPage.value;
    } else {
        delete query.page;
    }
    if (perPage.value !== 10) {
        query.per_page = perPage.value;
    } else {
        delete query.per_page;
    }
    router.replace({ query });
}
</script>
