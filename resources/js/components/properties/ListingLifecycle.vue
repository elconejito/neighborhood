<script setup>
import { ref, computed, watch } from 'vue';
import api from '@/api';

const props = defineProps({
    propertyId: { type: Number, required: true },
    initialCycles: { type: Array, default: () => [] },
});

// ─── Local cycles state ───────────────────────────────────────────────────────

const cycles = ref(props.initialCycles.map(normalizeCycle));
const expandedIds = ref([]);

// Sort by first price history date descending — newest listing at the top
// regardless of the order cycles were created in.
const sortedCycles = computed(() =>
    [...cycles.value].sort((a, b) => {
        const aDate = a.price_histories?.[0]?.price_date ?? a.created_at;
        const bDate = b.price_histories?.[0]?.price_date ?? b.created_at;
        return new Date(bDate) - new Date(aDate);
    })
);

// Auto-expand active (listed) cycles on initial load
watch(cycles, (all) => {
    all.filter(c => inferStatus(c) === 'listed').forEach(c => {
        if (!expandedIds.value.includes(c.id)) expandedIds.value.push(c.id);
    });
}, { immediate: true });

// ─── New cycle modal ──────────────────────────────────────────────────────────

const newCycleModalOpen = ref(false);
const newCycleForm = ref({ price: '', price_date: '' });
const newCycleSaving = ref(false);

function openNewCycleModal() {
    newCycleForm.value = { price: '', price_date: '' };
    newCycleModalOpen.value = true;
}

async function createCycleWithListing() {
    newCycleSaving.value = true;
    try {
        // Create the container cycle
        const { data: cycleData } = await api.post(`/properties/${props.propertyId}/listing-cycles`);
        const cycleId = cycleData.data.id;

        // Immediately attach the first listing event
        const { data: eventData } = await api.post(`/listing-cycles/${cycleId}/price-histories`, {
            type: 'listing',
            price: newCycleForm.value.price,
            price_date: newCycleForm.value.price_date,
        });

        const created = normalizeCycle(cycleData.data);
        created.price_histories.push(eventData.data);
        sortHistories(created);

        cycles.value.unshift(created);
        expandedIds.value.push(created.id);
        newCycleModalOpen.value = false;
    } finally {
        newCycleSaving.value = false;
    }
}

// ─── Cycle actions ────────────────────────────────────────────────────────────

async function deleteCycle(cycle) {
    const count = cycle.price_histories.length;
    if (!confirm(`Delete this listing cycle${count ? ` and its ${count} price event${count !== 1 ? 's' : ''}` : ''}?`)) return;
    await api.delete(`/listing-cycles/${cycle.id}`);
    cycles.value = cycles.value.filter(c => c.id !== cycle.id);
    expandedIds.value = expandedIds.value.filter(id => id !== cycle.id);
}

function toggleExpanded(id) {
    const idx = expandedIds.value.indexOf(id);
    if (idx === -1) expandedIds.value.push(id);
    else expandedIds.value.splice(idx, 1);
}

function isExpanded(id) {
    return expandedIds.value.includes(id);
}

// ─── Event form (inline per cycle) ───────────────────────────────────────────

const eventFormCycleId = ref(null);
const editingEventId = ref(null);
const eventFormSaving = ref(false);
const eventForm = ref(blankEventForm());

function blankEventForm() {
    return { type: 'listing', price: '', price_date: '' };
}

function openAddEvent(cycleId) {
    eventFormCycleId.value = cycleId;
    editingEventId.value = null;
    eventForm.value = blankEventForm();
}

function openEditEvent(cycleId, event) {
    eventFormCycleId.value = cycleId;
    editingEventId.value = event.id;
    eventForm.value = { type: event.type, price: event.price, price_date: event.price_date };
}

function cancelEventForm() {
    eventFormCycleId.value = null;
    editingEventId.value = null;
}

async function saveEvent(cycleId) {
    eventFormSaving.value = true;
    try {
        if (editingEventId.value) {
            const { data } = await api.put(`/price-histories/${editingEventId.value}`, eventForm.value);
            const cycle = cycles.value.find(c => c.id === cycleId);
            if (cycle) {
                const idx = cycle.price_histories.findIndex(e => e.id === data.data.id);
                if (idx !== -1) cycle.price_histories[idx] = data.data;
                sortHistories(cycle);
            }
        } else {
            const { data } = await api.post(`/listing-cycles/${cycleId}/price-histories`, eventForm.value);
            const cycle = cycles.value.find(c => c.id === cycleId);
            if (cycle) {
                cycle.price_histories.push(data.data);
                sortHistories(cycle);
            }
        }
        cancelEventForm();
    } finally {
        eventFormSaving.value = false;
    }
}

async function deleteEvent(cycleId, event) {
    if (!confirm('Remove this price event?')) return;
    await api.delete(`/price-histories/${event.id}`);
    const cycle = cycles.value.find(c => c.id === cycleId);
    if (cycle) cycle.price_histories = cycle.price_histories.filter(e => e.id !== event.id);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCycle(raw) {
    const histories = raw.price_histories?.data ?? raw.price_histories ?? [];
    const sorted = [...histories].sort((a, b) => new Date(a.price_date) - new Date(b.price_date));
    return { ...raw, price_histories: sorted };
}

function sortHistories(cycle) {
    cycle.price_histories.sort((a, b) => new Date(a.price_date) - new Date(b.price_date));
}

// Status is inferred from the last price history's type
function inferStatus(cycle) {
    const h = cycle.price_histories;
    if (!h?.length) return 'listed';
    const lastType = h[h.length - 1].type;
    if (lastType === 'sold') return 'sold';
    if (lastType === 'off_market') return 'off_market';
    return 'listed';
}

function cycleLabel(cycle, index) {
    const num = sortedCycles.value.length - index;
    const h = cycle.price_histories;
    if (!h?.length) return `Cycle ${num}`;
    const start = formatMonthYear(h[0].price_date);
    const status = inferStatus(cycle);
    const end = (status === 'sold' || status === 'off_market')
        ? formatMonthYear(h[h.length - 1].price_date)
        : 'Present';
    return `Cycle ${num}: ${start} – ${end}`;
}

function lastEvent(cycle) {
    const h = cycle.price_histories;
    return h?.length ? h[h.length - 1] : null;
}

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const formatCurrency = (v) => (v != null ? fmt.format(v) : '—');
const formatDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const formatMonthYear = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';

const eventTypeLabels = {
    listing:    'Listed',
    reduction:  'Price Drop',
    increase:   'Price Increase',
    sold:       'Sold',
    off_market: 'Off Market',
};

const eventTypeOptions = Object.entries(eventTypeLabels).map(([value, label]) => ({ value, label }));
</script>

<template>
    <section class="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm p-8">

        <!-- Section header -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-primary tracking-tight">Listing Lifecycle</h2>
            <div class="flex items-center gap-4">
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Audit Archive</span>
                <button
                    @click="openNewCycleModal"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                >
                    <span class="material-symbols-outlined text-sm">add</span>
                    Add Cycle
                </button>
            </div>
        </div>

        <!-- Timeline -->
        <div v-if="sortedCycles.length" class="space-y-8 relative">
            <div class="absolute left-[3px] top-4 bottom-4 w-0.5 bg-surface-container-high hidden md:block"></div>

            <div v-for="(cycle, index) in sortedCycles" :key="cycle.id" class="relative md:pl-10">

                <!-- Timeline dot -->
                <div
                    class="absolute left-0 top-1 w-2 h-2 rounded-full ring-4 ring-surface hidden md:block"
                    :class="inferStatus(cycle) === 'listed' ? 'bg-primary' : 'bg-outline-variant'"
                ></div>

                <!-- Cycle header: label left, status badge right — matches Stitch -->
                <div
                    class="group flex items-center justify-between mb-4"
                    :class="inferStatus(cycle) !== 'listed' ? 'cursor-pointer' : ''"
                    @click="inferStatus(cycle) !== 'listed' ? toggleExpanded(cycle.id) : null"
                >
                    <!-- Left: label + hover actions -->
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded"
                            :class="inferStatus(cycle) === 'listed' ? 'text-primary bg-surface-container-low' : 'text-on-surface-variant bg-surface-container-low'"
                        >
                            {{ cycleLabel(cycle, index) }}
                        </span>
                        <!-- Hover-only delete — invisible keeps layout, no shift -->
                        <button
                            @click.stop="deleteCycle(cycle)"
                            class="invisible group-hover:visible flex items-center p-1 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors"
                        >
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    </div>

                    <!-- Right: status badge + expand chevron for closed cycles -->
                    <div class="flex items-center gap-2">
                        <span v-if="inferStatus(cycle) === 'listed'"
                            class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            LISTED
                        </span>
                        <span v-else-if="inferStatus(cycle) === 'sold'"
                            class="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                            SOLD
                        </span>
                        <span v-else
                            class="text-xs font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant/10">
                            OFF-MARKET
                        </span>
                        <span
                            v-if="inferStatus(cycle) !== 'listed'"
                            class="material-symbols-outlined text-base text-on-surface-variant transition-transform"
                            :class="isExpanded(cycle.id) ? 'rotate-180' : ''"
                        >expand_more</span>
                    </div>
                </div>

                <!-- Collapsed summary for closed cycles -->
                <div v-if="!isExpanded(cycle.id) && inferStatus(cycle) !== 'listed'" class="text-sm text-on-surface-variant pl-0 -mt-2 mb-1">
                    <template v-if="inferStatus(cycle) === 'sold' && lastEvent(cycle)">
                        Sold for <span class="font-semibold text-primary">{{ formatCurrency(lastEvent(cycle).price) }}</span>
                        on {{ formatDate(lastEvent(cycle).price_date) }}
                    </template>
                    <template v-else-if="inferStatus(cycle) === 'off_market' && lastEvent(cycle)">
                        Off market {{ formatDate(lastEvent(cycle).price_date) }}
                    </template>
                </div>

                <!-- Expanded body -->
                <div v-if="isExpanded(cycle.id) || inferStatus(cycle) === 'listed'">

                    <!-- Price event cards — exact Stitch grid style -->
                    <div
                        v-if="cycle.price_histories.length"
                        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
                        :class="inferStatus(cycle) !== 'listed' ? 'opacity-70' : ''"
                    >
                        <div
                            v-for="event in cycle.price_histories"
                            :key="event.id"
                            class="group/card relative p-4 rounded-lg border"
                            :class="(event.type === 'sold' || event.type === 'off_market')
                                ? 'bg-primary/5 border-primary/10'
                                : 'bg-surface-container-low/30 border-outline-variant/10'"
                        >
                            <p
                                class="text-[9px] font-bold uppercase tracking-widest mb-1"
                                :class="(event.type === 'sold' || event.type === 'off_market') ? 'text-primary' : 'text-on-surface-variant'"
                            >
                                {{ eventTypeLabels[event.type] ?? event.type }}
                            </p>
                            <p class="text-xs text-on-surface-variant">{{ formatDate(event.price_date) }}</p>
                            <p class="text-sm font-bold text-primary mt-1">{{ formatCurrency(event.price) }}</p>

                            <!-- Card hover actions -->
                            <div class="absolute top-2 right-2 hidden group-hover/card:flex gap-0.5" @click.stop>
                                <button
                                    @click="openEditEvent(cycle.id, event)"
                                    class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    <span class="material-symbols-outlined text-xs">edit</span>
                                </button>
                                <button
                                    @click="deleteEvent(cycle.id, event)"
                                    class="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
                                >
                                    <span class="material-symbols-outlined text-xs">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <p v-else-if="eventFormCycleId !== cycle.id" class="text-xs text-on-surface-variant italic mb-4">
                        No events yet — add the first one below.
                    </p>

                    <!-- Inline event form -->
                    <div v-if="eventFormCycleId === cycle.id" class="bg-surface-container-low rounded-lg border border-outline-variant/10 p-4 mb-3">
                        <p class="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">
                            {{ editingEventId ? 'Edit Event' : 'New Event' }}
                        </p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Type</label>
                                <select
                                    v-model="eventForm.type"
                                    class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                                >
                                    <option v-for="opt in eventTypeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Price</label>
                                <input
                                    v-model="eventForm.price"
                                    type="number" min="0" placeholder="0"
                                    class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date</label>
                                <input
                                    v-model="eventForm.price_date"
                                    type="date"
                                    class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                        <div class="flex gap-2 mt-3">
                            <button
                                @click="saveEvent(cycle.id)"
                                :disabled="eventFormSaving"
                                class="px-4 py-1.5 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {{ eventFormSaving ? 'Saving…' : 'Save Event' }}
                            </button>
                            <button
                                @click="cancelEventForm"
                                class="px-4 py-1.5 text-on-surface-variant rounded text-xs font-bold hover:bg-surface-container-high transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <!-- Add event trigger -->
                    <button
                        v-if="eventFormCycleId !== cycle.id"
                        @click="openAddEvent(cycle.id)"
                        class="flex items-center gap-1 text-xs font-bold text-primary/50 hover:text-primary transition-colors"
                    >
                        <span class="material-symbols-outlined text-sm">add</span>
                        Add Event
                    </button>
                </div>

            </div>
        </div>

        <p v-else class="text-sm text-on-surface-variant italic">No listing cycles recorded.</p>

    </section>

    <!-- New Cycle Modal -->
    <Teleport to="body">
        <div v-if="newCycleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" @click="newCycleModalOpen = false"></div>
            <div class="relative bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-sm p-8 border border-outline-variant/20">
                <h3 class="text-lg font-bold text-primary mb-1">New Listing Cycle</h3>
                <p class="text-xs text-on-surface-variant mb-6">Enter the initial listing details. You can add price changes and the final sale afterwards.</p>

                <div class="space-y-4">
                    <div>
                        <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">List Price</label>
                        <input
                            v-model="newCycleForm.price"
                            type="number" min="0" placeholder="0"
                            class="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Listed Date</label>
                        <input
                            v-model="newCycleForm.price_date"
                            type="date"
                            class="w-full bg-surface border border-outline-variant/30 rounded-lg px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div class="flex gap-3 mt-8">
                    <button
                        @click="createCycleWithListing"
                        :disabled="newCycleSaving || !newCycleForm.price || !newCycleForm.price_date"
                        class="flex-1 px-4 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {{ newCycleSaving ? 'Creating…' : 'Create Cycle' }}
                    </button>
                    <button
                        @click="newCycleModalOpen = false"
                        class="px-4 py-2.5 text-on-surface-variant rounded-lg text-sm font-bold hover:bg-surface-container-high transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
