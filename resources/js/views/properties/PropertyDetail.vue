<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <!-- Loading -->
            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            </div>

            <template v-else-if="property">
                <!-- Header -->
                <div class="mb-6">
                    <router-link to="/properties" class="text-sm text-gray-500 hover:text-gray-700">
                        ← Back to properties
                    </router-link>
                    <div class="mt-2 flex items-center justify-between">
                        <h1 class="text-2xl font-bold text-gray-900">{{ property.address }}</h1>
                        <div class="flex space-x-3">
                            <button
                                @click="runAnalysis"
                                :disabled="analyzing"
                                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                                <svg v-if="analyzing" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ analyzing ? 'Analyzing...' : 'Run Analysis' }}
                            </button>
                            <button
                                @click="deleteProperty"
                                class="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">
                        {{ property.city }}, {{ property.state }} {{ property.zip_code }}
                    </p>
                </div>

                <!-- Property Details -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div class="px-4 py-5 sm:px-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Property Details</h3>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl>
                            <div v-if="property.neighborhood" class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Neighborhood</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ property.neighborhood.name }}
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Acreage</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ property.acreage ? `${property.acreage} acres` : 'Not specified' }}
                                </dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Bedrooms / Bathrooms</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ property.bedrooms ?? '-' }} bed / {{ property.bathrooms ?? '-' }} bath
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Square Feet / Year Built</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ property.square_feet ? `${property.square_feet.toLocaleString()} sq ft` : '-' }} / {{ property.year_built ?? '-' }}
                                </dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Garage / Basement</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ property.garage }} car / {{ property.basement ?? 'None' }}
                                    <span v-if="property.basement_walkout" class="ml-1 text-xs text-gray-500">(Walkout)</span>
                                </dd>
                            </div>
                            <div class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Features</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 space-x-4">
                                    <span v-if="property.fireplace">🔥 Fireplace</span>
                                    <span v-if="property.pool">🏊 Pool</span>
                                    <span v-if="property.main_level_primary_bedroom">🛌 Main Primary</span>
                                </dd>
                            </div>
                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Utilities / HOA</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    Water: {{ property.water ?? 'Unknown' }} / Sewer: {{ property.sewer ?? 'Unknown' }} / HOA: {{ property.hoa ?? 'None' }}
                                </dd>
                            </div>
                            <div v-if="property.listing_url" class="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">Listing URL</dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <a :href="property.listing_url" target="_blank" class="text-emerald-600 hover:text-emerald-500">
                                        {{ property.listing_url }}
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <!-- Notes -->
                <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 class="text-lg leading-6 font-medium text-gray-900">Notes</h3>
                    </div>
                    <div class="border-t border-gray-200">
                        <ul v-if="property.notes?.length" class="divide-y divide-gray-200">
                            <li v-for="note in property.notes" :key="note.id" class="px-4 py-4 sm:px-6">
                                <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ note.content }}</p>
                                <p class="mt-1 text-xs text-gray-500">{{ formatDate(note.created_at) }}</p>
                            </li>
                        </ul>
                        <p v-else class="px-4 py-5 text-sm text-gray-500 italic">No notes added yet.</p>
                    </div>
                </div>

                <!-- Analysis Sections -->
                <div v-if="property.analyzed_at" class="space-y-6">
                    <p class="text-sm text-gray-500">
                        Last analyzed: {{ formatDate(property.analyzed_at) }}
                    </p>

                    <!-- Neighbor Distance Analysis -->
                    <Neighborhood :analysis="property.analysis" />

                    <!-- POI Analysis -->
                    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div class="px-4 py-5 sm:px-6 flex items-center">
                            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Nearby Amenities</h3>
                        </div>
                        <div class="border-t border-gray-200">
                            <div v-if="property.analysis?.points_of_interest" class="divide-y divide-gray-200">
                                <template v-for="(poiData, category) in property.analysis.points_of_interest" :key="category">
                                    <div v-if="poiData.nearest" class="px-4 py-4 sm:px-6">
                                        <h4 class="text-sm font-medium text-gray-700 capitalize mb-2">{{ formatCategory(category) }}</h4>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-900">{{ poiData.nearest.name }}</span>
                                            <span class="text-gray-500">{{ (poiData.nearest.distance_meters / 1609.34).toFixed(2) }} mi</span>
                                        </div>
                                        <p v-if="poiData.count > 1" class="mt-1 text-xs text-gray-400">+ {{ poiData.count - 1 }} more in area</p>
                                    </div>
                                </template>
                            </div>
                            <p v-else class="px-4 py-5 sm:px-6 text-sm text-gray-500">No POI data available.</p>
                        </div>
                    </div>

                    <!-- Road Accessibility -->
                    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div class="px-4 py-5 sm:px-6 flex items-center">
                            <svg class="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <h3 class="text-lg leading-6 font-medium text-gray-900">Road Accessibility</h3>
                        </div>
                        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <div v-if="property.analysis?.road_accessibility">
                                <div class="flex items-center mb-4">
                                    <span
                                        :class="[
                                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize',
                                            ['excellent', 'good'].includes(property.analysis.road_accessibility.accessibility_score) ? 'bg-green-100 text-green-800' :
                                            ['moderate', 'limited'].includes(property.analysis.road_accessibility.accessibility_score) ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        ]"
                                    >
                                        {{ property.analysis.road_accessibility.accessibility_score }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div v-if="property.analysis.road_accessibility.highway?.nearest_road">
                                        <p class="text-gray-500 font-medium">Nearest Major Highway</p>
                                        <p class="text-gray-900">{{ property.analysis.road_accessibility.highway.nearest_road.name }} ({{ (property.analysis.road_accessibility.highway.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</p>
                                    </div>
                                    <div v-if="property.analysis.road_accessibility.main_road?.nearest_road">
                                        <p class="text-gray-500 font-medium">Nearest Main Road</p>
                                        <p class="text-gray-900">{{ property.analysis.road_accessibility.main_road.nearest_road.name }} ({{ (property.analysis.road_accessibility.main_road.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</p>
                                    </div>
                                    <div v-if="property.analysis.road_accessibility.local_road?.nearest_road">
                                        <p class="text-gray-500 font-medium">Nearest Local Road</p>
                                        <p class="text-gray-900">{{ property.analysis.road_accessibility.local_road.nearest_road.name }} ({{ (property.analysis.road_accessibility.local_road.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</p>
                                    </div>
                                </div>
                            </div>
                            <p v-else class="text-sm text-gray-500">No road accessibility data available.</p>
                        </div>
                    </div>
                </div>

                <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-sm text-yellow-800">
                        This property hasn't been analyzed yet. Click "Run Analysis" to get neighbor distance, POI, and road accessibility data.
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
import Neighborhood from "@/components/properties/analyses/Neighborhood.vue";

const router = useRouter();
const route = useRoute();

const property = ref(null);
const loading = ref(true);
const analyzing = ref(false);

const formatPrice = (price) => new Intl.NumberFormat('en-US').format(price);
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' });
const formatCategory = (category) => category.replace(/_/g, ' ');

const loadProperty = async () => {
    try {
        const response = await api.get(`/properties/${route.params.id}`);
        property.value = response.data.data;
        console.log('property response', property.value);
    } catch (error) {
        console.error('Failed to load property', error);
        await router.push('/properties');
    } finally {
        loading.value = false;
    }
};

const runAnalysis = async () => {
    analyzing.value = true;
    try {
        const response = await api.post(`/properties/${route.params.id}/analyze`);
        alert(response.data.data.message || 'Analysis has been queued.');
    } catch (error) {
        console.error('Analysis failed', error);
        alert('Analysis failed. Please try again.');
    } finally {
        analyzing.value = false;
    }
};

const deleteProperty = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
        await api.delete(`/properties/${route.params.id}`);
        router.push('/properties');
    } catch (error) {
        console.error('Failed to delete property', error);
        alert('Failed to delete property.');
    }
};

onMounted(loadProperty);
</script>
