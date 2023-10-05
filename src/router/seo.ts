export const seoRoutes = [
    {
        path: "/seo",
        name: "Seo",
        component: () =>
            import(/* webpackChunkName: "seo" */ "@/views/seo/Seo.vue"),
        meta: {
            guarded: true,
            permission: "readwrite_category",
            layout: "private",
        },
    },
];
