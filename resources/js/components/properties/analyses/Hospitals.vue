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
    <div class="flex justify-between items-center text-sm border-b border-surface-container-high pb-1.5">
        <span class="font-bold text-on-surface line-clamp-1" :title="hospital.name">{{ hospital.name }}</span>
        <span class="text-xs text-on-surface-variant shrink-0 ml-3">{{ formatRelativeDistance(hospital.distance_meters) }}</span>
    </div>
</template>

<style scoped>

</style>
