<script setup>
import {computed} from "vue";
import {formatRelativeDistance} from "@/helpers";

const props = defineProps({
  analysis: {
    type: Object,
    required: true,
  },
});

const neighborDistance = computed(() => {
    return props.analysis.neighbor_distance;
});
const nearestHouses = computed(() => {
  return props.analysis.neighbor_distance.nearest_houses ?? [];
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
          <div class="grid grid-cols-3 border border-gray-200">
            <template v-for="(row, rowIndex) in directionGrid" :key="rowIndex">
              <template v-for="(direction, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
                <div
                  class="min-h-20 border-gray-200 p-2"
                  :class="[
                    rowIndex < 2 ? 'border-b' : '',
                    colIndex < 2 ? 'border-r' : '',
                    direction ? '' : 'bg-gray-50'
                  ]"
                >
                  <template v-if="direction">
                    <p class="text-[11px] font-semibold text-gray-500">{{ direction }}</p>
                    <p v-if="directionalNearest[direction].nearest !== null" class="text-sm font-medium text-gray-900">
                      {{ formatRelativeDistance(directionalNearest[direction].nearest, 'ft') }}
                    </p>
                    <p v-else class="text-sm text-gray-400">N/A</p>
                    <p v-if="directionalNearest[direction].count > 1" class="text-[11px] text-gray-400">
                      + {{ directionalNearest[direction].count - 1 }} more
                    </p>
                  </template>
                </div>
              </template>
            </template>
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
