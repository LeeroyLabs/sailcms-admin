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
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

// Types
import type { App } from "vue";
import { i18n } from "./i18n";
import { Misc, SailCMS } from "@/libs/graphql";
import { Entries } from "@/libs/graphql/lib/entries";
import { useAppStore } from "@/store/app";

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
            SailCMS.setConfig(json.sailcms_url, tokenStr, json.locales, json.base_url, json.site_id);

            window.baseURL = json.base_url;

            // Call the basic settings from server (type data mostly)
            const types = await Entries.entryTypes(json.locales);

            let router = routerInit();

            loadFonts();
            app
                .use(vuetify)
                .use(router)
                .use(pinia)
                .use(Vue3ColorPicker)
                .use(i18n);

            const store = useAppStore();
            store.setDataTypes(types);
            store.customLocales(json.strings);

            // Fetch Custom Navigation elements
            store.setNavigationElements(await Misc.navigationElements(SailCMS.getLocales()));
            store.setSettingsElements(await Misc.settingsElements(SailCMS.getLocales()));
        } catch (e) {
            console.log(e);
            console.error(`SailCMS: Cannot load json from ${url}, please make sure the json is valid.`);
        }
    } catch (e) {
        console.error(`SailCMS: Cannot load ${url}, please make sure it's present.`);
    }
}
