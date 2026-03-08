<script setup>
import { formatRelativeDistance } from "@/helpers";
import { computed } from 'vue';

const props = defineProps({
  hospitals: {
    type: Object,
    required: true,
  },
  pharmacies: {
    type: Object,
    required: true,
  }
});

const nearestHospitals = computed(() => {
  return props.hospitals.top_3;
});

const nearestPharmacies = computed(() => {
  return props.pharmacies.top_3;
});

</script>

<template>
  <div class="px-4 py-4 sm:px-6">
    <h4 class="text-sm font-medium text-gray-700 capitalize mb-2">Hospitals</h4>
    <div v-if="nearestHospitals.length" class="grid grid-cols-3 gap-4">
      <div v-for="(poi) in nearestHospitals">
        <p class="text-gray-900">{{ poi.name }}</p>
        <p class="text-gray-500 text-sm">{{ formatRelativeDistance(poi.distance_meters) }}</p>
      </div>
      <p v-if="hospitals.count > 3" class="mt-1 text-xs text-gray-400">+ {{ hospitals.count - 1 }} more in area</p>
    </div>
    <h4 class="text-sm font-medium text-gray-700 capitalize mb-2">Pharmacies</h4>
    <div v-if="nearestPharmacies.length" class="grid grid-cols-3 gap-4">
      <div v-for="(poi) in nearestPharmacies">
        <p class="text-gray-900">{{ poi.name }}</p>
        <p class="text-gray-500 text-sm">{{ formatRelativeDistance(poi.distance_meters) }}</p>
      </div>
      <p v-if="pharmacies.count > 3" class="mt-1 text-xs text-gray-400">+ {{ pharmacies.count - 1 }} more in area</p>
    </div>
  </div>
</template>

<style scoped>

</style>
