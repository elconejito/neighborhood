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
    <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-6">
        <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-primary text-xl">medical_services</span>
            <h4 class="text-lg font-bold text-primary">Medical</h4>
        </div>

        <!-- Hospitals Section -->
        <div v-if="nearestHospitals.length" class="mb-6">
            <p class="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-3">Hospitals</p>
            <div class="space-y-2">
                <Hospitals v-for="hospital in nearestHospitals" :hospital="hospital" :key="hospital.id" />
            </div>
            <p v-if="hospitals.count > 3" class="mt-2 text-[11px] text-on-surface-variant">
                + {{ hospitals.count - 3 }} more in the area
            </p>
        </div>

        <!-- Pharmacies Section -->
        <div v-if="nearestPharmacies.length">
            <p class="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-3">Pharmacies</p>
            <div class="space-y-2">
                <Pharmacies v-for="pharmacy in nearestPharmacies" :pharmacy="pharmacy" :key="pharmacy.id" />
            </div>
            <p v-if="pharmacies.count > 3" class="mt-2 text-[11px] text-on-surface-variant">
                + {{ pharmacies.count - 3 }} more in the area
            </p>
        </div>
    </div>
</template>

<style scoped>

</style>
