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
    },
    {
        path: '/system-logs',
        name: 'Logs',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/misc/Logs.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: 'Settings',
            settings: true
        }
    },
    {
        path: '/monitoring',
        name: 'Monitoring',
        component: () => import(/* webpackChunkName: "settings" */ '@/views/misc/Monitoring.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: 'Settings',
            settings: true
        }
    },
    {
        path: '/extras/:param',
        name: 'DynamicContent',
        component: () => import(/* webpackChunkName: "misc" */ '@/views/misc/Dynamic.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private'
        }
    },
    {
        path: '/settings/extras/:param',
        name: 'SettingsDynamicContent',
        component: () => import(/* webpackChunkName: "misc" */ '@/views/misc/Dynamic.vue'),
        meta: {
            guarded: true,
            permission: 'any',
            layout: 'private',
            parent: 'Settings',
            settings: true
        }
    }
];
