export const tasksRoutes = [
    {
        path: "/tasks",
        name: "Tasks",
        component: () =>
            import(/* webpackChunkName: "tasks" */ "@/views/tasks/Tasks.vue"),
        meta: {
            guarded: true,
            permission: "any",
            layout: "private",
        },
    },
    {
        path: "/tasks/:id",
        name: "Task",
        component: () =>
            import(/* webpackChunkName: "tasks" */ "@/views/tasks/Task.vue"),
        meta: {
            guarded: true,
            permission: "readwrite_task",
            layout: "private",
            parent: "Tasks",
        },
    },
];
