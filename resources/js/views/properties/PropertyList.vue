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
                    <button class="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors">
                        <span class="material-symbols-outlined text-base">filter_list</span> Neighborhoods
                    </button>
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
                <PropertyListItem v-for="property in properties" :property="property" :isPinned="false" :key="property.id" />
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
import { onMounted, ref } from 'vue';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';
import PropertyListItem from '@/components/properties/PropertyListItem.vue';

const properties = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await api.get('/properties');
        properties.value = response.data.data;
    } catch (error) {
        console.error('Failed to load properties', error);
    } finally {
        loading.value = false;
    }
});
</script>
