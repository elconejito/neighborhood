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
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
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

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>
