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
]
