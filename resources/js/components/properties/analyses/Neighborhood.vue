<script setup>
import {computed} from "vue";
import {formatRelativeDistance} from "@/helpers";

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

const centerLat = computed(() => props.property?.latitude);
const centerLng = computed(() => props.property?.longitude);

const neighborDistance = computed(() => {
    return props.analysis.neighbor_distance;
});
const nearestHouses = computed(() => {
  return props.analysis.neighbor_distance.nearest_houses ?? [];
});

const mapData = computed(() => {
    if (!centerLat.value || !centerLng.value) return [];

    // Simple Mercator-ish projection for small areas
    const latScale = 111320; // meters per degree latitude
    const lngScale = 40075000 * Math.cos(centerLat.value * Math.PI / 180) / 360; // meters per degree longitude

    return nearestHouses.value.map(house => {
        if (!house.lat || !house.lng) return null;

        const dy = (house.lat - centerLat.value) * latScale;
        const dx = (house.lng - centerLng.value) * lngScale;

        return {
            ...house,
            x: dx,
            y: -dy, // SVG y is down
        };
    }).filter(Boolean);
});

const viewBox = computed(() => {
    if (!mapData.value.length) return "-100 -100 200 200";

    const padding = 40;
    const maxDist = Math.max(...mapData.value.map(h => Math.max(Math.abs(h.x), Math.abs(h.y)))) + padding;

    return `${-maxDist} ${-maxDist} ${maxDist * 2} ${maxDist * 2}`;
});

const nearestHouse = computed(() => {
  return nearestHouses.value?.[0];
});
const directionGrid = [
  ['NW', 'N', 'NE'],
  ['W', null, 'E'],
  ['SW', 'S', 'SE'],
];
const directionalNearest = computed(() => {
  const summary = {
    NW: {nearest: null, count: 0},
    N: {nearest: null, count: 0},
    NE: {nearest: null, count: 0},
    W: {nearest: null, count: 0},
    E: {nearest: null, count: 0},
    SW: {nearest: null, count: 0},
    S: {nearest: null, count: 0},
    SE: {nearest: null, count: 0},
  };

  for (const house of nearestHouses.value) {
    const direction = house.direction?.toUpperCase();

    if (!direction || !summary[direction]) {
      continue;
    }

    summary[direction].count += 1;
    if (
      summary[direction].nearest === null ||
      house.distance_meters < summary[direction].nearest
    ) {
      summary[direction].nearest = house.distance_meters;
    }
  }

  return summary;
});

</script>

<template>
  <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-8">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-primary tracking-tight">Neighbor Distance</h3>
      <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Proximity Survey</span>
    </div>

    <div v-if="nearestHouses.length" class="space-y-4">

      <!-- Map + Neighbor List Row -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">

        <!-- Map Column -->
        <div>
          <div
            v-if="mapData.length"
            class="bg-surface-container-low rounded-lg border border-outline-variant/10 relative h-80 overflow-hidden"
            style="background-image: radial-gradient(#455f88 1px, transparent 1px); background-size: 28px 28px; background-position: center;"
          >
            <svg :viewBox="viewBox" class="absolute inset-0 w-full h-full">
              <!-- Neighbor Connections -->
              <g v-for="(house, index) in mapData" :key="index">
                <line
                  x1="0" y1="0"
                  :x2="house.x" :y2="house.y"
                  stroke="#455f88"
                  stroke-opacity="0.2"
                  stroke-width="1.5"
                  stroke-dasharray="4 4"
                />
                <g :transform="`translate(${house.x / 2}, ${house.y / 2})`">
                  <rect :x="-24" :y="-9" width="48" height="18" rx="3" fill="white" fill-opacity="0.92" stroke="#abb3b7" stroke-width="0.5" />
                  <text y="4" text-anchor="middle" font-family="Manrope" font-size="8" font-weight="700" fill="#455f88">
                    {{ formatRelativeDistance(house.distance_meters, 'ft') }}
                  </text>
                </g>
                <circle :cx="house.x" :cy="house.y" r="7" fill="white" stroke="#455f88" stroke-width="1.5" stroke-opacity="0.3" />
                <text :x="house.x" :y="house.y + 4" text-anchor="middle" font-family="Manrope" font-size="7" font-weight="800" fill="#455f88">
                  {{ house.direction }}
                </text>
              </g>
              <!-- Center Point (Home) -->
              <circle cx="0" cy="0" r="16" fill="#455f88" fill-opacity="0.08" />
              <circle cx="0" cy="0" r="10" fill="#455f88" />
              <text x="0" y="4" text-anchor="middle" font-family="Manrope" font-size="9" font-weight="900" fill="#f6f7ff">A</text>
            </svg>
            <!-- Map badge -->
            <div class="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded text-[10px] font-bold shadow-sm border border-outline-variant/10">
              <span class="text-on-surface-variant">ASSET</span>
              <span class="text-primary ml-1">·</span>
              <span class="text-primary ml-1">{{ nearestHouses.length }} NEIGHBORS PLOTTED</span>
            </div>
          </div>
          <div v-else class="h-80 flex items-center justify-center bg-surface-container-low rounded-lg border border-outline-variant/10">
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

<style scoped></style>
