<template>
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <div class="mb-6">
                <router-link :to="`/neighborhoods/${route.params.neighborhoodId}/properties`" class="text-sm text-gray-500 hover:text-gray-700">
                    ← Back to properties
                </router-link>
                <h1 class="mt-2 text-2xl font-bold text-gray-900">Add Property</h1>
            </div>

            <form @submit.prevent="handleSubmit" class="bg-white shadow sm:rounded-lg">
                <div class="px-4 py-5 sm:p-6 space-y-6">
                    <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {{ error }}
                    </div>

                    <!-- Address -->
                    <div>
                        <label for="address" class="block text-sm font-medium text-gray-700">Street Address *</label>
                        <input
                            id="address"
                            v-model="form.address"
                            type="text"
                            required
                            placeholder="123 Main St"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-3">
                            <label for="city" class="block text-sm font-medium text-gray-700">City *</label>
                            <input
                                id="city"
                                v-model="form.city"
                                type="text"
                                required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-6 sm:col-span-1">
                            <label for="state" class="block text-sm font-medium text-gray-700">State *</label>
                            <input
                                id="state"
                                v-model="form.state"
                                type="text"
                                required
                                maxlength="2"
                                placeholder="WV"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="zip_code" class="block text-sm font-medium text-gray-700">ZIP Code *</label>
                            <input
                                id="zip_code"
                                v-model="form.zip_code"
                                type="text"
                                required
                                maxlength="10"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-3 sm:col-span-1">
                            <label for="acreage" class="block text-sm font-medium text-gray-700">Acreage</label>
                            <input
                                id="acreage"
                                v-model="form.acreage"
                                type="number"
                                step="0.01"
                                min="0"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-3 sm:col-span-1">
                            <label for="bedrooms" class="block text-sm font-medium text-gray-700">Beds</label>
                            <input
                                id="bedrooms"
                                v-model="form.bedrooms"
                                type="number"
                                min="0"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-3 sm:col-span-1">
                            <label for="bathrooms" class="block text-sm font-medium text-gray-700">Baths</label>
                            <input
                                id="bathrooms"
                                v-model="form.bathrooms"
                                type="number"
                                step="0.5"
                                min="0"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-3 sm:col-span-1">
                            <label for="square_feet" class="block text-sm font-medium text-gray-700">Sq Ft</label>
                            <input
                                id="square_feet"
                                v-model="form.square_feet"
                                type="number"
                                min="0"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-3 sm:col-span-1">
                            <label for="year_built" class="block text-sm font-medium text-gray-700">Year Built</label>
                            <input
                                id="year_built"
                                v-model="form.year_built"
                                type="number"
                                min="1700"
                                :max="new Date().getFullYear() + 5"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div class="col-span-3 sm:col-span-1">
                            <label for="garage" class="block text-sm font-medium text-gray-700">Garage</label>
                            <input
                                id="garage"
                                v-model="form.garage"
                                type="number"
                                min="0"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-2">
                            <label for="basement" class="block text-sm font-medium text-gray-700">Basement</label>
                            <select
                                id="basement"
                                v-model="form.basement"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">None/Unknown</option>
                                <option value="Unfinished">Unfinished</option>
                                <option value="Finished">Finished</option>
                                <option value="Partial">Partial</option>
                            </select>
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="fence" class="block text-sm font-medium text-gray-700">Fence</label>
                            <select
                                id="fence"
                                v-model="form.fence"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">Unknown</option>
                                <option value="Yes">Yes</option>
                                <option value="No but allowed">No but allowed</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="deck" class="block text-sm font-medium text-gray-700">Deck/Patio</label>
                            <select
                                id="deck"
                                v-model="form.deck"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">Unknown</option>
                                <option value="Screened/Covered Porch">Screened/Covered Porch</option>
                                <option value="Deck">Deck</option>
                                <option value="Patio">Patio</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-6 gap-6">
                        <div class="col-span-6 sm:col-span-2">
                            <label for="water" class="block text-sm font-medium text-gray-700">Water</label>
                            <select
                                id="water"
                                v-model="form.water"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">Unknown</option>
                                <option value="Well">Well</option>
                                <option value="Public">Public</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="sewer" class="block text-sm font-medium text-gray-700">Sewer</label>
                            <select
                                id="sewer"
                                v-model="form.sewer"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">Unknown</option>
                                <option value="Septic">Septic</option>
                                <option value="Public">Public</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="hoa" class="block text-sm font-medium text-gray-700">HOA</label>
                            <select
                                id="hoa"
                                v-model="form.hoa"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                            >
                                <option :value="null">Unknown</option>
                                <option value="None">None</option>
                                <option value="HOA">HOA</option>
                                <option value="Condo">Condo</option>
                                <option value="Coop">Coop</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="reference_hvac_type_id" class="block text-sm font-medium text-gray-700">HVAC Type</label>
                        <select
                            id="reference_hvac_type_id"
                            v-model="form.reference_hvac_type_id"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option :value="null">Unknown</option>
                            <option v-for="type in hvacTypes" :key="type.id" :value="type.id">
                                {{ type.label }}
                            </option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="basement_walkout"
                                    v-model="form.basement_walkout"
                                    type="checkbox"
                                    class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="basement_walkout" class="font-medium text-gray-700">Basement Walkout</label>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="fireplace"
                                    v-model="form.fireplace"
                                    type="checkbox"
                                    class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="fireplace" class="font-medium text-gray-700">Fireplace</label>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="main_level_primary_bedroom"
                                    v-model="form.main_level_primary_bedroom"
                                    type="checkbox"
                                    class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="main_level_primary_bedroom" class="font-medium text-gray-700">Main Level Primary Bed</label>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input
                                    id="pool"
                                    v-model="form.pool"
                                    type="checkbox"
                                    class="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300 rounded"
                                />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="pool" class="font-medium text-gray-700">Pool</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="listing_url" class="block text-sm font-medium text-gray-700">Listing URL</label>
                        <input
                            id="listing_url"
                            v-model="form.listing_url"
                            type="url"
                            placeholder="https://redfin.com/..."
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                    <router-link
                        :to="`/neighborhoods/${route.params.neighborhoodId}/properties`"
                        class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </router-link>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {{ loading ? 'Saving...' : 'Save Property' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';

const router = useRouter();
const route = useRoute();

const hvacTypes = ref([]);

const form = reactive({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    acreage: null,
    bedrooms: null,
    bathrooms: null,
    square_feet: null,
    year_built: null,
    garage: 0,
    basement: null,
    basement_walkout: false,
    fireplace: false,
    main_level_primary_bedroom: false,
    pool: false,
    fence: null,
    deck: null,
    water: null,
    sewer: null,
    reference_hvac_type_id: null,
    hoa: null,
    listing_url: '',
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    const neighborhoodId = route.params.neighborhoodId;
    try {
        const response = await api.post(`/neighborhoods/${neighborhoodId}/properties`, form);
        router.push(`/neighborhoods/${neighborhoodId}/properties/${response.data.data.id}`);
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to save property';
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    try {
        const response = await api.get('/reference/hvac-types');
        hvacTypes.value = response.data.data;
    } catch (e) {
        console.error('Failed to load HVAC types', e);
    }
});
</script>
