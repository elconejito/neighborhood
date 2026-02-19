<template>
    <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <div class="mb-6">
                <router-link to="/properties" class="text-sm text-gray-500 hover:text-gray-700">
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
                        <div class="col-span-6 sm:col-span-2">
                            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
                            <div class="mt-1 relative rounded-md shadow-sm">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span class="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    id="price"
                                    v-model="form.price"
                                    type="number"
                                    min="0"
                                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div class="col-span-6 sm:col-span-2">
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
                    </div>

                    <div>
                        <label for="listing_url" class="block text-sm font-medium text-gray-700">Listing URL</label>
                        <input
                            id="listing_url"
                            v-model="form.listing_url"
                            type="url"
                            placeholder="https://zillow.com/..."
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            id="notes"
                            v-model="form.notes"
                            rows="3"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        ></textarea>
                    </div>
                </div>

                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                    <router-link
                        to="/properties"
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
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();

const form = reactive({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    price: null,
    acreage: null,
    bedrooms: null,
    bathrooms: null,
    listing_url: '',
    notes: '',
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await api.post('/properties', form);
        router.push(`/properties/${response.data.data.id}`);
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to save property';
    } finally {
        loading.value = false;
    }
};
</script>
