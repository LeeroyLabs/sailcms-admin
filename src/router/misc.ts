export const miscRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Dashboard.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/extensions',
        name: 'Extensions',
        component: () => import(/* webpackChunkName: "extensions" */ '@/views/misc/Extensions.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/settings',
        name: 'Settings',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/misc/Settings.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private'
        }
    }
];
