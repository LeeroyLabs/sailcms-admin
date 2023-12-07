import { AppStore } from '@stores/app.js';
import { get } from 'svelte/store';
import { SailCMS, Users } from '@graphql/';

export function authenticationGuard(isPublic)
{
    return new Promise(async (resolve, reject) =>
    {
        const token = localStorage.getItem(import.meta.env.VITE_SAILCMS_TOKEN) || "";

        if (!get(AppStore).isLoggedIn && token !== "") {
            // Check if we have a valid session
            const user = await Users.userWithToken();

            if (user) {
                AppStore.setCurrentUser(user);
                AppStore.setLoginState(true);
            }
        }

        if (token !== "" && window.location.pathname === "/") {
            // Force redirect to dashboard (we are already logged in)
            window.location.href = get(AppStore).baseURL + '/dashboard';
            //resolve(true);
            return;
        }

        if (token === '' && !isPublic) {
            window.location.href = get(AppStore).baseURL + '/';
            resolve(false);
            return;
        }

        resolve(true);
    });
}