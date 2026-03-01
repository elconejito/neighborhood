<template>
    <div class="min-h-screen bg-gray-50">
        <Navigation v-if="authStore.isAuthenticated" />

        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import api from '@/api';
import Navigation from './components/ui/Navigation.vue';

const authStore = useAuthStore();

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

</script>
