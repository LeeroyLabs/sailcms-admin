export const publicRoutes = [
    {
        path: '/',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        meta: {
            guarded: false,
            layout: 'public'
        }
    },
    {
        path: '/forgot-password',
        name: 'Forgot',
        component: () => import(/* webpackChunkName: "login" */ '@/views/ForgotPassword.vue'),
        meta: {
            guarded: false,
            layout: 'public'
        }
    },
    {
        path: '/forgot-password/:code',
        name: 'ForgotReset',
        component: () => import(/**/ '@/views/ForgotReset.vue'),
        meta: {
            guarded: false,
            layout: 'public'
        }
    }
];
