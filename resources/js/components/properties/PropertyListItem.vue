<script setup>
const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex p-4">
    <!-- Property Address -->
    <div class="basis-1/4">
      <router-link :to="`/properties/${property.id}`" class="block hover:bg-gray-50">
        <p class="font-medium text-emerald-600 truncate">
          {{ property.address }}
        </p>
        <p class="mt-1 text-sm text-gray-500">
          {{ property.city }}, {{ property.state }} {{ property.zip_code }}
          <span v-if="property.neighborhood" class="block px-2 py-0.5 bg-gray-100 rounded text-gray-600">
            {{ property.neighborhood.name ?? '-' }}
          </span>
        </p>
      </router-link>
    </div>

    <!-- Property Stats -->
    <div class="basis-5/8 flex text-sm">
      <div class="p-2">Year: {{ property.year_built ?? '-' }}</div>
      <div class="p-2">SqFt: {{ property.square_feet ?? '-' }}</div>
      <div class="p-2">Acres: {{ property.acreage ?? '-' }}</div>
      <div class="p-2">Bed/Bath: {{ property.bedrooms ?? '-' }} / {{ property.bathrooms ?? '-' }}</div>
      <div class="p-2">Garage: {{ property.garage ?? '-' }}</div>
      <div class="p-2 flex flex-col">
        <div>Basement: {{ property.basement ?? '-' }}</div>
        <div>Walkout: {{ property.basement_walkout ?? '-' }}</div>
      </div>
      <div class="p-2 flex flex-col">
        <div>Water: {{ property.water ?? '-' }}</div>
        <div>Sewer: {{ property.sewer ?? '-' }}</div>
      </div>
      <div class="p-2">HOA: {{ property.hoa ?? '-' }}</div>
    </div>

    <!-- Property Analysis Status -->
    <div class="basis-1/8 p-2">
      <span v-if="property.analyzed_at" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Analyzed
      </span>
      <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
      </span>
    </div>
  </div>
</template>
