export const userRoutes = [
    {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/Users.vue'),
        meta: {
            guarded: true,
            permission: 'read_user',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/users/:id',
        name: 'SingleUser',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/User.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_user',
            layout: 'private',
            parent: 'Users'
        }
    },
    {
        path: '/user-groups',
        name: 'UserGroups',
        component: () => import(/* webpackChunkName: "usergroups" */ '@/views/groups/Groups.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_group',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "roles" */ '@/views/roles/Roles.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_role',
            layout: 'private',
            parent: ''
        }
    },
    {
        path: '/roles/:id',
        name: 'SingleRole',
        component: () => import(/* webpackChunkName: "roles" */ '@/views/roles/Role.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_role',
            layout: 'private',
            parent: 'Roles'
        }
    }
]
