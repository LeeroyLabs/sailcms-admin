export const categoriesRoutes = [
    {
        path: "/categories",
        name: "Categories",
        component: () =>
            import(
                /* webpackChunkName: "categories" */ "@/views/categories/Categories.vue"
            ),
        meta: {
            guarded: true,
            permission: "readwrite_category",
            layout: "private",
        },
    },
];
