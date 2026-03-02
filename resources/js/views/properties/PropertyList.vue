<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Properties</h1>
                <router-link
                    to="/properties/create"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                    <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Property
                </router-link>
            </div>

            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            </div>

            <EmptyState
                v-else-if="properties.length === 0"
                title="No properties found"
                description="Get started by adding your first property to track its price history and neighborhood performance."
            >
                <template #action>
                    <router-link
                        to="/properties/create"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                        <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Property
                    </router-link>
                </template>
            </EmptyState>

            <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
              <PropertyListItem v-for="property in properties" :key="property.id" :property="property"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';
import PropertyListItem from '@/components/properties/PropertyListItem.vue';

const properties = ref([]);
const loading = ref(true);

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};

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
