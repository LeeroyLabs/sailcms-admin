export const miscRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Dashboard.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private'
        }
    },
    {
        path: '/extensions',
        name: 'Extensions',
        component: () => import(/* webpackChunkName: "extensions" */ '@/views/misc/Extensions.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private'
        }
    }
];
