<template>
    <div class="min-h-screen bg-gray-50">
        <nav v-if="authStore.isAuthenticated" class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <router-link to="/" class="text-xl font-bold text-emerald-600">
                            Neighborhood
                        </router-link>
                        <div class="hidden sm:ml-8 sm:flex sm:space-x-4">
                            <router-link
                                to="/properties"
                                class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-md"
                                active-class="text-emerald-600 bg-emerald-50"
                            >
                                Properties
                            </router-link>
                            <router-link
                                to="/neighborhoods"
                                class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-md"
                                active-class="text-emerald-600 bg-emerald-50"
                            >
                                Neighborhoods
                            </router-link>
                            <router-link
                                to="/teams"
                                class="px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 rounded-md"
                                active-class="text-emerald-600 bg-emerald-50"
                            >
                                Team
                            </router-link>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <!-- Team Selector -->
                        <div v-if="authStore.teams.length > 0" class="relative">
                            <select
                                v-model="selectedTeamId"
                                @change="handleTeamSwitch"
                                class="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                            >
                                <option v-for="team in authStore.teams" :key="team.id" :value="team.id">
                                    {{ team.name }}
                                </option>
                            </select>
                        </div>

                        <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
                        <button
                            @click="handleLogout"
                            class="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import api from '@/api';

const authStore = useAuthStore();
const router = useRouter();

const selectedTeamId = ref(null);

const handleTeamSwitch = async () => {
    try {
        const response = await api.post(`/teams/${selectedTeamId.value}/switch`);
        authStore.user = response.data.data.user;
        // Reload page or refresh data as needed
        window.location.reload();
    } catch (err) {
        console.error('Failed to switch team', err);
        selectedTeamId.value = authStore.user?.team_id;
    }
};

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};

onMounted(() => {
    selectedTeamId.value = authStore.user?.team_id;
});

watch(() => authStore.user?.team_id, (val) => {
    selectedTeamId.value = val;
});
</script>
