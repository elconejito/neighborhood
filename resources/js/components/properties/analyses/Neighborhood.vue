<script setup>
import {computed} from "vue";

const props = defineProps({
  analysis: {
    type: Object,
    required: true,
  },
});

const nearestHouses = computed(() => {
  console.log('nearestHouses()', props.analysis);
  return props.analysis.neighbor_distance.nearest_houses;
});
const nearestHouse = computed(() => {
  return nearestHouses.value?.[0];
});

const formatRelativeDistance = (distance, unit = null) => {
  const feet = distance * 3.28084;
  const yards = feet / 3;
  const miles = yards / 1760;

  if (unit) {
    if (unit === 'ft') {
      return `${Math.round(feet)} ft`;
    } else if (unit === 'yd') {
      return `${Math.round(yards)} yd`;
    } else if (unit === 'mi') {
      return `${miles.toFixed(1)} mi`;
    }
  }

  if (feet < 150) {
    return `${Math.round(feet)} ft`;
  } else if (miles < 1) {
    return `${Math.round(yards)} yd`;
  } else {
    return `${miles.toFixed(1)} mi`;
  }
}
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
      <div v-if="nearestHouses.length" class="grid grid-cols-3 gap-4">
        <div>
          <p class="text-2xl">
            <span class="font-bold text-gray-900">{{ formatRelativeDistance(nearestHouse.distance_meters) }}</span>
            <span class="ml-2">{{ nearestHouse.direction }}</span>
          </p>
          <p class="text-sm text-gray-500">to nearest neighbor</p>
        </div>
        <ul>
          <li v-for="(house, index) in nearestHouses" :key="index" class="flex py-0.5 text-xs" >
            <span class="font-mono text-gray-900 text-right basis-16">{{ formatRelativeDistance(house.distance_meters, 'ft') }}</span>
            <span class="text-gray-500 ml-2">{{ house.direction }}</span>
          </li>
        </ul>
        <div class="space-y-1">
          <p class="text-sm text-gray-600">
            Nearby structures (1mile radius): {{ analysis.neighbor_distance.total_buildings_nearby ?? 0 }}
          </p>
          <p class="text-sm text-gray-600 capitalize">
            Isolation: {{ analysis.neighbor_distance.isolation_score }}
          </p>
          <p class="text-sm text-gray-600">
            Avg. distance (top 10): {{ analysis.neighbor_distance.average_distance_meters ? Math.round(analysis.neighbor_distance.average_distance_meters * 3.28084) : 'N/A' }} ft
          </p>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">No neighbor distance data available.</p>
    </div>
  </div>
</template>

<style scoped></style>
