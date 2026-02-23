<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Properties Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                                    <dd class="text-lg font-semibold text-gray-900">{{ stats.total_properties }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3">
                        <router-link to="/properties" class="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                            View all
                        </router-link>
                    </div>
                </div>

                <!-- Analyzed Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div class="ml-5 w-0 flex-1">
                                <dl>
                                    <dt class="text-sm font-medium text-gray-500 truncate">Analyzed</dt>
                                    <dd class="text-lg font-semibold text-gray-900">{{ stats.analyzed_properties }}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- Recently Listed -->
                <div class="bg-white shadow rounded-lg overflow-hidden">
                    <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Recently Listed (30 days)</h3>
                    </div>
                    <ul class="divide-y divide-gray-200">
                        <li v-for="property in stats.recently_listed" :key="property.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <router-link :to="`/properties/${property.id}`" class="block">
                                <div class="flex items-center justify-between">
                                    <div class="truncate">
                                        <p class="text-sm font-medium text-emerald-600 truncate">{{ property.address }}</p>
                                        <p class="text-sm text-gray-500">{{ property.city }}, {{ property.state }}</p>
                                    </div>
                                    <div class="ml-2 flex-shrink-0">
                                        <p class="text-xs text-gray-400">{{ formatDate(property.created_at) }}</p>
                                    </div>
                                </div>
                            </router-link>
                        </li>
                        <li v-if="!stats.recently_listed?.length" class="px-4 py-8 text-center text-gray-500 italic">
                            No recent listings found
                        </li>
                    </ul>
                </div>

                <!-- Recently Sold -->
                <div class="bg-white shadow rounded-lg overflow-hidden">
                    <div class="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Recently Sold (30 days)</h3>
                    </div>
                    <ul class="divide-y divide-gray-200">
                        <li v-for="history in stats.recently_sold" :key="history.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <router-link :to="`/properties/${history.property.id}`" class="block">
                                <div class="flex items-center justify-between">
                                    <div class="truncate">
                                        <p class="text-sm font-medium text-emerald-600 truncate">{{ history.property.address }}</p>
                                        <p class="text-sm text-gray-500">{{ history.property.city }}, {{ history.property.state }}</p>
                                    </div>
                                    <div class="ml-2 flex-shrink-0">
                                        <p class="text-sm font-semibold text-gray-900">${{ formatPrice(history.price) }}</p>
                                        <p class="text-xs text-gray-400">{{ formatDate(history.price_date) }}</p>
                                    </div>
                                </div>
                            </router-link>
                        </li>
                        <li v-if="!stats.recently_sold?.length" class="px-4 py-8 text-center text-gray-500 italic">
                            No recent sales found
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const stats = ref({
    total_properties: 0,
    analyzed_properties: 0,
    recently_listed: [],
    recently_sold: [],
});

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

onMounted(async () => {
    try {
        const response = await api.get('/dashboard/stats');
        stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to load dashboard stats', error);
    }
});
</script>
