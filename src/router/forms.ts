export const formsRoutes = [
    {
        path: "/forms",
        name: "Forms",
        component: () =>
            import(/* webpackChunkName: "forms" */ "@/views/forms/Forms.vue"),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
];
