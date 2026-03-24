<template>
    <div class="min-h-screen bg-surface p-8">
        <!-- Editorial Header -->
        <div class="max-w-7xl mx-auto mb-12">
            <span class="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Portfolio Intel</span>
            <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Dashboard</h1>
            <p class="text-on-surface-variant max-w-2xl leading-relaxed">An overview of your portfolio activity and property performance.</p>
        </div>

        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Primary Card: Portfolio Overview (8-col) -->
            <div class="md:col-span-8 bg-primary-container/40 p-8 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                <div class="relative z-10">
                    <h3 class="text-on-primary-container text-sm font-bold uppercase tracking-widest mb-4">Portfolio Overview</h3>
                    <div class="flex items-baseline gap-3">
                        <span class="text-6xl font-black text-on-primary-container tracking-tighter">{{ stats.total_properties }}</span>
                        <span class="text-primary-dim font-medium">Total Properties</span>
                    </div>
                    <p class="mt-2 text-on-primary-container/70 text-sm">
                        {{ stats.analyzed_properties }} analyzed
                        <span v-if="stats.total_properties > 0">
                            ({{ Math.round((stats.analyzed_properties / stats.total_properties) * 100) }}%)
                        </span>
                    </p>
                </div>
                <!-- Decorative bar chart -->
                <div class="mt-8 h-32 flex items-end gap-1.5">
                    <div
                        v-for="(bar, i) in barHeights"
                        :key="i"
                        class="flex-1 rounded-t-sm bg-primary/20 transition-all"
                        :style="{ height: `${bar}%`, opacity: 0.3 + (i / barHeights.length) * 0.7 }"
                    ></div>
                    <div class="flex-1 rounded-t-sm bg-primary shadow-xl shadow-primary/20 h-full"></div>
                </div>
            </div>

            <!-- Secondary Metric Cards (4-col) -->
            <div class="md:col-span-4 flex flex-col gap-6">
                <div class="bg-surface-container-low p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Total Properties</p>
                        <p class="text-2xl font-bold text-on-surface">{{ stats.total_properties }}</p>
                    </div>
                    <div class="p-3 bg-surface-container-lowest rounded-full shadow-sm">
                        <span class="material-symbols-outlined text-primary">domain</span>
                    </div>
                </div>
                <div class="bg-surface-container-low p-6 rounded-xl flex items-center justify-between">
                    <div>
                        <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest mb-1">Analyzed</p>
                        <p class="text-2xl font-bold text-on-surface">{{ stats.analyzed_properties }}</p>
                    </div>
                    <div class="p-3 bg-surface-container-lowest rounded-full shadow-sm">
                        <span class="material-symbols-outlined text-primary">radar</span>
                    </div>
                </div>
                <div class="bg-surface-container-low p-6 rounded-xl flex flex-col gap-4">
                    <div class="flex justify-between items-center">
                        <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Analysis Coverage</p>
                        <span class="text-primary font-bold text-xs">
                            {{ stats.total_properties > 0 ? Math.round((stats.analyzed_properties / stats.total_properties) * 100) : 0 }}%
                        </span>
                    </div>
                    <div class="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                            class="h-full bg-primary rounded-full transition-all"
                            :style="{ width: `${stats.total_properties > 0 ? Math.round((stats.analyzed_properties / stats.total_properties) * 100) : 0}%` }"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity (full width) -->
            <div class="md:col-span-12 mt-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold tracking-tight text-on-surface">Recent Activity</h2>
                    <router-link to="/properties" class="text-primary font-bold text-sm hover:underline">View All Properties</router-link>
                </div>
                <div class="space-y-4">
                    <router-link
                        v-for="property in recentProperties"
                        :key="property.id"
                        :to="`/properties/${property.id}`"
                        class="group bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 hover:bg-white hover:shadow-xl hover:shadow-on-surface/5 transition-all"
                    >
                        <div class="w-16 h-16 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 flex items-center justify-center group-hover:bg-primary-container/30 transition-colors">
                            <span class="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">home</span>
                        </div>
                        <div class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                            <div class="min-w-0">
                                <h4 class="font-bold text-lg text-on-surface truncate">{{ property.address }}</h4>
                                <p class="text-sm text-on-surface-variant">{{ property.city }}, {{ property.state }}</p>
                            </div>
                            <div class="flex items-center gap-12 shrink-0">
                                <div class="text-right">
                                    <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Added</p>
                                    <p class="font-bold text-on-surface">{{ formatDate(property.created_at) }}</p>
                                </div>
                                <div class="text-right min-w-[80px]">
                                    <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Status</p>
                                    <div class="flex items-center justify-end gap-1 font-bold" :class="property.analyzed_at ? 'text-primary' : 'text-on-surface-variant'">
                                        <span class="material-symbols-outlined text-sm">{{ property.analyzed_at ? 'check_circle' : 'pending' }}</span>
                                        <span class="text-sm">{{ property.analyzed_at ? 'Analyzed' : 'Pending' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>

                    <div v-if="!recentProperties.length" class="bg-surface-container-lowest p-8 rounded-xl text-center">
                        <p class="text-on-surface-variant italic text-sm">No properties found.</p>
                        <router-link to="/properties/create" class="mt-4 inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                            <span class="material-symbols-outlined text-base">add</span> Add your first property
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Recently Sold (full width) -->
            <div v-if="stats.recently_sold?.length" class="md:col-span-12 mt-4">
                <div class="flex items-center justify-between mb-8">
                    <h2 class="text-2xl font-bold tracking-tight text-on-surface">Recent Sales</h2>
                </div>
                <div class="space-y-4">
                    <router-link
                        v-for="history in stats.recently_sold"
                        :key="history.id"
                        :to="`/properties/${history.property.id}`"
                        class="group bg-surface-container-lowest p-5 rounded-xl flex items-center gap-6 hover:bg-white hover:shadow-xl hover:shadow-on-surface/5 transition-all"
                    >
                        <div class="w-16 h-16 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                            <span class="material-symbols-outlined text-outline-variant">home</span>
                        </div>
                        <div class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                            <div class="min-w-0">
                                <h4 class="font-bold text-lg text-on-surface truncate">{{ history.property.address }}</h4>
                                <p class="text-sm text-on-surface-variant">{{ history.property.city }}, {{ history.property.state }}</p>
                            </div>
                            <div class="flex items-center gap-12 shrink-0">
                                <div class="text-right">
                                    <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Sale Price</p>
                                    <p class="font-bold text-on-surface">${{ formatPrice(history.price) }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Date</p>
                                    <p class="text-sm text-on-surface-variant">{{ formatDate(history.price_date) }}</p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/api';

const stats = ref({
    total_properties: 0,
    analyzed_properties: 0,
    recently_listed: [],
    recently_sold: [],
});

const barHeights = [15, 30, 22, 50, 40, 65, 55, 75, 70, 90];

const recentProperties = computed(() => stats.value.recently_listed ?? []);

const formatPrice = (price) => new Intl.NumberFormat('en-US').format(price);
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

onMounted(async () => {
    try {
        const response = await api.get('/dashboard/stats');
        stats.value = response.data.data;
    } catch (error) {
        console.error('Failed to load dashboard stats', error);
    }
});
</script>
