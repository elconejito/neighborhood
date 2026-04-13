<template>
    <div class="min-h-screen bg-surface">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-24">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else-if="property">
            <main class="pt-8 pb-20 px-8 max-w-7xl mx-auto">
                <!-- Back link + Actions -->
                <div class="flex justify-between items-center mb-6">
                    <button @click="goBackToList" class="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">arrow_back</span> Back to catalog
                    </button>
                    <div class="flex gap-3">
                        <button
                            @click="runAnalysis"
                            :disabled="analyzing || analysisQueued"
                            class="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
                        >
                            <svg v-if="analyzing" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span v-else-if="analysisQueued" class="material-symbols-outlined text-base">check_circle</span>
                            <span v-else class="material-symbols-outlined text-base">radar</span>
                            {{ analyzing ? 'Analyzing...' : analysisQueued ? 'Analysis Queued' : 'Run Analysis' }}
                        </button>
                        <router-link
                            :to="`/neighborhoods/${route.params.neighborhoodId}/properties/${property.id}/edit`"
                            class="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        >
                            <span class="material-symbols-outlined text-base">edit</span> Edit
                        </router-link>
                        <button
                            @click="deleteProperty"
                            class="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-lg text-sm font-semibold text-error hover:bg-surface-container-high transition-colors"
                        >
                            <span class="material-symbols-outlined text-base">delete</span> Delete
                        </button>
                    </div>
                </div>

                <!-- Header Section -->
                <div class="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <div class="flex items-center gap-3 mt-1">
                            <h1 class="text-4xl font-extrabold tracking-tight text-primary">{{ property.address }}</h1>
                            <span v-if="property.is_pinned" class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-container text-primary text-[10px] font-bold uppercase tracking-widest self-center">
                                <span class="material-symbols-outlined text-sm">push_pin</span> Pinned
                            </span>
                        </div>
                        <p class="text-lg text-on-surface-variant">{{ property.city }}, {{ property.state }} {{ property.zip_code }}</p>
                    </div>
                    <div class="flex flex-wrap lg:flex-nowrap gap-8 lg:text-right items-end">
                        <div v-if="property.neighborhood" class="flex flex-col">
                            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Neighborhood</span>
                            <span class="text-2xl font-bold text-primary">{{ property.neighborhood.name }}</span>
                        </div>
                        <div v-if="property.analyzed_at" class="flex flex-col">
                            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Last Analyzed</span>
                            <span class="text-2xl font-bold text-primary">{{ formatDate(property.analyzed_at) }}</span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Last Sale Price</span>
                            <span class="text-5xl font-black tracking-tighter text-primary">{{ lastSalePrice ?? '—' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Hero Section -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <!-- Hero Image / Listing Link -->
                    <div class="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low shadow-sm flex flex-col items-center justify-center gap-3">
                        <span class="material-symbols-outlined text-outline-variant" style="font-size: 5rem;">home</span>
                        <a
                            v-if="property.listing_url"
                            :href="property.listing_url"
                            target="_blank"
                            class="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                        >
                            <span class="material-symbols-outlined text-sm">open_in_new</span> View Listing
                        </a>
                    </div>

                    <!-- Stats Column -->
                    <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
                        <!-- Core Stats Grid -->
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bedrooms</p>
                                <p class="text-2xl font-bold text-primary">{{ property.bedrooms ?? '—' }}</p>
                            </div>
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bathrooms</p>
                                <p class="text-2xl font-bold text-primary">{{ property.bathrooms ?? '—' }}</p>
                            </div>
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Square Footage</p>
                                <p class="text-2xl font-bold text-primary">{{ property.square_feet ? `${property.square_feet.toLocaleString()} sqft` : '—' }}</p>
                            </div>
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Acreage</p>
                                <p class="text-2xl font-bold text-primary">{{ property.acreage ? `${property.acreage} Acres` : '—' }}</p>
                            </div>
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Year Built</p>
                                <p class="text-2xl font-bold text-primary">{{ property.year_built ?? '—' }}</p>
                            </div>
                            <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">HOA</p>
                                <p class="text-lg font-bold text-primary">{{ property.hoa ?? '—' }}</p>
                            </div>
                        </div>

                        <!-- Utilities & Features Summary -->
                        <div class="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/20 shadow-sm">
                            <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Primary Utilities & Features</p>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-if="property.water" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">water_drop</span>
                                    <span class="text-[11px] font-bold text-primary">Water: <span class="text-on-surface-variant font-medium">{{ property.water }}</span></span>
                                </div>
                                <div v-if="property.sewer" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">plumbing</span>
                                    <span class="text-[11px] font-bold text-primary">Sewer: <span class="text-on-surface-variant font-medium">{{ property.sewer }}</span></span>
                                </div>
                                <div v-if="property.garage" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">garage</span>
                                    <span class="text-[11px] font-bold text-primary">Garage: <span class="text-on-surface-variant font-medium">{{ property.garage }} car</span></span>
                                </div>
                                <div v-if="property.basement" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">foundation</span>
                                    <span class="text-[11px] font-bold text-primary">Basement: <span class="text-on-surface-variant font-medium">{{ property.basement }}</span></span>
                                </div>
                                <div v-if="property.fireplace" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">fireplace</span>
                                    <span class="text-[11px] font-bold text-on-surface-variant font-medium">Fireplace</span>
                                </div>
                                <div v-if="property.pool" class="flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-sm text-primary">pool</span>
                                    <span class="text-[11px] font-bold text-on-surface-variant font-medium">Pool</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <!-- Left Side -->
                    <div class="lg:col-span-8 space-y-8">
                        <!-- Not yet analyzed -->
                        <div v-if="!property.analyzed_at" class="bg-surface-container-low border-l-4 border-primary/40 rounded-xl p-6">
                            <p class="text-sm text-on-surface-variant">
                                This property hasn't been analyzed yet. Click <strong class="text-primary">Run Analysis</strong> above to get neighbor distance, POI, and road accessibility data.
                            </p>
                        </div>

                        <!-- Neighborhood Proximity -->
                        <Neighborhood v-if="property.analyzed_at" :analysis="property.analysis" :property="property" :neighborhood-id="route.params.neighborhoodId" />

                        <!-- Listing Lifecycle -->
                        <ListingLifecycle
                            :property-id="property.id"
                            :neighborhood-id="route.params.neighborhoodId"
                            :initial-cycles="property.listing_cycles ?? []"
                        />
                    </div>

                    <!-- Right Sidebar -->
                    <div class="lg:col-span-4 space-y-8">
                        <!-- Nearby Infrastructure -->
                        <section v-if="property.analyzed_at" class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                            <h3 class="text-lg font-bold text-primary mb-6">Nearby Infrastructure</h3>

                            <!-- Medical & Pharmacy -->
                            <div v-if="pointsOfInterest.hospital || pointsOfInterest.pharmacy" class="mb-4">
                                <div class="flex items-center gap-2 mb-4">
                                    <span class="material-symbols-outlined text-primary text-xl">medical_services</span>
                                    <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Medical &amp; Pharmacy Hub</span>
                                </div>
                                <div v-if="pointsOfInterest.hospital?.top_3?.length" class="mb-4">
                                    <p class="text-[10px] font-bold text-primary/50 uppercase mb-2">Hospitals</p>
                                    <div class="space-y-2">
                                        <div
                                            v-for="hospital in pointsOfInterest.hospital.top_3"
                                            :key="hospital.id"
                                            class="flex justify-between items-center text-sm border-b border-surface-container-high pb-1.5"
                                        >
                                            <span class="font-bold">{{ hospital.name }}</span>
                                            <span class="text-xs text-on-surface-variant">{{ formatPoiDistance(hospital.distance_meters) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="pointsOfInterest.pharmacy?.top_3?.length">
                                    <p class="text-[10px] font-bold text-primary/50 uppercase mb-2">Pharmacies</p>
                                    <div class="space-y-2">
                                        <div
                                            v-for="pharmacy in pointsOfInterest.pharmacy.top_3"
                                            :key="pharmacy.id"
                                            class="flex justify-between items-center text-sm border-b border-surface-container-high pb-1.5"
                                        >
                                            <span class="font-bold">{{ pharmacy.name }}</span>
                                            <span class="text-xs text-on-surface-variant">{{ formatPoiDistance(pharmacy.distance_meters) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Other Amenities -->
                            <div v-if="Object.keys(otherAmenities).length" class="pt-4 border-t border-outline-variant/10 space-y-5">
                                <template v-for="(poiData, category) in otherAmenities" :key="category">
                                    <div v-if="poiData.nearest" class="flex items-center justify-between group cursor-pointer">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 bg-surface-container-low rounded flex items-center justify-center">
                                                <span class="material-symbols-outlined text-primary">{{ getCategoryIcon(category) }}</span>
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold leading-tight">{{ poiData.nearest.name }}</p>
                                                <p class="text-[10px] text-on-surface-variant uppercase">{{ formatPoiDistance(poiData.nearest.distance_meters) }}</p>
                                            </div>
                                        </div>
                                        <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
                                    </div>
                                </template>
                            </div>

                            <p v-if="!pointsOfInterest.hospital && !pointsOfInterest.pharmacy && !Object.keys(otherAmenities).length" class="text-sm text-on-surface-variant italic">
                                No POI data available.
                            </p>
                        </section>

                        <!-- Road Accessibility -->
                        <section v-if="property.analysis?.road_accessibility" class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
                            <h3 class="text-lg font-bold text-primary mb-4">Road Accessibility</h3>
                            <div class="mb-4">
                                <span
                                    :class="[
                                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-bold capitalize',
                                        ['excellent', 'good'].includes(property.analysis.road_accessibility.accessibility_score)
                                            ? 'bg-primary-container text-primary'
                                            : ['moderate', 'limited'].includes(property.analysis.road_accessibility.accessibility_score)
                                            ? 'bg-tertiary-container text-tertiary'
                                            : 'bg-error-container text-error'
                                    ]"
                                >
                                    {{ property.analysis.road_accessibility.accessibility_score }}
                                </span>
                            </div>
                            <div class="space-y-3 text-sm">
                                <div v-if="property.analysis.road_accessibility.highway?.nearest_road">
                                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Nearest Major Highway</p>
                                    <p class="font-semibold text-on-surface">
                                        {{ property.analysis.road_accessibility.highway.nearest_road.name }}
                                        <span class="text-on-surface-variant font-normal">({{ (property.analysis.road_accessibility.highway.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</span>
                                    </p>
                                </div>
                                <div v-if="property.analysis.road_accessibility.main_road?.nearest_road">
                                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Nearest Main Road</p>
                                    <p class="font-semibold text-on-surface">
                                        {{ property.analysis.road_accessibility.main_road.nearest_road.name }}
                                        <span class="text-on-surface-variant font-normal">({{ (property.analysis.road_accessibility.main_road.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</span>
                                    </p>
                                </div>
                                <div v-if="property.analysis.road_accessibility.local_road?.nearest_road">
                                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">Nearest Local Road</p>
                                    <p class="font-semibold text-on-surface">
                                        {{ property.analysis.road_accessibility.local_road.nearest_road.name }}
                                        <span class="text-on-surface-variant font-normal">({{ (property.analysis.road_accessibility.local_road.nearest_distance_meters / 1609.34).toFixed(2) }} mi)</span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <!-- Notes Archive -->
                        <div v-if="property.notes?.length" class="bg-primary p-6 rounded-xl text-on-primary shadow-lg">
                            <h3 class="text-xs font-bold uppercase tracking-widest text-on-primary/60 mb-4">Notes</h3>
                            <ul class="space-y-2">
                                <li
                                    v-for="note in property.notes"
                                    :key="note.id"
                                    class="flex items-start gap-3 p-2 hover:bg-white/10 rounded cursor-pointer transition-colors border border-white/5"
                                >
                                    <span class="material-symbols-outlined mt-0.5 shrink-0">description</span>
                                    <div class="min-w-0">
                                        <span class="text-sm font-medium block truncate">{{ note.content }}</span>
                                        <span class="text-[10px] text-on-primary/60">{{ formatDate(note.created_at) }}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';
import { formatRelativeDistance } from '@/helpers';
import Neighborhood from '@/components/properties/analyses/Neighborhood.vue';
import ListingLifecycle from '@/components/properties/ListingLifecycle.vue';

const router = useRouter();
const route = useRoute();

function goBackToList() {
    const neighborhoodId = route.params.neighborhoodId;
    const prev = window.history.state?.back ?? '';
    const base = `/neighborhoods/${neighborhoodId}/properties`;
    if (prev === base || prev.startsWith(`${base}?`)) {
        router.back();
    } else {
        router.push(base);
    }
}

const property = ref(null);
const loading = ref(true);
const analyzing = ref(false);
const analysisQueued = ref(false);

const pointsOfInterest = computed(() => property.value?.analysis?.points_of_interest ?? {});

const otherAmenities = computed(() => {
    const excluded = ['hospital', 'pharmacy'];
    const poi = property.value?.analysis?.points_of_interest;
    if (!poi || typeof poi !== 'object' || Array.isArray(poi)) return {};
    return Object.fromEntries(
        Object.entries(poi).filter(([category]) => !excluded.includes(category)),
    );
});

const categoryIcons = {
    school: 'school',
    university: 'school',
    college: 'school',
    grocery: 'shopping_basket',
    supermarket: 'shopping_basket',
    restaurant: 'restaurant',
    park: 'park',
    gym: 'fitness_center',
    fitness: 'fitness_center',
    gas_station: 'local_gas_station',
    bank: 'account_balance',
    coffee: 'coffee',
    cafe: 'coffee',
    shopping_mall: 'shopping_bag',
    convenience: 'store',
};

const getCategoryIcon = (category) => categoryIcons[category.toLowerCase()] ?? 'place';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' });
const formatPoiDistance = (meters) => formatRelativeDistance(meters, 'mi');

const fmtCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const lastSalePrice = computed(() => {
    const cycles = property.value?.listing_cycles ?? [];
    for (const cycle of cycles) {
        const histories = [...(cycle.price_histories ?? [])]
            .sort((a, b) => new Date(a.price_date) - new Date(b.price_date));
        if (!histories.length) continue;
        const last = histories[histories.length - 1];
        if (last.type === 'sold') return fmtCurrency.format(last.price);
    }
    return null;
});

const loadProperty = async () => {
    const { neighborhoodId, id } = route.params;
    try {
        const response = await api.get(`/neighborhoods/${neighborhoodId}/properties/${id}`);
        property.value = response.data.data;
    } catch (error) {
        console.error('Failed to load property', error);
        await router.push(`/neighborhoods/${neighborhoodId}/properties`);
    } finally {
        loading.value = false;
    }
};

const runAnalysis = async () => {
    analyzing.value = true;
    const { neighborhoodId, id } = route.params;
    try {
        await api.post(`/neighborhoods/${neighborhoodId}/properties/${id}/analyze`);
        analysisQueued.value = true;
        setTimeout(() => { analysisQueued.value = false; }, 10000);
    } catch (error) {
        console.error('Analysis failed', error);
    } finally {
        analyzing.value = false;
    }
};

const deleteProperty = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    const { neighborhoodId, id } = route.params;
    try {
        await api.delete(`/neighborhoods/${neighborhoodId}/properties/${id}`);
        router.push(`/neighborhoods/${neighborhoodId}/properties`);
    } catch (error) {
        console.error('Failed to delete property', error);
        alert('Failed to delete property.');
    }
};

onMounted(loadProperty);
</script>
