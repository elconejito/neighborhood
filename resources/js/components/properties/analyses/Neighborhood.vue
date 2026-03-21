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
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6 flex items-center">
      <svg class="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <h3 class="text-lg leading-6 font-medium text-gray-900">Neighbor Distance</h3>
    </div>
    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
      <div v-if="nearestHouses.length" class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="space-y-3">
              <p class="text-2xl">
                  <span class="font-bold text-gray-900">{{ formatRelativeDistance(nearestHouse.distance_meters) }}</span>
                  <span class="ml-2">{{ nearestHouse.direction }}</span>
              </p>
              <p class="text-sm text-gray-500">to nearest neighbor</p>
              <ul class="text-sm text-gray-600">
                  <li>
                      Nearby structures (1mile radius): {{ neighborDistance.total_buildings_nearby ?? 0 }}
                  </li>
                  <li>
                      Isolation: {{ neighborDistance.isolation_score }}
                  </li>
                  <li>
                      Avg. distance (top 10): {{ formatRelativeDistance(neighborDistance.average_distance_meters) }}
                  </li>
              </ul>
        </div>
          <div class="space-y-1">
              <div v-if="mapData.length" class="bg-gray-50 border border-gray-200 rounded-lg p-4 relative h-96 overflow-hidden">
                  <svg :viewBox="viewBox" class="w-full h-full drop-shadow-sm">
                      <!-- Center Point (Home) -->
                      <circle cx="0" cy="0" r="5" class="fill-emerald-500 stroke-white stroke-2" />
                      <text x="0" y="-10" text-anchor="middle" class="text-[12px] font-bold fill-emerald-700">Home</text>

                      <!-- Neighbor Connections -->
                      <g v-for="(house, index) in mapData" :key="index">
                          <!-- Connection Line -->
                          <line
                              x1="0" y1="0"
                              :x2="house.x" :y2="house.y"
                              class="stroke-gray-300 stroke-1"
                              stroke-dasharray="4"
                          />

                          <!-- Neighbor Point -->
                          <circle :cx="house.x" :cy="house.y" r="4" class="fill-blue-500 stroke-white stroke-1" />

                          <!-- Distance Label -->
                          <g :transform="`translate(${house.x / 2}, ${house.y / 2})`">
                              <rect
                                  :x="-25" :y="-10"
                                  width="50" height="20"
                                  rx="4"
                                  class="fill-white/90 stroke-gray-200 stroke-1"
                              />
                              <text
                                  y="4"
                                  text-anchor="middle"
                                  class="text-[9px] font-medium fill-gray-600"
                              >
                                  {{ formatRelativeDistance(house.distance_meters, 'ft') }}
                              </text>
                          </g>

                          <!-- Direction Label at Point (Small) -->
                          <text
                              :x="house.x" :y="house.y + 12"
                              text-anchor="middle"
                              class="text-[8px] fill-gray-400 font-mono"
                          >
                              {{ house.direction }}
                          </text>
                      </g>
                  </svg>
                  <!-- Map Legend -->
                  <div class="absolute bottom-2 left-2 flex flex-col space-y-1">
                      <div class="flex items-center space-x-2">
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span class="text-[10px] text-gray-500 font-medium">Target Home</span>
                      </div>
                      <div class="flex items-center space-x-2">
                          <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span class="text-[10px] text-gray-500 font-medium">Nearest Neighbors</span>
                      </div>
                  </div>
              </div>
              <div v-else class="h-64 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-sm text-gray-400">Map data not available. Please re-run analysis.</p>
              </div>
          </div>
        <div class="space-y-1">
            <ul>
                <li v-for="(house, index) in nearestHouses" :key="index" class="flex py-0.5 text-xs">
                    <span class="font-mono text-gray-900 text-right basis-16">{{ formatRelativeDistance(house.distance_meters, 'ft') }}</span>
                    <span class="text-gray-500 ml-2">{{ house.direction }}</span>
                </li>
            </ul>

        </div>
      </div>
      <p v-else class="text-sm text-gray-500">No neighbor distance data available.</p>
    </div>
  </div>
</template>

<style scoped></style>
