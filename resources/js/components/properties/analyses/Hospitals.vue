<script setup>
import { formatRelativeDistance } from "@/helpers";

defineProps({
  hospital: {
    type: Object,
    required: true,
  }
});
</script>

<template>
    <div class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors duration-150">
        <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-900 line-clamp-1" :title="hospital.name">{{ hospital.name }}</span>
            <span class="mt-1 text-xs text-gray-500">{{ formatRelativeDistance(hospital.distance_meters) }} away</span>
        </div>
    </div>
</template>

<style scoped>

</style>
