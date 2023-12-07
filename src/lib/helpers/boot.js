import { Misc, SailCMS } from '@graphql/index.js';
import { Entries } from '@graphql/lib/entries.js';
import { AppStore } from '@stores/app.js';
import { authenticationGuard } from '$lib/helpers/guard.js';

export async function loadJSON(isPublic)
{
    const url = window.location.origin + '/conf.json';

    window.baseURL = '';
    window.publicURL = '';

    // This forces the showing of the progress bar on the login page before the json is loaded
    AppStore.setGuardCheck(new Promise((resolve, reject) => {}));

    try {
        let response = await fetch(url);

        try {
            let json = await response.json();

            // Load json, setup Client
            let tokenStr = localStorage.getItem(import.meta.env.VITE_SAILCMS_TOKEN) || '';
            SailCMS.setConfig(json.sailcms_url, tokenStr, json.locales, json.base_url, json.site_id, json.navigation);

            AppStore.setGuardCheck(authenticationGuard(isPublic));

            window.baseURL = json.base_url;
            window.publicURL = json.public_url;

            // Call the basic settings from server (type data mostly)
            const types = await Entries.entryTypes(json.locales);

            AppStore.setDataTypes(types);
            AppStore.customLocales(json.strings);

            // Fetch Custom Navigation elements
            AppStore.setNavigationElements(await Misc.navigationElements(SailCMS.getLocales()))
            AppStore.setSettingsElements(await Misc.settingsElements(SailCMS.getLocales()));
            AppStore.setAppState(true);
        } catch (e) {
            console.log(e);
            console.error(`SailCMS: Cannot load json from ${url}, please make sure the json is valid.`);
        }
    } catch (e) {
        console.error(`SailCMS: Cannot load ${url}, please make sure it's present.`);
    }
}