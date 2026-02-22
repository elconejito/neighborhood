<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Neighborhoods</h1>
                <button
                    @click="openCreateModal"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                    Add Neighborhood
                </button>
            </div>

            <div v-if="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
            </div>

            <div v-else-if="neighborhoods.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
                <p class="text-gray-500 italic">No neighborhoods found. Add one to get started.</p>
            </div>

            <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
                <ul class="divide-y divide-gray-200">
                    <li v-for="neighborhood in neighborhoods" :key="neighborhood.id" class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                            <p class="text-sm font-medium text-emerald-600 truncate">{{ neighborhood.name }}</p>
                            <div class="ml-4 flex-shrink-0 flex space-x-3">
                                <button
                                    @click="openEditModal(neighborhood)"
                                    class="text-sm font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Edit
                                </button>
                                <button
                                    @click="confirmDelete(neighborhood)"
                                    class="text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <Teleport to="body">
            <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Overlay -->
                <div @click="showEditModal = false" class="fixed inset-0 bg-gray-500 opacity-75 transition-opacity" aria-hidden="true"></div>

                <!-- Modal Content -->
                <div class="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
                    <div>
                        <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                            {{ editingNeighborhood ? 'Edit Neighborhood' : 'Add Neighborhood' }}
                        </h3>
                        <div class="mt-4">
                            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                v-model="neighborhoodForm.name"
                                type="text"
                                name="name"
                                id="name"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                placeholder="e.g. Sunset Hills"
                                autofocus
                            />
                        </div>
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            @click="saveNeighborhood"
                            type="button"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none sm:col-start-2 sm:text-sm"
                        >
                            Save
                        </button>
                        <button
                            @click="showEditModal = false"
                            type="button"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                            Cancel
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
