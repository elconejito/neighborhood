<template>
    <div class="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
            <slot name="icon">
                <svg class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </slot>
        </div>
        <h3 class="mt-2 text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="mt-1 text-sm text-gray-500 max-w-xs mx-auto">{{ description }}</p>
        <div class="mt-6">
            <slot name="action"></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
</script>
