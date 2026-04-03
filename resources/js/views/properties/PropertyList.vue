<template>
    <div class="min-h-screen bg-surface p-10">
        <div class="max-w-6xl mx-auto">
            <!-- Header & Filters -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                <div>
                    <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Residential Catalog</h1>
                    <p class="text-on-surface-variant font-medium">
                        Managing {{ properties.length }} {{ properties.length === 1 ? 'property' : 'properties' }}
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

            <!-- Catalog List -->
            <div v-else class="space-y-3">
                <PropertyListItem
                    v-if="pinnedProperty"
                    :property="pinnedProperty"
                    :isPinned="true"
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
                        :key="property.id"
                    />
                </template>
            </div>
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

const pinnedProperty = computed(() => properties.value.find(p => p.is_pinned) ?? null);
const unpinnedProperties = computed(() => properties.value.filter(p => !p.is_pinned));

onMounted(async () => {
    // Restore filter from URL on mount (preserves state when navigating back from detail)
    const urlNeighborhoods = route.query.neighborhoods;
    if (urlNeighborhoods) {
        selectedNeighborhoodIds.value = urlNeighborhoods.split(',').map(Number);
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
        const params = {};
        if (selectedNeighborhoodIds.value.length > 0) {
            params.search = selectedNeighborhoodIds.value.join(',');
            params.searchFields = 'neighborhood_id:in';
        }
        const response = await api.get('/properties', { params });
        properties.value = response.data.data;
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
    syncToUrl();
    fetchProperties();
}

function clearFilter() {
    selectedNeighborhoodIds.value = [];
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
    router.replace({ query });
}
</script>
