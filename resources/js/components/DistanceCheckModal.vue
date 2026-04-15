<script setup>
import { ref, computed, reactive, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { formatRelativeDistance } from '@/helpers';
import api from '@/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const emit = defineEmits(['close']);
const router = useRouter();

// ── State ──────────────────────────────────────────────────────────────────────

const step = ref('form'); // 'form' | 'loading' | 'results'
const error = ref(null);
const result = ref(null);
const neighborhoods = ref([]);
const selectedNeighborhoodId = ref(null);

const form = reactive({
    address:  '',
    city:     '',
    state:    '',
    zip_code: '',
});

// ── Computed ───────────────────────────────────────────────────────────────────

const neighborDistance = computed(() => result.value?.neighbor_distance ?? null);
const nearestHouses = computed(() => neighborDistance.value?.nearest_houses ?? []);
const nearestHouse = computed(() => nearestHouses.value[0] ?? null);
const centerLat = computed(() => result.value?.latitude ?? null);
const centerLng = computed(() => result.value?.longitude ?? null);

// ── Map ────────────────────────────────────────────────────────────────────────

const mapContainer = ref(null);
const activeView = ref('street');
let map = null;
let markersLayer = null;

const tileLayers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri World Imagery',
        maxZoom: 19,
    }),
    topo: L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'USGS National Map',
        maxNativeZoom: 16,
        maxZoom: 19,
    }),
};

function switchLayer(view) {
    if (!map || view === activeView.value) return;
    map.removeLayer(tileLayers[activeView.value]);
    activeView.value = view;
    tileLayers[view].addTo(map);
}

function buildMap() {
    if (!mapContainer.value || !centerLat.value || !centerLng.value) return;

    map = L.map(mapContainer.value, {
        center: [centerLat.value, centerLng.value],
        zoom: 17,
        zoomControl: true,
        attributionControl: true,
    });
    map.attributionControl.setPrefix('');
    tileLayers[activeView.value].addTo(map);

    markersLayer = L.layerGroup().addTo(map);

    // Center marker
    const centerIcon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;background:#455f88;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Manrope,sans-serif;font-size:9px;font-weight:900;color:#f6f7ff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">A</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    });
    L.marker([centerLat.value, centerLng.value], { icon: centerIcon, zIndexOffset: 1000 }).addTo(markersLayer);

    // Neighbor markers
    for (const house of nearestHouses.value) {
        if (!house.lat || !house.lng) continue;
        const dist = formatRelativeDistance(house.distance_meters, 'ft');
        const icon = L.divIcon({
            className: '',
            html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <div style="width:20px;height:20px;background:white;border:1.5px solid rgba(69,95,136,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Manrope,sans-serif;font-size:7px;font-weight:800;color:#455f88;box-shadow:0 1px 4px rgba(0,0,0,0.25);">${house.direction}</div>
        <span style="font-family:Manrope,sans-serif;font-size:9px;font-weight:700;color:#1a2a3a;background:rgba(255,255,255,0.82);padding:0 3px;border-radius:2px;white-space:nowrap;">${dist}</span>
      </div>`,
            iconSize: [60, 36],
            iconAnchor: [30, 10],
        });
        L.marker([house.lat, house.lng], { icon }).addTo(markersLayer);
    }

    const points = [
        [centerLat.value, centerLng.value],
        ...nearestHouses.value.filter(h => h.lat && h.lng).map(h => [h.lat, h.lng]),
    ];
    if (points.length > 1) {
        map.fitBounds(points, { padding: [48, 48] });
    }
}

function destroyMap() {
    if (map) {
        map.remove();
        map = null;
        markersLayer = null;
    }
}

// Initialize map once the results step is rendered
watch(step, (val) => {
    if (val === 'results') {
        // Wait for DOM to be ready
        setTimeout(buildMap, 50);
    } else {
        destroyMap();
    }
});

onUnmounted(destroyMap);

// ── API calls ──────────────────────────────────────────────────────────────────

async function loadNeighborhoods() {
    try {
        const response = await api.get('/neighborhoods', { params: { per_page: 100 } });
        neighborhoods.value = response.data.data ?? [];
    } catch {
        // non-critical
    }
}

async function handleSubmit() {
    error.value = null;
    step.value = 'loading';

    try {
        const response = await api.post('/properties/distance-check', form);
        result.value = response.data.data;
        await loadNeighborhoods();
        step.value = 'results';
    } catch (e) {
        error.value = e.response?.data?.message ?? 'Failed to run distance check. Please try again.';
        step.value = 'form';
    }
}

function handleCreateProperty() {
    if (!selectedNeighborhoodId.value) return;

    router.push({
        name: 'property-create',
        params: { neighborhoodId: selectedNeighborhoodId.value },
        query: {
            address:  form.address,
            city:     form.city,
            state:    form.state,
            zip_code: form.zip_code,
        },
    });

    emit('close');
}

function reset() {
    step.value = 'form';
    result.value = null;
    error.value = null;
    selectedNeighborhoodId.value = null;
}
</script>

<template>
    <Teleport to="body">
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Overlay -->
            <div @click="$emit('close')" class="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

            <!-- Modal -->
            <div class="relative bg-surface rounded-[2rem] shadow-2xl w-full transition-all"
                :class="step === 'results' ? 'max-w-4xl' : 'max-w-lg'">

                <!-- Header -->
                <div class="flex items-center justify-between px-8 pt-8 pb-6 border-b border-outline-variant/20">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary">social_distance</span>
                        <h2 class="text-xl font-bold text-primary tracking-tight">Distance Check</h2>
                    </div>
                    <button @click="$emit('close')" class="text-on-surface-variant hover:text-on-surface transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <!-- Step: Address Form -->
                <div v-if="step === 'form'" class="px-8 py-6 space-y-5">
                    <p class="text-sm text-on-surface-variant">Enter an address to analyze the nearest neighbors and isolation score.</p>

                    <div v-if="error" class="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl text-sm">
                        {{ error }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Street Address</label>
                            <input
                                v-model="form.address"
                                type="text"
                                required
                                placeholder="123 Main St"
                                class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                            />
                        </div>

                        <div class="grid grid-cols-6 gap-3">
                            <div class="col-span-3">
                                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">City</label>
                                <input
                                    v-model="form.city"
                                    type="text"
                                    required
                                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                                />
                            </div>
                            <div class="col-span-1">
                                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">State</label>
                                <input
                                    v-model="form.state"
                                    type="text"
                                    required
                                    maxlength="2"
                                    placeholder="WV"
                                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                                />
                            </div>
                            <div class="col-span-2">
                                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">ZIP</label>
                                <input
                                    v-model="form.zip_code"
                                    type="text"
                                    required
                                    maxlength="10"
                                    class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                                />
                            </div>
                        </div>

                        <div class="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                @click="$emit('close')"
                                class="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors"
                            >
                                Analyze
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Step: Loading -->
                <div v-else-if="step === 'loading'" class="px-8 py-16 flex flex-col items-center gap-4">
                    <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                    <p class="text-sm text-on-surface-variant font-medium">Geocoding address and analyzing neighbors…</p>
                </div>

                <!-- Step: Results -->
                <div v-else-if="step === 'results' && neighborDistance" class="px-8 py-6 space-y-6">

                    <!-- Address label -->
                    <p class="text-sm font-semibold text-on-surface-variant">
                        {{ form.address }}, {{ form.city }}, {{ form.state }} {{ form.zip_code }}
                    </p>

                    <div v-if="nearestHouses.length" class="space-y-4">
                        <!-- Map + Neighbor List -->
                        <div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
                            <!-- Map -->
                            <div class="rounded-xl border border-outline-variant/20 relative aspect-square overflow-hidden">
                                <div ref="mapContainer" class="absolute inset-0 w-full h-full" />

                                <!-- Layer toggle -->
                                <div class="absolute top-3 right-3 z-[1000] flex rounded overflow-hidden shadow-sm border border-outline-variant/20">
                                    <button
                                        v-for="view in ['street', 'satellite', 'topo']"
                                        :key="view"
                                        @click="switchLayer(view)"
                                        class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors"
                                        :class="activeView === view
                                            ? 'bg-primary text-white'
                                            : 'bg-white/90 text-on-surface-variant hover:bg-white'"
                                    >
                                        {{ view === 'street' ? 'Street' : view === 'satellite' ? 'Sat' : 'Topo' }}
                                    </button>
                                </div>

                                <!-- Badge -->
                                <div class="absolute bottom-7 left-3 z-[1000] bg-white/90 px-3 py-1.5 rounded text-[10px] font-bold shadow-sm border border-outline-variant/10">
                                    <span class="text-on-surface-variant">LOCATION</span>
                                    <span class="text-primary ml-1">·</span>
                                    <span class="text-primary ml-1">{{ nearestHouses.length }} NEIGHBORS PLOTTED</span>
                                </div>
                            </div>

                            <!-- Neighbor list -->
                            <div class="w-36">
                                <p class="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-3">All Neighbors</p>
                                <div class="space-y-1">
                                    <div
                                        v-for="(house, index) in nearestHouses"
                                        :key="index"
                                        class="flex justify-between items-center text-sm border-b border-surface-container-high pb-1.5"
                                    >
                                        <span class="font-mono font-semibold text-on-surface">{{ formatRelativeDistance(house.distance_meters, 'ft') }}</span>
                                        <span class="text-xs text-on-surface-variant font-medium">{{ house.direction }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Stats row -->
                        <div class="flex gap-6 pt-2 border-t border-surface-container-high">
                            <div class="flex justify-between text-sm w-full">
                                <span class="text-on-surface-variant">Nearest neighbor</span>
                                <span class="font-semibold text-on-surface">{{ formatRelativeDistance(nearestHouse.distance_meters) }} · {{ nearestHouse.direction }}</span>
                            </div>
                            <div class="flex justify-between text-sm w-full border-l border-surface-container-high pl-6">
                                <span class="text-on-surface-variant">Nearby structures (1mi)</span>
                                <span class="font-semibold text-on-surface">{{ neighborDistance.total_buildings_nearby ?? 0 }}</span>
                            </div>
                            <div class="flex justify-between text-sm w-full border-l border-surface-container-high pl-6">
                                <span class="text-on-surface-variant">Isolation score</span>
                                <span class="font-semibold text-on-surface">{{ neighborDistance.isolation_score }}</span>
                            </div>
                            <div class="flex justify-between text-sm w-full border-l border-surface-container-high pl-6">
                                <span class="text-on-surface-variant">Avg. distance (top 10)</span>
                                <span class="font-semibold text-on-surface">{{ formatRelativeDistance(neighborDistance.average_distance_meters) }}</span>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-sm text-on-surface-variant">No neighbor data found for this location.</p>

                    <!-- Create property section -->
                    <div class="border-t border-outline-variant/20 pt-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div class="flex-1 min-w-0">
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Add to Neighborhood</label>
                            <select
                                v-model="selectedNeighborhoodId"
                                class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                            >
                                <option :value="null" disabled>Select a neighborhood…</option>
                                <option v-for="n in neighborhoods" :key="n.id" :value="n.id">{{ n.name }}</option>
                            </select>
                        </div>
                        <div class="flex gap-3 shrink-0 self-end">
                            <button
                                @click="reset"
                                class="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                            >
                                New Check
                            </button>
                            <button
                                @click="handleCreateProperty"
                                :disabled="!selectedNeighborhoodId"
                                class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-on-primary hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span class="material-symbols-outlined text-base">add_home</span>
                                Create Property
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<style scoped>
:deep(.leaflet-control-attribution) {
    font-size: 9px;
    opacity: 0.7;
}
</style>
