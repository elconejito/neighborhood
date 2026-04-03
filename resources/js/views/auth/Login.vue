<template>
    <div class="min-h-screen bg-surface text-on-surface flex flex-col">
        <main class="flex-grow flex items-center justify-center px-8">
            <div class="w-full max-w-[440px]">
                <!-- Branding Header -->
                <div class="mb-12 text-center">
                    <h1 class="text-primary font-extrabold tracking-tight text-3xl mb-2">Sign In</h1>
                    <p class="text-on-surface-variant font-medium tracking-tight">Access your private property ledger</p>
                </div>

                <!-- Card -->
                <div class="bg-surface-container-lowest p-10 rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.05)]">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Error -->
                        <div v-if="error" class="bg-error-container/20 text-error px-4 py-3 rounded text-sm font-medium">
                            {{ error }}
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label for="email" class="block text-on-surface-variant text-sm font-medium tracking-tight">Email Address</label>
                            <input
                                id="email"
                                v-model="form.email"
                                type="email"
                                autocomplete="email"
                                required
                                placeholder="name@neighborhood.com"
                                class="w-full bg-surface-container-highest border-none rounded px-4 py-3.5 text-on-surface placeholder:text-outline/50 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-colors"
                            />
                        </div>

                        <!-- Password -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <label for="password" class="block text-on-surface-variant text-sm font-medium tracking-tight">Password</label>
                            </div>
                            <input
                                id="password"
                                v-model="form.password"
                                type="password"
                                autocomplete="current-password"
                                required
                                placeholder="••••••••"
                                class="w-full bg-surface-container-highest border-none rounded px-4 py-3.5 text-on-surface placeholder:text-outline/50 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-colors"
                            />
                            <router-link to="/forgot-password" class="text-primary text-xs font-semibold hover:opacity-80 transition-opacity">
                                Forgot Password?
                            </router-link>
                        </div>

                        <!-- CTA -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 rounded-lg font-bold tracking-tight shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ loading ? 'Signing in...' : 'Sign In' }}
                        </button>
                    </form>

                    <!-- Divider -->
                    <div class="mt-8 pt-8 border-t border-surface-container-high text-center">
                        <p class="text-on-surface-variant text-sm mb-4">New to Neighborhood?</p>
                        <router-link
                            to="/register"
                            class="block w-full bg-surface-container-high text-on-surface py-3 rounded font-semibold text-sm hover:bg-surface-dim transition-colors"
                        >
                            Create an Account
                        </router-link>
                    </div>
                </div>

                <!-- Trust badges -->
                <div class="mt-12 flex justify-center items-center gap-8 opacity-40">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">verified_user</span>
                        <span class="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Access</span>
                    </div>
                    <div class="w-1 h-1 bg-outline rounded-full"></div>
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">lock</span>
                        <span class="text-[10px] uppercase tracking-[0.2em] font-bold">Encrypted Ledger</span>
                    </div>
                </div>
            </div>
        </main>

        <footer class="p-8 text-center">
            <p class="text-[10px] text-outline uppercase tracking-widest font-medium">© {{ new Date().getFullYear() }} Neighborhood · Private Tier Access Only</p>
        </footer>

        <!-- Background decorations -->
        <div class="fixed top-0 right-0 -z-10 w-1/2 h-screen overflow-hidden pointer-events-none opacity-20">
            <div class="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-primary-container blur-3xl"></div>
        </div>
        <div class="fixed bottom-0 left-0 -z-10 w-1/3 h-1/2 overflow-hidden pointer-events-none opacity-10">
            <div class="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-secondary-container blur-3xl"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;
    try {
        await authStore.login(form);
        const redirect = route.query.redirect || '/';
        router.push(redirect);
    } catch (e) {
        error.value = e.response?.data?.data?.message || e.response?.data?.message || 'Invalid credentials';
    } finally {
        loading.value = false;
    }
};
</script>
