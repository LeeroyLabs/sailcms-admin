import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/store/app";
import { SailCMS, Users } from "@/libs/graphql";
import { userRoutes } from "@/router/users";
import { publicRoutes } from "@/router/public";
import { miscRoutes } from "@/router/misc";
import { hasPermission } from "@/libs/tools";

const routes = [
    ...publicRoutes,
    ...miscRoutes,
    ...userRoutes
];

function routerInit()
{
    const router = createRouter({
        history: createWebHistory(SailCMS.getBaseURL()),
        routes
    });

    // Guarding
    router.beforeEach(async (to, from) =>
    {
        const appStore = useAppStore();
        appStore.setBreadcrumbs([]);

        const token = localStorage.getItem(import.meta.env.VITE_SAILCMS_TOKEN) || '';

        if (!appStore.isLoggedIn && token !== '') {
            // Check if we have a valid session
            const user = await Users.userWithToken();

            if (user) {
                appStore.setCurrentUser(user);
                appStore.setLoginState(true);
            }
        }

        if (token !== '' && to.path === '/') {
            // Force redirect to dashboard (we are already logged in)
            window.location.href = 'dashboard';
            return true;
        }

        if (to.meta.guarded && appStore.isLoggedIn) {
            // any permission
            if (to.meta.permission === 'any') return true;

            // Check permission
            return hasPermission(to.meta.permission as string);
        } else if (to.meta.guarded) {
            localStorage.removeItem(import.meta.env.VITE_SAILCMS_TOKEN);
            window.location.href = '/';
            return false;
        }

        return true;
    });

    return router;
}


export default routerInit;
