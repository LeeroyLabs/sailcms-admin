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
            layout: 'private'
        }
    },
]
