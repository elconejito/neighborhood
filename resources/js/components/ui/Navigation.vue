<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdown = (e) => {
  if (!e.target.closest('.account-dropdown')) {
    isDropdownOpen.value = false;
  }
};

const handleLogout = async () => {
    await authStore.logout();
    await router.push('/login');
};
</script>

<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="text-xl font-bold text-emerald-600">
            N
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
          <div class="relative account-dropdown">
            <button
              @click="toggleDropdown"
              class="flex items-center text-sm font-medium text-gray-700 hover:text-emerald-600 focus:outline-none transition duration-150 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span class="hidden md:block">{{ authStore.user?.name }}</span>
              <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
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
</template>
