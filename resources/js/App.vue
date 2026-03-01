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

                        <div class="relative account-dropdown">
                            <button
                                @click="toggleDropdown"
                                class="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600 focus:outline-none transition duration-150 ease-in-out"
                            >
                                <div class="flex items-center space-x-2">
                                    <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <span class="hidden md:block">{{ authStore.user?.name }}</span>
                                    <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>

                            <div
                                v-show="isDropdownOpen"
                                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                            >
                                <router-link
                                    to="/neighborhoods"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    @click="isDropdownOpen = false"
                                >
                                    Manage Neighborhoods
                                </router-link>
                                <router-link
                                    to="/teams"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    @click="isDropdownOpen = false"
                                >
                                    Manage Teams
                                </router-link>
                                <div class="border-t border-gray-100"></div>
                                <button
                                    @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
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
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import api from '@/api';

const authStore = useAuthStore();
const router = useRouter();

const selectedTeamId = ref(null);
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e) => {
    if (!e.target.closest('.account-dropdown')) {
        isDropdownOpen.value = false;
    }
};

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
    window.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
    window.removeEventListener('click', closeDropdown);
});

watch(() => authStore.user?.team_id, (val) => {
    selectedTeamId.value = val;
});
</script>
