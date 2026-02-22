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
                <ul class="divide-y divide-gray-200">
                    <li v-for="property in properties" :key="property.id">
                        <router-link :to="`/properties/${property.id}`" class="block hover:bg-gray-50">
                            <div class="px-4 py-4 sm:px-6">
                                <div class="flex items-center justify-between">
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-emerald-600 truncate">
                                            {{ property.address }}
                                        </p>
                                        <p class="mt-1 text-sm text-gray-500">
                                            {{ property.city }}, {{ property.state }} {{ property.zip_code }}
                                            <span v-if="property.neighborhood" class="ml-2 px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                                {{ property.neighborhood.name }}
                                            </span>
                                        </p>
                                    </div>
                                    <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
                                        <span v-if="property.analyzed_at" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Analyzed
                                        </span>
                                        <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                        <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                                    <span v-if="property.price">${{ formatPrice(property.price) }}</span>
                                    <span v-if="property.acreage">{{ property.acreage }} acres</span>
                                    <span v-if="property.bedrooms">{{ property.bedrooms }} bed</span>
                                    <span v-if="property.bathrooms">{{ property.bathrooms }} bath</span>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import EmptyState from '@/components/EmptyState.vue';

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
