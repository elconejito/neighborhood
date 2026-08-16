<template>
    <div class="min-h-screen bg-surface p-8 md:p-12">
        <div class="max-w-5xl mx-auto">
            <!-- Header -->
            <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Tracked Neighborhoods</h1>
                    <p class="text-on-surface-variant font-medium">Monitoring residential corridors and geographic zones.</p>
                </div>
                <button
                    @click="openCreateModal"
                    class="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-3 rounded shadow-lg hover:opacity-90 transition-all flex items-center gap-2 font-semibold self-start md:self-auto"
                >
                    <span class="material-symbols-outlined">add</span>
                    Create Neighborhood
                </button>
            </header>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>

            <!-- Empty -->
            <div v-else-if="neighborhoods.length === 0" class="bg-surface-container-lowest rounded-xl p-16 text-center border border-outline-variant/10">
                <span class="material-symbols-outlined text-outline-variant text-5xl mb-4 block">map</span>
                <p class="text-on-surface-variant italic">No neighborhoods found. Add one to get started.</p>
            </div>

            <!-- Neighborhood List -->
            <div v-else class="space-y-5">
                <h2 class="text-xs font-bold text-on-surface-variant tracking-[0.2em] uppercase">Detailed Portfolio View</h2>
                <div
                    v-for="neighborhood in neighborhoods"
                    :key="neighborhood.id"
                    class="group bg-surface-container-lowest p-6 rounded-lg transition-all hover:bg-white border-l-4 border-primary"
                >
                    <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                        <!-- Icon -->
                        <div class="md:col-span-1">
                            <div class="w-12 h-12 rounded bg-primary-container/50 flex items-center justify-center">
                                <span class="material-symbols-outlined text-primary">map</span>
                            </div>
                        </div>

                        <!-- Name -->
                        <div class="md:col-span-5">
                            <router-link :to="`/neighborhoods/${neighborhood.id}/properties`" class="text-xl font-bold text-on-surface hover:text-primary transition-colors">{{ neighborhood.name }}</router-link>
                        </div>

                        <!-- Properties count placeholder -->
                        <div class="md:col-span-3">
                            <div class="text-xs text-on-surface-variant uppercase tracking-wider font-bold mb-1">Properties</div>
                            <div class="text-lg font-semibold text-primary">
                                {{ neighborhood.properties_count ?? '—' }}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="md:col-span-3 flex justify-end gap-2">
                            <router-link
                                :to="`/neighborhoods/${neighborhood.id}/properties`"
                                class="p-2 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"
                                title="View Properties"
                            >
                                <span class="material-symbols-outlined">home_work</span>
                            </router-link>
                            <router-link
                                :to="`/neighborhoods/${neighborhood.id}/dashboard`"
                                class="p-2 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"
                                title="Dashboard"
                            >
                                <span class="material-symbols-outlined">bar_chart</span>
                            </router-link>
                            <button
                                @click="openEditModal(neighborhood)"
                                class="p-2 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"
                                title="Edit"
                            >
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                @click="confirmDelete(neighborhood)"
                                class="p-2 hover:bg-error/10 hover:text-error rounded transition-colors text-on-surface-variant"
                                title="Delete"
                            >
                                <span class="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <Teleport to="body">
            <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div @click="showEditModal = false" class="fixed inset-0 bg-on-surface/20 backdrop-blur-sm"></div>
                <div class="relative bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.12)] w-full max-w-lg p-8">
                    <h3 class="text-xl font-bold text-on-surface mb-6">
                        {{ editingNeighborhood ? 'Edit Neighborhood' : 'Create Neighborhood' }}
                    </h3>
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label for="name" class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Name</label>
                            <input
                                v-model="neighborhoodForm.name"
                                type="text"
                                id="name"
                                placeholder="e.g. Sunset Hills"
                                autofocus
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-2 gap-3">
                        <button
                            @click="showEditModal = false"
                            class="w-full py-3 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-dim transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="saveNeighborhood"
                            class="w-full py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-lg font-bold text-sm shadow-sm hover:opacity-95 transition-all"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <ConfirmationModal
            :show="showConfirmModal"
            title="Delete Neighborhood"
            :message="`Are you sure you want to delete ${neighborhoodToDelete?.name}? All properties in this neighborhood will be unlinked.`"
            confirmText="Delete"
            @confirm="deleteNeighborhood"
            @cancel="showConfirmModal = false"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import ConfirmationModal from '@/components/ConfirmationModal.vue';

const neighborhoods = ref([]);
const loading = ref(true);
const showEditModal = ref(false);
const editingNeighborhood = ref(null);
const neighborhoodForm = ref({ name: '' });
const showConfirmModal = ref(false);
const neighborhoodToDelete = ref(null);

const loadNeighborhoods = async () => {
    loading.value = true;
    try {
        const response = await api.get('/neighborhoods');
        neighborhoods.value = response.data.data;
    } catch (err) {
        console.error('Failed to load neighborhoods', err);
    } finally {
        loading.value = false;
    }
};

const openCreateModal = () => {
    editingNeighborhood.value = null;
    neighborhoodForm.value.name = '';
    showEditModal.value = true;
};

const openEditModal = (neighborhood) => {
    editingNeighborhood.value = neighborhood;
    neighborhoodForm.value.name = neighborhood.name;
    showEditModal.value = true;
};

const saveNeighborhood = async () => {
    try {
        if (editingNeighborhood.value) {
            await api.put(`/neighborhoods/${editingNeighborhood.value.id}`, neighborhoodForm.value);
        } else {
            await api.post('/neighborhoods', neighborhoodForm.value);
        }
        showEditModal.value = false;
        await loadNeighborhoods();
    } catch (err) {
        console.error('Failed to save neighborhood', err);
        alert('Failed to save neighborhood.');
    }
};

const confirmDelete = (neighborhood) => {
    neighborhoodToDelete.value = neighborhood;
    showConfirmModal.value = true;
};

const deleteNeighborhood = async () => {
    if (!neighborhoodToDelete.value) return;
    try {
        await api.delete(`/neighborhoods/${neighborhoodToDelete.value.id}`);
        showConfirmModal.value = false;
        await loadNeighborhoods();
    } catch (err) {
        console.error('Failed to delete neighborhood', err);
        alert('Failed to delete neighborhood.');
    }
};

onMounted(loadNeighborhoods);
</script>
