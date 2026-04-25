<script setup>
defineProps({
    comparison: {},
});
</script>

<template>
    <span v-if="comparison === 'up'" class="material-symbols-outlined text-primary text-[14px]">arrow_upward</span>
    <span v-else-if="comparison === 'down'" class="material-symbols-outlined text-error text-[14px]">arrow_downward</span>
    <span v-else-if="comparison === 'equal'" class="text-xs text-outline font-bold">≈</span>
</template>
