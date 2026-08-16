<template>
    <div class="min-h-screen bg-surface text-on-surface flex items-center justify-center p-6 sm:p-8">
        <main class="w-full max-w-xl bg-surface-container-lowest overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(43,52,55,0.05)]">
            <section class="p-8 sm:p-12 flex flex-col justify-center">
                <header class="mb-10 text-center">
                    <h1 class="text-3xl font-extrabold tracking-tight text-primary mb-6">Neighborhood</h1>
                    <h2 class="text-2xl font-extrabold text-on-surface tracking-tight">Create Your Account</h2>
                    <p class="text-on-surface-variant mt-2 text-sm">Enter your credentials to begin your bespoke journey.</p>
                </header>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Error -->
                    <div v-if="error" class="bg-error-container/20 text-error px-4 py-3 rounded text-sm font-medium">
                        {{ error }}
                    </div>

                    <!-- Full Name -->
                    <div class="space-y-2">
                        <label for="name" class="block text-xs font-bold text-on-surface-variant tracking-wider uppercase">Full Name</label>
                        <input
                            id="name"
                            v-model="form.name"
                            type="text"
                            autocomplete="name"
                            required
                            placeholder="Arthur Sterling"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                    </div>

                    <!-- Email -->
                    <div class="space-y-2">
                        <label for="email" class="block text-xs font-bold text-on-surface-variant tracking-wider uppercase">Email Address</label>
                        <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            required
                            placeholder="sterling@estate.com"
                            class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                    </div>

                    <!-- Passwords (two-column) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="password" class="block text-xs font-bold text-on-surface-variant tracking-wider uppercase">Password</label>
                            <input
                                id="password"
                                v-model="form.password"
                                type="password"
                                autocomplete="new-password"
                                required
                                placeholder="••••••••"
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                        <div class="space-y-2">
                            <label for="password_confirmation" class="block text-xs font-bold text-on-surface-variant tracking-wider uppercase">Confirm</label>
                            <input
                                id="password_confirmation"
                                v-model="form.password_confirmation"
                                type="password"
                                autocomplete="new-password"
                                required
                                placeholder="••••••••"
                                class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface text-sm placeholder:text-outline-variant focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                    </div>

                    <!-- CTA -->
                    <button
                        type="submit"
                        :disabled="loading"
                        class="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary py-4 rounded-lg font-bold tracking-tight shadow-sm hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {{ loading ? 'Creating account...' : 'Create Account' }}
                    </button>
                </form>

                <footer class="mt-10 text-center">
                    <p class="text-sm text-on-surface-variant">
                        Already registered?
                        <router-link to="/login" class="text-primary font-extrabold tracking-tight hover:underline">
                            Sign In to Dashboard
                        </router-link>
                    </p>
                </footer>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' });
const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
    loading.value = true;
    error.value = null;
    try {
        await authStore.register(form);
        router.push('/');
    } catch (e) {
        error.value = e.response?.data?.data?.message || e.response?.data?.message || 'Registration failed';
    } finally {
        loading.value = false;
    }
};
</script>
