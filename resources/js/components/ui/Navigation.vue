<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isDropdownOpen = ref(false);

const userInitials = () => {
    const name = authStore.user?.name ?? '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
};

const handleLogout = async () => {
    isDropdownOpen.value = false;
    await authStore.logout();
    await router.push('/login');
};
</script>

<template>
    <nav class="w-full bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-8 h-16">
        <!-- Brand + Links -->
        <div class="flex items-center gap-8">
            <router-link to="/" class="text-xl font-bold tracking-tight text-primary">
                Neighborhood
            </router-link>
            <div class="hidden md:flex items-center gap-1">
                <router-link
                    to="/"
                    class="text-on-surface-variant font-medium px-3 py-1.5 rounded hover:bg-surface-container-low transition-colors text-sm"
                    active-class="text-primary font-semibold"
                    :exact="true"
                >
                    Dashboard
                </router-link>
                <router-link
                    to="/properties"
                    class="text-on-surface-variant font-medium px-3 py-1.5 rounded hover:bg-surface-container-low transition-colors text-sm"
                    active-class="text-primary font-semibold"
                >
                    Properties
                </router-link>
                <router-link
                    to="/neighborhoods"
                    class="text-on-surface-variant font-medium px-3 py-1.5 rounded hover:bg-surface-container-low transition-colors text-sm"
                    active-class="text-primary font-semibold"
                >
                    Neighborhoods
                </router-link>
                <router-link
                    to="/teams"
                    class="text-on-surface-variant font-medium px-3 py-1.5 rounded hover:bg-surface-container-low transition-colors text-sm"
                    active-class="text-primary font-semibold"
                >
                    Team
                </router-link>
            </div>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
            <button class="material-symbols-outlined text-on-surface-variant p-2 hover:bg-surface-container-low rounded-full transition-all">
                notifications
            </button>

            <!-- User Dropdown -->
            <div class="relative">
                <button
                    @click="isDropdownOpen = !isDropdownOpen"
                    class="w-9 h-9 rounded-full bg-primary-container text-primary text-sm font-bold flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                    {{ userInitials() }}
                </button>

                <div
                    v-show="isDropdownOpen"
                    class="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.1)] z-50 overflow-hidden border border-outline-variant/10"
                >
                    <div class="px-4 py-3 border-b border-surface-container-high">
                        <p class="text-sm font-bold text-on-surface">{{ authStore.user?.name }}</p>
                        <p class="text-xs text-on-surface-variant truncate">{{ authStore.user?.email }}</p>
                    </div>
                    <div class="p-1">
                        <router-link
                            to="/neighborhoods"
                            @click="isDropdownOpen = false"
                            class="flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface rounded hover:bg-surface-container-low transition-colors"
                        >
                            <span class="material-symbols-outlined text-base text-on-surface-variant">map</span>
                            Neighborhoods
                        </router-link>
                        <router-link
                            to="/teams"
                            @click="isDropdownOpen = false"
                            class="flex items-center gap-2.5 px-3 py-2 text-sm text-on-surface rounded hover:bg-surface-container-low transition-colors"
                        >
                            <span class="material-symbols-outlined text-base text-on-surface-variant">group</span>
                            Team
                        </router-link>
                        <div class="border-t border-surface-container-high my-1"></div>
                        <button
                            @click="handleLogout"
                            class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-error rounded hover:bg-error/5 transition-colors"
                        >
                            <span class="material-symbols-outlined text-base">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
