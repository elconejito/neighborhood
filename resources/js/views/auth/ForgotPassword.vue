<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset your password
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Enter your email and we'll send you a reset link.
                </p>
            </div>

            <form v-if="!sent" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {{ error }}
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        autocomplete="email"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div class="flex items-center justify-between">
                    <router-link to="/login" class="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                        Back to sign in
                    </router-link>

                    <button
                        type="submit"
                        :disabled="loading"
                        class="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span v-if="loading">Sending...</span>
                        <span v-else>Send reset link</span>
                    </button>
                </div>
            </form>

            <div v-else class="mt-8 text-center">
                <div class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md">
                    We've sent a password reset link to your email.
                </div>
                <router-link to="/login" class="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-500">
                    Back to sign in
                </router-link>
            </div>
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
