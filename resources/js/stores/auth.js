import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/api';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || null);
    const teams = ref([]);
    const initialized = ref(false);

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    // Initialize auth state
    async function initAuth() {
        if (token.value) {
            try {
                const response = await api.get('/auth/me');
                user.value = response.data.data;
                await loadTeams();
            } catch (error) {
                // Token is invalid, clear it
                logout();
            }
        }
        initialized.value = true;
    }

    // Load user's teams
    async function loadTeams() {
        if (!token.value) return;
        try {
            const response = await api.get('/teams');
            teams.value = response.data.data;
        } catch (error) {
            console.error('Failed to load teams', error);
        }
    }

    // Login
    async function login(credentials) {
        const response = await api.post('/auth/login', credentials);
        const { access_token, user: userData } = response.data.data;

        token.value = access_token;
        user.value = userData;
        localStorage.setItem('token', access_token);

        return response.data.data;
    }

    // Register
    async function register(data) {
        const response = await api.post('/auth/register', data);
        const { access_token, user: userData } = response.data.data;

        token.value = access_token;
        user.value = userData;
        localStorage.setItem('token', access_token);

        return response.data.data;
    }

    // Logout
    async function logout() {
        try {
            if (token.value) {
                await api.post('/auth/logout');
            }
        } catch (error) {
            // Ignore errors on logout
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
        }
    }

    // Forgot password
    async function forgotPassword(email) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data.data;
    }

    // Reset password
    async function resetPassword(data) {
        const response = await api.post('/auth/reset-password', data);
        return response.data.data;
    }

    return {
        user,
        token,
        teams,
        initialized,
        isAuthenticated,
        initAuth,
        loadTeams,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
    };
});
