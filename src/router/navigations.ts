export const navigationsRoutes = [
    {
        path: "/navigations",
        name: "Navigations",
        component: () =>
            import(
                /* webpackChunkName: "navigations" */ "@/views/navigations/Navigations.vue"
            ),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
    {
        path: "/navigations/:name?",
        name: "Navigation",
        component: () =>
            import(
                /* webpackChunkName: "navigations" */ "@/views/navigations/Navigation.vue"
            ),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
];
