export const userRoutes = [
    {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "users" */ '@/views/users/Users.vue'),
        meta: {
            guarded: true,
            permission: 'read_user',
            layout: 'private'
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
            layout: 'private'
        }
    },
    {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "roles" */ '@/views/roles/Roles.vue'),
        meta: {
            guarded: true,
            permission: 'readwrite_role',
            layout: 'private'
        }
    },
]
