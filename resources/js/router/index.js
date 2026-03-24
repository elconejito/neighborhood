import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Auth views
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';

// App views
import Dashboard from '@/views/Dashboard.vue';
import PropertyList from '@/views/properties/PropertyList.vue';
import PropertyDetail from '@/views/properties/PropertyDetail.vue';
import PropertyCreate from '@/views/properties/PropertyCreate.vue';
import PropertyEdit from '@/views/properties/PropertyEdit.vue';
import TeamManagement from '@/views/team/TeamManagement.vue';
import NeighborhoodManagement from '@/views/neighborhoods/NeighborhoodManagement.vue';

const routes = [
    // Auth routes (guest only)
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guest: true },
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: { guest: true },
    },
    {
        path: '/forgot-password',
        name: 'forgot-password',
        component: ForgotPassword,
        meta: { guest: true },
    },
    {
        path: '/reset-password/:token',
        name: 'reset-password',
        component: ResetPassword,
        meta: { guest: true },
    },

    // Protected routes
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
    {
        path: '/properties',
        name: 'properties',
        component: PropertyList,
        meta: { requiresAuth: true },
    },
    {
        path: '/properties/create',
        name: 'property-create',
        component: PropertyCreate,
        meta: { requiresAuth: true },
    },
    {
        path: '/properties/:id/edit',
        name: 'property-edit',
        component: PropertyEdit,
        meta: { requiresAuth: true },
    },
    {
        path: '/properties/:id',
        name: 'property-detail',
        component: PropertyDetail,
        meta: { requiresAuth: true },
    },
    {
        path: '/teams',
        name: 'teams',
        component: TeamManagement,
        meta: { requiresAuth: true },
    },
    {
        path: '/neighborhoods',
        name: 'neighborhoods',
        component: NeighborhoodManagement,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Initialize auth state if not done
    if (!authStore.initialized) {
        await authStore.initAuth();
    }

    const isAuthenticated = authStore.isAuthenticated;

    // Route requires auth but user is not authenticated
    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'login', query: { redirect: to.fullPath } });
    }

    // Route is for guests only but user is authenticated
    if (to.meta.guest && isAuthenticated) {
        return next({ name: 'dashboard' });
    }

    next();
});

export default router;
