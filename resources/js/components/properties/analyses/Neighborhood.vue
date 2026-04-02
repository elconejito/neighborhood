<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { formatRelativeDistance } from "@/helpers";
import api from "@/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  analysis: {
    type: Object,
    required: true,
  },
  property: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const refreshing = ref(false);
const refreshQueued = ref(false);

const refreshGeo = async () => {
  refreshing.value = true;
  try {
    await api.post(`/properties/${props.property.id}/geocode`);
    refreshQueued.value = true;
    setTimeout(() => { refreshQueued.value = false; }, 10000);
  } catch (error) {
    console.error('Geo refresh failed', error);
  } finally {
    refreshing.value = false;
  }
};

const centerLat = computed(() => props.property?.latitude);
const centerLng = computed(() => props.property?.longitude);
const neighborDistance = computed(() => props.analysis.neighbor_distance);
const nearestHouses = computed(() => props.analysis.neighbor_distance.nearest_houses ?? []);
const nearestHouse = computed(() => nearestHouses.value?.[0]);

// Map
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

function buildMarkers() {
  if (!map) return;
  if (markersLayer) markersLayer.clearLayers();
  else markersLayer = L.layerGroup().addTo(map);

  // Center marker
  const centerIcon = L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;background:#455f88;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Manrope,sans-serif;font-size:9px;font-weight:900;color:#f6f7ff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">A</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  L.marker([centerLat.value, centerLng.value], { icon: centerIcon, zIndexOffset: 1000 })
    .addTo(markersLayer);

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
}

onMounted(() => {
  if (!centerLat.value || !centerLng.value || !mapContainer.value) return;

  map = L.map(mapContainer.value, {
    center: [centerLat.value, centerLng.value],
    zoom: 17,
    zoomControl: true,
    attributionControl: true,
  });

  // Small attribution
  map.attributionControl.setPrefix('');

  tileLayers[activeView.value].addTo(map);
  buildMarkers();

  // Fit to include all neighbors
  const points = [
    [centerLat.value, centerLng.value],
    ...nearestHouses.value.filter(h => h.lat && h.lng).map(h => [h.lat, h.lng]),
  ];
  if (points.length > 1) {
    map.fitBounds(points, { padding: [48, 48] });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
    markersLayer = null;
  }
});

</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-8 isolate">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-primary tracking-tight">Neighbor Distance</h3>
      <div class="flex items-center gap-3">
        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Proximity Survey</span>
        <button
          @click="refreshGeo"
          :disabled="refreshing || refreshQueued"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50 bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
          :title="refreshQueued ? 'Queued' : 'Refresh geo & neighbor data'"
        >
          <span
            class="material-symbols-outlined text-sm"
            :class="{ 'animate-spin': refreshing }"
          >{{ refreshQueued ? 'check_circle' : 'refresh' }}</span>
          {{ refreshQueued ? 'Queued' : 'Refresh' }}
        </button>
      </div>
    </div>

    <div v-if="nearestHouses.length" class="space-y-4">

      <!-- Map + Neighbor List Row -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">

        <!-- Map Column -->
        <div>
          <div
            v-if="centerLat && centerLng"
            class="rounded-lg border border-outline-variant/10 relative aspect-square overflow-hidden"
          >
            <!-- Leaflet map target -->
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
              <span class="text-on-surface-variant">ASSET</span>
              <span class="text-primary ml-1">·</span>
              <span class="text-primary ml-1">{{ nearestHouses.length }} NEIGHBORS PLOTTED</span>
            </div>
          </div>
          <div v-else class="aspect-square flex items-center justify-center bg-surface-container-low rounded-lg border border-outline-variant/10">
            <p class="text-sm text-on-surface-variant">Map data not available. Please re-run analysis.</p>
          </div>
        </div>

        <!-- Neighbor List Column -->
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

      <!-- Stats Row -->
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
    <p v-else class="text-sm text-on-surface-variant">No neighbor distance data available.</p>
  </div>
</template>

<style scoped>
/* Push Leaflet attribution above the bottom edge */
:deep(.leaflet-control-attribution) {
  font-size: 9px;
  opacity: 0.7;
}
</style>
