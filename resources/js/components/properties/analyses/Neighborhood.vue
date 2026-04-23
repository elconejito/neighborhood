<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { formatRelativeDistance } from "@/helpers";
import api from "@/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  analysis: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  property: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  neighborhoodId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["location-set"]);

// Refresh neighbor analysis
const refreshing = ref(false);
const refreshQueued = ref(false);
const refreshError = ref(null);

const refreshGeo = async () => {
  refreshing.value = true;
  refreshError.value = null;
  try {
    await api.post(`/neighborhoods/${props.neighborhoodId}/properties/${props.property.id}/analyze/neighbor-distance`);
    refreshQueued.value = true;
    setTimeout(() => { refreshQueued.value = false; }, 10000);
  } catch (error) {
    const msg = error.response?.data?.message;
    refreshError.value = msg ?? 'The neighbor analysis service is busy. Please try again shortly.';
    setTimeout(() => { refreshError.value = null; }, 8000);
  } finally {
    refreshing.value = false;
  }
};

// Coordinates
const centerLat = computed(() => props.property?.latitude);
const centerLng = computed(() => props.property?.longitude);
const hasCoordinates = computed(() => !!centerLat.value && !!centerLng.value);

// Analysis data
const neighborDistance = computed(() => props.analysis?.neighbor_distance ?? null);
const nearestHouses = computed(() => props.analysis?.neighbor_distance?.nearest_houses ?? []);
const nearestHouse = computed(() => nearestHouses.value?.[0]);
const hasAnalysis = computed(() => nearestHouses.value.length > 0);

// Map
const mapContainer = ref(null);
const activeView = ref('street');
let map = null;
let markersLayer = null;
let locationMarker = null;

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

function buildMarkers() {
  if (!map || !hasCoordinates.value) return;
  if (markersLayer) markersLayer.clearLayers();
  else markersLayer = L.layerGroup().addTo(map);

  const centerIcon = L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;background:#455f88;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Manrope,sans-serif;font-size:9px;font-weight:900;color:#f6f7ff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">A</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  L.marker([centerLat.value, centerLng.value], { icon: centerIcon, zIndexOffset: 1000 }).addTo(markersLayer);

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
}

// Set Location
const settingLocation = ref(false);
const pendingLat = ref(null);
const pendingLng = ref(null);
const savingLocation = ref(false);
const locationError = ref(null);
const locationSaved = ref(false);

function enterSetLocationMode() {
  settingLocation.value = true;
  pendingLat.value = centerLat.value ?? null;
  pendingLng.value = centerLng.value ?? null;
  if (map) {
    map.getContainer().style.cursor = 'crosshair';
    map.on('click', handleMapClick);
    if (pendingLat.value && pendingLng.value) updateLocationMarker();
  }
}

function cancelSetLocation() {
  settingLocation.value = false;
  pendingLat.value = null;
  pendingLng.value = null;
  if (map) {
    map.getContainer().style.cursor = '';
    map.off('click', handleMapClick);
  }
  if (locationMarker) {
    locationMarker.remove();
    locationMarker = null;
  }
}

function handleMapClick(e) {
  pendingLat.value = e.latlng.lat;
  pendingLng.value = e.latlng.lng;
  updateLocationMarker();
}

function updateLocationMarker() {
  if (!map || !pendingLat.value || !pendingLng.value) return;
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;background:#c0392b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.5);border:2px solid white;">📍</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
  if (locationMarker) {
    locationMarker.setLatLng([pendingLat.value, pendingLng.value]);
  } else {
    locationMarker = L.marker([pendingLat.value, pendingLng.value], { icon, zIndexOffset: 2000 }).addTo(map);
  }
}

async function saveLocation() {
  if (!pendingLat.value || !pendingLng.value) return;
  savingLocation.value = true;
  locationError.value = null;
  try {
    await api.post(`/neighborhoods/${props.neighborhoodId}/properties/${props.property.id}/location`, {
      latitude: pendingLat.value,
      longitude: pendingLng.value,
    });
    settingLocation.value = false;
    locationSaved.value = true;
    if (map) {
      map.getContainer().style.cursor = '';
      map.off('click', handleMapClick);
    }
    if (locationMarker) {
      locationMarker.remove();
      locationMarker = null;
    }
    emit('location-set');
    setTimeout(() => { locationSaved.value = false; }, 10000);
  } catch {
    locationError.value = 'Failed to save location. Please try again.';
    setTimeout(() => { locationError.value = null; }, 8000);
  } finally {
    savingLocation.value = false;
  }
}

async function fetchCityCenter() {
  try {
    const city = encodeURIComponent(props.property.city ?? '');
    const state = encodeURIComponent(props.property.state ?? '');
    const zip = encodeURIComponent(props.property.zip_code ?? '');
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&postalcode=${zip}&country=US&format=json&limit=1`,
      { headers: { 'User-Agent': 'NeighborhoodApp/1.0 (contact@neighborhood.app)' } }
    );
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

onMounted(async () => {
  if (!mapContainer.value) return;

  let initLat = centerLat.value;
  let initLng = centerLng.value;
  let initZoom = 17;

  if (!initLat || !initLng) {
    const cityCenter = await fetchCityCenter();
    if (!cityCenter) return;
    initLat = cityCenter.lat;
    initLng = cityCenter.lng;
    initZoom = 14;
  }

  map = L.map(mapContainer.value, {
    center: [initLat, initLng],
    zoom: initZoom,
    zoomControl: true,
    attributionControl: true,
  });

  map.attributionControl.setPrefix('');
  tileLayers[activeView.value].addTo(map);

  if (hasCoordinates.value) {
    buildMarkers();
    const points = [
      [centerLat.value, centerLng.value],
      ...nearestHouses.value.filter(h => h.lat && h.lng).map(h => [h.lat, h.lng]),
    ];
    if (points.length > 1) {
      map.fitBounds(points, { padding: [48, 48] });
    }
  } else {
    enterSetLocationMode();
  }
});

onUnmounted(() => {
  if (map) {
    map.off('click', handleMapClick);
    map.remove();
    map = null;
    markersLayer = null;
    locationMarker = null;
  }
});
</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-8 isolate">

    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-primary tracking-tight">Neighbor Distance</h3>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Proximity Survey</span>

        <!-- Set Location button -->
        <button
          v-if="!settingLocation"
          @click="enterSetLocationMode"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          title="Manually set this property's map location"
        >
          <span class="material-symbols-outlined text-sm">edit_location</span>
          Set Location
        </button>

        <!-- Redo button (only when has analysis and not setting location) -->
        <button
          v-if="hasAnalysis && !settingLocation"
          @click="refreshGeo"
          :disabled="refreshing || refreshQueued"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          :title="refreshQueued ? 'Queued' : 'Redo neighbor analysis'"
        >
          <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': refreshing }">
            {{ refreshQueued ? 'check_circle' : 'refresh' }}
          </span>
          {{ refreshQueued ? 'Queued' : 'Redo' }}
        </button>
      </div>
    </div>

    <p v-if="refreshError" class="mb-4 text-xs text-error bg-error-container/30 rounded px-3 py-2">{{ refreshError }}</p>
    <p v-if="locationError" class="mb-4 text-xs text-error bg-error-container/30 rounded px-3 py-2">{{ locationError }}</p>
    <p v-if="locationSaved" class="mb-4 text-xs text-primary bg-primary-container/30 rounded px-3 py-2">Location saved — full analysis has been queued.</p>

    <!-- Map + Content -->
    <div class="space-y-4">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">

        <!-- Map Column -->
        <div>
          <div class="rounded-lg border border-outline-variant/10 relative aspect-square overflow-hidden">

            <!-- Leaflet target -->
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

            <!-- Set Location overlay -->
            <div v-if="settingLocation" class="absolute inset-x-0 bottom-0 z-[1000] p-3 flex flex-col gap-2">
              <p class="text-[10px] font-bold uppercase tracking-wide text-center text-white drop-shadow px-2 py-1 rounded bg-black/40">
                {{ pendingLat ? 'Click to reposition · confirm when ready' : 'Click on the map to place the pin' }}
              </p>
              <div class="flex gap-2 justify-center">
                <button
                  @click="saveLocation"
                  :disabled="savingLocation || !pendingLat"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-primary text-white hover:bg-primary/90 disabled:opacity-50 shadow transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">check</span>
                  {{ savingLocation ? 'Saving…' : 'Confirm' }}
                </button>
                <button
                  @click="cancelSetLocation"
                  :disabled="savingLocation"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-white/90 text-on-surface-variant hover:bg-white disabled:opacity-50 shadow transition-colors"
                >
                  <span class="material-symbols-outlined text-sm">close</span>
                  Cancel
                </button>
              </div>
            </div>

            <!-- Normal badge -->
            <div
              v-else-if="hasCoordinates && hasAnalysis"
              class="absolute bottom-7 left-3 z-[1000] bg-white/90 px-3 py-1.5 rounded text-[10px] font-bold shadow-sm border border-outline-variant/10"
            >
              <span class="text-on-surface-variant">ASSET</span>
              <span class="text-primary ml-1">·</span>
              <span class="text-primary ml-1">{{ nearestHouses.length }} NEIGHBORS PLOTTED</span>
            </div>
          </div>
        </div>

        <!-- Neighbor List Column (only when analysis exists) -->
        <div v-if="hasAnalysis" class="w-36">
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

      <!-- Stats Row -->
      <div v-if="hasAnalysis" class="flex gap-6 pt-2 border-t border-surface-container-high">
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

      <!-- No analysis yet -->
      <p v-else-if="hasCoordinates" class="text-sm text-on-surface-variant">
        Location is set. Run analysis to see neighbor data.
      </p>
      <p v-else class="text-sm text-on-surface-variant">
        No location set. Use the map above to place this property's pin.
      </p>
    </div>
  </div>
</template>

<style scoped>
:deep(.leaflet-control-attribution) {
  font-size: 9px;
  opacity: 0.7;
}
</style>
