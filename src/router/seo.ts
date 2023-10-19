export const seoRoutes = [
    {
        path: "/seo",
        name: "Seo",
        component: () =>
            import(/* webpackChunkName: "seo" */ "@/views/seo/Seo.vue"),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
    {
        path: "/seo/redirection/:id",
        name: "SeoRedirection",
        component: () =>
            import(
                /* webpackChunkName: "seoredirection" */ "@/views/seo/SeoRedirection.vue"
            ),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
];
