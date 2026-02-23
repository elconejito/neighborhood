<template>
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 sm:px-0">
            <h1 class="text-2xl font-bold text-gray-900 mb-6">Team Management</h1>

            <!-- Manage Teams -->
            <div class="bg-white shadow sm:rounded-lg mb-6">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Your Teams</h3>
                    <div class="mt-4 space-y-4">
                        <div v-for="team in authStore.teams" :key="team.id" class="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div v-if="editingTeamId === team.id" class="flex items-center space-x-2 w-full">
                                <input
                                    v-model="editTeamName"
                                    type="text"
                                    class="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                                <button @click="updateTeamName(team)" class="text-xs text-emerald-600 font-medium">Save</button>
                                <button @click="editingTeamId = null" class="text-xs text-gray-500 font-medium">Cancel</button>
                            </div>
                            <div v-else class="flex items-center justify-between w-full">
                                <div>
                                    <span class="text-sm font-medium text-gray-900">{{ team.name }}</span>
                                    <span v-if="team.id === authStore.user?.team_id" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Active
                                    </span>
                                </div>
                                <div class="flex space-x-3">
                                    <button @click="startEditing(team)" class="text-xs text-emerald-600 font-medium hover:text-emerald-500">Rename</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 border-t pt-6">
                        <h4 class="text-sm font-medium text-gray-900">Create New Team</h4>
                        <form @submit.prevent="createTeam" class="mt-2 sm:flex sm:items-center">
                            <div class="w-full sm:max-w-xs">
                                <input
                                    v-model="newTeamName"
                                    type="text"
                                    placeholder="Team Name"
                                    class="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Invite Member -->
            <div class="bg-white shadow sm:rounded-lg mb-6">
                <div class="px-4 py-5 sm:p-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Invite New Member</h3>
                    <div class="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Enter the email address of the user you want to invite to your team.</p>
                    </div>
                    <form @submit.prevent="inviteMember" class="mt-5 sm:flex sm:items-center">
                        <div class="w-full sm:max-w-xs">
                            <label for="email" class="sr-only">Email</label>
                            <input
                                v-model="inviteForm.email"
                                type="email"
                                name="email"
                                id="email"
                                class="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="user@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            :disabled="inviting"
                            class="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {{ inviting ? 'Inviting...' : 'Invite' }}
                        </button>
                    </form>
                    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
                    <p v-if="success" class="mt-2 text-sm text-green-600">{{ success }}</p>
                </div>
            </div>

            <!-- Members List -->
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
                </div>
                <ul class="divide-y divide-gray-200">
                    <li v-for="member in members" :key="member.id" class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col">
                                <p class="text-sm font-medium text-emerald-600 truncate">{{ member.name }}</p>
                                <p class="text-sm text-gray-500">{{ member.email }}</p>
                            </div>
                            <div v-if="member.id !== currentUserId" class="ml-4 flex-shrink-0">
                                <button
                                    @click="confirmRemove(member)"
                                    class="text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                            <div v-else class="ml-4 flex-shrink-0">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    You
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <ConfirmationModal
            :show="showConfirmModal"
            title="Remove Member"
            :message="`Are you sure you want to remove ${memberToRemove?.name} from the team?`"
            confirmText="Remove Member"
            @confirm="removeMember"
            @cancel="showConfirmModal = false"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const members = ref([]);
const currentUserId = ref(null);
const inviting = ref(false);
const inviteForm = ref({ email: '' });
const error = ref('');
const success = ref('');

const newTeamName = ref('');
const editingTeamId = ref(null);
const editTeamName = ref('');

const showConfirmModal = ref(false);
const memberToRemove = ref(null);

const createTeam = async () => {
    try {
        await api.post('/teams', { name: newTeamName.value });
        newTeamName.value = '';
        await authStore.loadTeams();
    } catch (err) {
        console.error('Failed to create team', err);
    }
};

const startEditing = (team) => {
    editingTeamId.value = team.id;
    editTeamName.value = team.name;
};

const updateTeamName = async (team) => {
    try {
        await api.put(`/teams/${team.id}`, { name: editTeamName.value });
        editingTeamId.value = null;
        await authStore.loadTeams();
    } catch (err) {
        console.error('Failed to update team name', err);
    }
};

const loadMembers = async () => {
    try {
        const response = await api.get('/teams/members');
        members.value = response.data.data;
    } catch (err) {
        console.error('Failed to load members', err);
    }
};

const inviteMember = async () => {
    inviting.value = true;
    error.value = '';
    success.value = '';
    try {
        await api.post('/teams/invite', inviteForm.value);
        success.value = 'Member invited successfully.';
        inviteForm.value.email = '';
        await loadMembers();
    } catch (err) {
        error.value = err.response?.data?.message || 'Failed to invite member.';
    } finally {
        inviting.value = false;
    }
};

const confirmRemove = (member) => {
    memberToRemove.value = member;
    showConfirmModal.value = true;
};

const removeMember = async () => {
    if (!memberToRemove.value) return;
    try {
        await api.delete(`/teams/members/${memberToRemove.value.id}`);
        showConfirmModal.value = false;
        await loadMembers();
    } catch (err) {
        console.error('Failed to remove member', err);
        alert('Failed to remove member.');
    }
};

onMounted(async () => {
    currentUserId.value = authStore.user?.id;
    await authStore.loadTeams();
    await loadMembers();
});
</script>
