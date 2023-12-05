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
    {
        path: "/forms/:id",
        name: "Form",
        component: () =>
            import(/* webpackChunkName: "tasks" */ "@/views/forms/Form.vue"),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
            parent: "Forms",
        },
    },
];
