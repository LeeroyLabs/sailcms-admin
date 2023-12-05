export const entryRoutes = [
    {
        path: '/entries/:name',
        name: 'EntryList',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/Entries.vue'),
        meta: {
            guarded: true,
            permission: 'read_entry',
            layout: 'private',
            parent: '',
            isEntries: true
        }
    },
    {
        path: '/entries/:name/:id',
        name: 'EntrySingle',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/Entry.vue'),
        meta: {
            guarded: true,
            permission: 'read_entry',
            layout: 'private',
            parent: '',
            isEntries: true
        }
    },
    {
        path: '/settings/entry-types',
        name: 'EntryTypes',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/types/EntryTypes.vue'),
        meta: {
            guarded: true,
            permission: 'read_entry_type',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/settings/entry-types/:id',
        name: 'EntryType',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/types/Type.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_entry_type',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/settings/entry-fields',
        name: 'EntryFields',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/fields/Fields.vue'),
        meta: {
            guarded: true,
            permission: 'read_entryfields',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/settings/entry-fields/:key',
        name: 'SingleEntryField',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/fields/Field.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_entryfields',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/settings/entry-layouts',
        name: 'EntryLayouts',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/layouts/EntryLayouts.vue'),
        meta: {
            guarded: true,
            permission: 'read_entry_layout',
            layout: 'private',
            parent: 'Settings'
        }
    },
    {
        path: '/settings/entry-layouts/:id',
        name: 'SingleLayout',
        component: () => import(/* webpackChunkName: "entries" */ '@/views/entries/layouts/Layout.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_entry_layout',
            layout: 'private',
            parent: 'Settings'
        }
    }
];
