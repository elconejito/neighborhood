<template>
    <div class="min-h-screen bg-surface text-on-surface flex flex-col">
        <main class="flex-grow flex items-center justify-center px-8">
            <div class="w-full max-w-[440px]">
                <!-- Header -->
                <div class="mb-12 text-center">
                    <h1 class="text-primary font-extrabold tracking-tight text-3xl mb-2">Reset Password</h1>
                    <p class="text-on-surface-variant font-medium tracking-tight">Enter your email and we'll send you a reset link.</p>
                </div>

                <!-- Card -->
                <div class="bg-surface-container-lowest p-10 rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.05)]">
                    <!-- Sent state -->
                    <div v-if="sent" class="text-center space-y-6">
                        <div class="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto">
                            <span class="material-symbols-outlined text-primary text-2xl">mark_email_read</span>
                        </div>
                        <div>
                            <p class="font-bold text-on-surface mb-1">Check your inbox</p>
                            <p class="text-sm text-on-surface-variant">We've sent a password reset link to your email address.</p>
                        </div>
                        <router-link to="/login" class="block w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 rounded-lg font-bold tracking-tight shadow-md text-center hover:shadow-lg active:scale-[0.98] transition-all">
                            Back to Sign In
                        </router-link>
                    </div>

                    <!-- Form state -->
                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                        <div v-if="error" class="bg-error-container/20 text-error px-4 py-3 rounded text-sm font-medium">
                            {{ error }}
                        </div>

                        <div class="space-y-2">
                            <label for="email" class="block text-on-surface-variant text-sm font-medium tracking-tight">Email Address</label>
                            <input
                                id="email"
                                v-model="email"
                                type="email"
                                autocomplete="email"
                                required
                                placeholder="name@neighborhood.com"
                                class="w-full bg-surface-container-highest border-none rounded px-4 py-3.5 text-on-surface placeholder:text-outline/50 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 rounded-lg font-bold tracking-tight shadow-md hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {{ loading ? 'Sending...' : 'Send Reset Link' }}
                        </button>

                        <div class="text-center">
                            <router-link to="/login" class="text-primary text-sm font-semibold hover:opacity-80 transition-opacity">
                                Back to Sign In
                            </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </main>

        <!-- Background decorations -->
        <div class="fixed top-0 right-0 -z-10 w-1/2 h-screen overflow-hidden pointer-events-none opacity-20">
            <div class="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full bg-primary-container blur-3xl"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const email = ref('');
const loading = ref(false);
const error = ref(null);
const sent = ref(false);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;
    try {
        await authStore.forgotPassword(email.value);
        sent.value = true;
    } catch (e) {
        error.value = e.response?.data?.data?.message || e.response?.data?.message || 'Failed to send reset link';
    } finally {
        loading.value = false;
    }
};
</script>
