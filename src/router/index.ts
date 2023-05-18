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

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guarding
router.beforeEach(async (to, from) =>
{
    const appStore = useAppStore();
    const url = window.location.origin + '/conf.json';

    // This is required or subpages will cause major crash (do not know why)
    appStore.setBreadcrumbs([]);
    window.baseURL = '';

    try {
        let response = await fetch(url);
        let json     = await response.json();

        let tokenStr = localStorage.getItem(import.meta.env.VITE_SAILCMS_TOKEN) || '';
        SailCMS.setConfig(json.sailcms_url, tokenStr);
        appStore.setGraphQLURL(json.sailcms_url);
        appStore.setBaseURL(json.base_url);
        appStore.setLocales(json.locales);
        window.baseURL = json.base_url;
    } catch (e) {
        appStore.showGraphQLError();
        return false;
    }

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
        window.location.href = '/dashboard';
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

export default router;
