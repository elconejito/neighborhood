<script setup>
import { formatRelativeDistance } from "@/helpers";
import { computed } from 'vue';
import Hospitals from '@/components/properties/analyses/Hospitals.vue';
import Pharmacies from '@/components/properties/analyses/Pharmacies.vue';

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
    <div class="px-4 py-5 sm:px-6">
        <h4 class="text-base font-semibold text-gray-900 mb-4">Medical</h4>

        <!-- Hospitals Section -->
        <div v-if="nearestHospitals.length" class="mb-6">
            <h5 class="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Hospitals</h5>
            <div class="grid grid-cols-1 lg:grid-cols-3 border border-gray-200 rounded-lg divide-y lg:divide-y-0 lg:divide-x divide-gray-200 overflow-hidden">
                <Hospitals v-for="hospital in nearestHospitals" :hospital="hospital" :key="hospital.id" />
            </div>
            <p v-if="hospitals.count > 3" class="mt-2 text-xs text-gray-500">
                + {{ hospitals.count - 3 }} more hospitals in the area
            </p>
        </div>

        <!-- Pharmacies Section -->
        <div v-if="nearestPharmacies.length">
            <h5 class="text-sm font-medium text-gray-700 uppercase tracking-wider mb-3">Pharmacies</h5>
            <div class="grid grid-cols-1 lg:grid-cols-3 border border-gray-200 rounded-lg divide-y lg:divide-y-0 lg:divide-x divide-gray-200 overflow-hidden">
                <Pharmacies v-for="pharmacy in nearestPharmacies" :pharmacy="pharmacy" :key="pharmacy.id" />
            </div>
            <p v-if="pharmacies.count > 3" class="mt-2 text-xs text-gray-500">
                + {{ pharmacies.count - 3 }} more pharmacies in the area
            </p>
        </div>
    </div>
</template>

<style scoped>

</style>
