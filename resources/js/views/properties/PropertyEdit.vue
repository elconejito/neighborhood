<template>
    <div v-if="loadingInitial" class="flex items-center justify-center min-h-[400px]">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="errorInitial" class="max-w-3xl mx-auto py-12 px-8">
        <div class="bg-error/10 border border-error/20 text-error p-6 rounded-xl flex flex-col items-center gap-4">
            <span class="material-symbols-outlined text-4xl">error</span>
            <p class="font-bold tracking-tight">{{ errorInitial }}</p>
            <router-link to="/properties" class="text-sm font-bold uppercase tracking-widest hover:underline">
                Back to properties
            </router-link>
        </div>
    </div>

    <div v-else class="max-w-3xl mx-auto py-12 px-8">
        <div class="mb-10">
            <router-link :to="`/properties/${route.params.id}`" class="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 mb-4">
                <span class="material-symbols-outlined text-sm">arrow_back</span> Back to property
            </router-link>
            <h1 class="text-4xl font-extrabold tracking-tight text-primary">Edit Property</h1>
            <p class="text-on-surface-variant mt-1">Refine the architectural and financial details of this asset.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-8">
            <div v-if="error" class="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm font-bold">
                {{ error }}
            </div>

            <!-- Basic Information -->
            <section class="bg-surface-container-low p-8 rounded-xl space-y-6">
                <h2 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Location & Identity</h2>

                <div class="space-y-4">
                    <!-- Neighborhood -->
                    <div v-if="neighborhoods.length > 0">
                        <label for="neighborhood_id" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Neighborhood</label>
                        <select
                            id="neighborhood_id"
                            v-model="form.neighborhood_id"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">None</option>
                            <option v-for="neighborhood in neighborhoods" :key="neighborhood.id" :value="neighborhood.id">
                                {{ neighborhood.name }}
                            </option>
                        </select>
                    </div>

                    <!-- Pinned -->
                    <div v-if="form.neighborhood_id" class="flex flex-col gap-1.5">
                        <label for="is_pinned" class="inline-flex items-center gap-3 cursor-pointer">
                            <input
                                id="is_pinned"
                                v-model="form.is_pinned"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div class="relative w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shrink-0"></div>
                            <span class="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Pinned Property</span>
                        </label>
                        <p class="text-[10px] text-on-surface-variant">Marks this as the primary reference property for the neighborhood. Only one property can be pinned per neighborhood.</p>
                    </div>

                    <!-- Address -->
                    <div>
                        <label for="address" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Street Address *</label>
                        <input
                            id="address"
                            v-model="form.address"
                            type="text"
                            required
                            placeholder="123 Main St"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="grid grid-cols-6 gap-4">
                        <div class="col-span-6 sm:col-span-3">
                            <label for="city" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">City *</label>
                            <input
                                id="city"
                                v-model="form.city"
                                type="text"
                                required
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                            />
                        </div>

                        <div class="col-span-6 sm:col-span-1">
                            <label for="state" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">State *</label>
                            <input
                                id="state"
                                v-model="form.state"
                                type="text"
                                required
                                maxlength="2"
                                placeholder="WV"
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                            />
                        </div>

                        <div class="col-span-6 sm:col-span-2">
                            <label for="zip_code" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">ZIP Code *</label>
                            <input
                                id="zip_code"
                                v-model="form.zip_code"
                                type="text"
                                required
                                maxlength="10"
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <!-- Architectural Stats -->
            <section class="bg-surface-container-low p-8 rounded-xl space-y-6">
                <h2 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Architectural Specifications</h2>

                <div class="grid grid-cols-6 gap-4">
                    <div class="col-span-3 sm:col-span-1">
                        <label for="acreage" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Acreage</label>
                        <input
                            id="acreage"
                            v-model="form.acreage"
                            type="number"
                            step="0.01"
                            min="0"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="col-span-3 sm:col-span-1">
                        <label for="bedrooms" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Beds</label>
                        <input
                            id="bedrooms"
                            v-model="form.bedrooms"
                            type="number"
                            min="0"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="col-span-3 sm:col-span-1">
                        <label for="bathrooms" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Baths</label>
                        <input
                            id="bathrooms"
                            v-model="form.bathrooms"
                            type="number"
                            step="0.5"
                            min="0"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="col-span-3 sm:col-span-1">
                        <label for="square_feet" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Sq Ft</label>
                        <input
                            id="square_feet"
                            v-model="form.square_feet"
                            type="number"
                            min="0"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="col-span-3 sm:col-span-1">
                        <label for="year_built" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Year Built</label>
                        <input
                            id="year_built"
                            v-model="form.year_built"
                            type="number"
                            min="1700"
                            :max="new Date().getFullYear() + 5"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>

                    <div class="col-span-3 sm:col-span-1">
                        <label for="garage" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Garage</label>
                        <input
                            id="garage"
                            v-model="form.garage"
                            type="number"
                            min="0"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-6 gap-4">
                    <div class="col-span-6 sm:col-span-2">
                        <label for="basement" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Basement</label>
                        <select
                            id="basement"
                            v-model="form.basement"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">None/Unknown</option>
                            <option value="Unfinished">Unfinished</option>
                            <option value="Finished">Finished</option>
                            <option value="Partial">Partial</option>
                        </select>
                    </div>

                    <div class="col-span-6 sm:col-span-2">
                        <label for="fence" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Fence</label>
                        <select
                            id="fence"
                            v-model="form.fence"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">Unknown</option>
                            <option value="Yes">Yes</option>
                            <option value="No but allowed">No but allowed</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div class="col-span-6 sm:col-span-2">
                        <label for="deck" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Deck/Patio</label>
                        <select
                            id="deck"
                            v-model="form.deck"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">Unknown</option>
                            <option value="Screened/Covered Porch">Screened/Covered Porch</option>
                            <option value="Deck">Deck</option>
                            <option value="Patio">Patio</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                </div>
            </section>

            <!-- Utility Infrastructure -->
            <section class="bg-surface-container-low p-8 rounded-xl space-y-6">
                <h2 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Infrastructure & Utilities</h2>

                <div class="grid grid-cols-6 gap-4">
                    <div class="col-span-6 sm:col-span-2">
                        <label for="water" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Water</label>
                        <select
                            id="water"
                            v-model="form.water"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">Unknown</option>
                            <option value="Well">Well</option>
                            <option value="Public">Public</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="col-span-6 sm:col-span-2">
                        <label for="sewer" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">Sewer</label>
                        <select
                            id="sewer"
                            v-model="form.sewer"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                        >
                            <option :value="null">Unknown</option>
                            <option value="Septic">Septic</option>
                            <option value="Public">Public</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="col-span-6 sm:col-span-2">
                        <label for="hoa" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">HOA</label>
                        <select
                            id="hoa"
                            v-model="form.hoa"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
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
                    <label for="reference_hvac_type_id" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">HVAC Type</label>
                    <select
                        id="reference_hvac_type_id"
                        v-model="form.reference_hvac_type_id"
                        class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none"
                    >
                        <option :value="null">Unknown</option>
                        <option v-for="type in hvacTypes" :key="type.id" :value="type.id">
                            {{ type.label }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-6 pt-4">
                    <div class="flex items-center gap-3">
                        <div class="relative inline-flex items-center cursor-pointer">
                            <input
                                id="basement_walkout"
                                v-model="form.basement_walkout"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <label for="basement_walkout" class="ml-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Basement Walkout</label>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="relative inline-flex items-center cursor-pointer">
                            <input
                                id="fireplace"
                                v-model="form.fireplace"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <label for="fireplace" class="ml-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Fireplace</label>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="relative inline-flex items-center cursor-pointer">
                            <input
                                id="main_level_primary_bedroom"
                                v-model="form.main_level_primary_bedroom"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <label for="main_level_primary_bedroom" class="ml-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Main Level Primary Bed</label>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="relative inline-flex items-center cursor-pointer">
                            <input
                                id="pool"
                                v-model="form.pool"
                                type="checkbox"
                                class="sr-only peer"
                            />
                            <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <label for="pool" class="ml-3 text-sm font-bold text-on-surface-variant uppercase tracking-widest">Pool</label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Digital Integration -->
            <section class="bg-surface-container-low p-8 rounded-xl space-y-6">
                <h2 class="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">Market Linkage</h2>
                <div>
                    <label for="listing_url" class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1.5 ml-1">External Listing URL</label>
                    <input
                        id="listing_url"
                        v-model="form.listing_url"
                        type="url"
                        placeholder="https://redfin.com/..."
                        class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                    />
                </div>
            </section>

            <!-- Actions -->
            <div class="flex justify-end items-center gap-4 pt-4">
                <router-link
                    :to="`/properties/${route.params.id}`"
                    class="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                    Discard Changes
                </router-link>
                <button
                    type="submit"
                    :disabled="loading"
                    class="px-8 py-3 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    style="background: linear-gradient(145deg, #455f88 0%, #39537c 100%);"
                >
                    <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-on-primary border-t-transparent rounded-full"></span>
                    {{ loading ? 'Updating Asset...' : 'Update Property' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';

const router = useRouter();
const route = useRoute();

const neighborhoods = ref([]);
const hvacTypes = ref([]);
const loadingInitial = ref(true);
const errorInitial = ref(null);

const form = reactive({
    neighborhood_id: null,
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
    is_pinned: false,
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
        await api.put(`/properties/${route.params.id}`, form);
        router.push(`/properties/${route.params.id}`);
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to update property';
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    try {
        const [neighborhoodsRes, hvacTypesRes, propertyRes] = await Promise.all([
            api.get('/neighborhoods'),
            api.get('/reference/hvac-types'),
            api.get(`/properties/${route.params.id}`)
        ]);

        neighborhoods.value = neighborhoodsRes.data.data;
        hvacTypes.value = hvacTypesRes.data.data;

        const property = propertyRes.data.data;

        // Fill form with property data
        Object.keys(form).forEach(key => {
            if (Object.prototype.hasOwnProperty.call(property, key)) {
                form[key] = property[key];
            }
        });

    } catch (e) {
        console.error('Failed to load initial data', e);
        errorInitial.value = 'Failed to load property details. It may no longer exist.';
    } finally {
        loadingInitial.value = false;
    }
});
</script>
