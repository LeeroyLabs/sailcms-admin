/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import pinia from "../store";
import routerInit from "../router";

// Types
import type { App } from "vue";
import { i18n } from "./i18n";
import { SailCMS } from "@/libs/graphql";

export async function registerPlugins(app: App)
{
    /* Get panel trigger url */
    const url = window.location.origin + '/conf.json';

    window.baseURL = '';

    try {
        let response = await fetch(url);

        try {
            let json = await response.json();

            let tokenStr = localStorage.getItem(import.meta.env.VITE_SAILCMS_TOKEN) || '';
            SailCMS.setConfig(json.sailcms_url, tokenStr, json.locales, json.base_url);
            window.baseURL = json.base_url;

            let router = routerInit();

            loadFonts();
            app
                .use(vuetify)
                .use(router)
                .use(pinia)
                .use(i18n);
        } catch (e) {
            console.error(`SailCMS: Cannot load json from ${url}, please make sure the json is valid.`);
        }
    } catch (e) {
        console.error(`SailCMS: Cannot load ${url}, please make sure it's present.`);
    }
}
