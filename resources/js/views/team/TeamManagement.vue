<template>
    <div class="min-h-screen bg-surface p-8">
        <div class="max-w-6xl mx-auto space-y-10">

            <!-- Invite + Permissions -->
            <section class="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <!-- Invite Member + Create Team (left 3-col) -->
                <div class="lg:col-span-3 space-y-6">
                    <!-- Invite Member -->
                    <div class="bg-surface-container-low p-8 rounded-xl">
                        <h3 class="text-2xl font-bold tracking-tight text-on-surface mb-6">Invite Member</h3>
                        <form @submit.prevent="inviteMember" class="space-y-6">
                            <div>
                                <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Email Address</label>
                                <input
                                    v-model="inviteForm.email"
                                    type="email"
                                    required
                                    placeholder="e.g. manager@neighborhood.com"
                                    class="w-full bg-surface-container-highest border-none rounded-lg h-12 px-4 text-on-surface placeholder:text-outline-variant focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                />
                            </div>
                            <div v-if="error" class="bg-error-container/20 text-error px-4 py-3 rounded text-sm font-medium">{{ error }}</div>
                            <div v-if="success" class="bg-primary-container/30 text-primary px-4 py-3 rounded text-sm font-medium">{{ success }}</div>
                            <button
                                type="submit"
                                :disabled="inviting"
                                class="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary-dim transition-all shadow-md disabled:opacity-50"
                            >
                                {{ inviting ? 'Sending...' : 'Send Invite' }}
                            </button>
                        </form>
                    </div>

                    <!-- Create / Rename Team -->
                    <div class="bg-surface-container-low p-8 rounded-xl">
                        <h3 class="text-lg font-bold tracking-tight text-on-surface mb-6">Your Teams</h3>
                        <div class="space-y-3 mb-6">
                            <div
                                v-for="team in authStore.teams"
                                :key="team.id"
                                class="flex items-center justify-between bg-surface-container-lowest p-4 rounded-lg"
                            >
                                <div v-if="editingTeamId === team.id" class="flex items-center gap-3 flex-1">
                                    <input
                                        v-model="editTeamName"
                                        type="text"
                                        class="flex-1 bg-surface-container-highest border-none rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                                    />
                                    <button @click="updateTeamName(team)" class="text-xs text-primary font-bold">Save</button>
                                    <button @click="editingTeamId = null" class="text-xs text-on-surface-variant">Cancel</button>
                                </div>
                                <div v-else class="flex items-center justify-between w-full">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm font-semibold text-on-surface">{{ team.name }}</span>
                                        <span v-if="team.id === authStore.user?.team_id" class="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase tracking-wide">Active</span>
                                    </div>
                                    <button @click="startEditing(team)" class="text-xs text-on-surface-variant hover:text-primary font-medium transition-colors">Rename</button>
                                </div>
                            </div>
                        </div>
                        <form @submit.prevent="createTeam" class="flex gap-3">
                            <input
                                v-model="newTeamName"
                                type="text"
                                placeholder="New team name"
                                required
                                class="flex-1 bg-surface-container-highest border-none rounded-lg h-10 px-4 text-sm focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                            />
                            <button type="submit" class="px-4 h-10 bg-primary text-on-primary text-sm font-bold rounded-lg hover:bg-primary-dim transition-all">
                                Create
                            </button>
                        </form>
                    </div>
                </div>

                <!-- Permissions Matrix (right 2-col) -->
                <div class="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-primary/5">
                    <h4 class="font-bold text-on-surface uppercase text-xs tracking-[0.2em] mb-6">Permissions Matrix</h4>
                    <div class="space-y-4">
                        <div
                            v-for="permission in permissions"
                            :key="permission.icon"
                            class="flex items-center gap-4 p-4 hover:bg-surface transition-colors rounded-lg group"
                        >
                            <div class="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                                <span class="material-symbols-outlined text-primary group-hover:text-on-primary">{{ permission.icon }}</span>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-bold">{{ permission.title }}</p>
                                <p class="text-xs text-on-surface-variant">{{ permission.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Team Directory -->
            <section class="space-y-6">
                <div class="flex justify-between items-center border-b border-surface-container-high pb-4">
                    <h3 class="text-xl font-bold tracking-tight text-on-surface">
                        Active Members <span class="text-on-surface-variant font-normal">({{ members.length }})</span>
                    </h3>
                </div>

                <div class="grid grid-cols-1 gap-5">
                    <!-- Member Card -->
                    <div
                        v-for="member in members"
                        :key="member.id"
                        class="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-6 hover:shadow-md transition-shadow"
                    >
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                {{ memberInitials(member.name) }}
                            </div>
                            <div>
                                <h4 class="font-bold text-on-surface">{{ member.name }}</h4>
                                <p class="text-xs text-on-surface-variant">{{ member.email }}</p>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-8 items-center">
                            <div class="text-center md:text-left">
                                <span class="block text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">Role</span>
                                <span class="text-sm font-semibold px-3 py-1 rounded-full"
                                      :class="member.id === currentUserId ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'">
                                    {{ member.id === currentUserId ? 'You' : 'Member' }}
                                </span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <template v-if="member.id !== currentUserId">
                                <button
                                    @click="confirmRemove(member)"
                                    class="p-2 hover:bg-error/10 text-error rounded transition-colors"
                                    title="Remove member"
                                >
                                    <span class="material-symbols-outlined">delete_outline</span>
                                </button>
                            </template>
                            <template v-else>
                                <span class="text-xs text-on-surface-variant italic px-2">Cannot remove yourself</span>
                            </template>
                        </div>
                    </div>

                    <div v-if="!members.length" class="bg-surface-container-lowest p-8 rounded-xl text-center text-on-surface-variant italic text-sm">
                        No team members yet. Invite someone to get started.
                    </div>
                </div>
            </section>
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

const permissions = [
    { icon: 'visibility', title: 'View Valuations', description: 'Ability to see total portfolio value and equity splits.' },
    { icon: 'edit_note', title: 'Manage Properties', description: 'Create, delete or update property listings and details.' },
    { icon: 'share', title: 'Invite Others', description: 'Grant access to new team members for your estate.' },
];

const memberInitials = (name) => {
    return (name ?? '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
};

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
        success.value = 'Invitation sent successfully.';
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
