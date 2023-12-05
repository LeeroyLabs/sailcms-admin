import { browser } from '$app/environment';
import { addMessages, init, locale } from 'svelte-i18n';

const defaultLocale = 'en';

import enMessages from '@/locales/en.yaml';
import frMessages from '@/locales/fr.yaml';

addMessages('en', enMessages);
addMessages('fr', frMessages);

init({
    fallbackLocale: defaultLocale,
    initialLocale: browser ? window.navigator.language : defaultLocale,
});

export function initLocale()
{
    let storedLocale = localStorage.getItem('sailcms_locale');

    if (storedLocale) {
        locale.set(storedLocale);
    } else {
        locale.set('en');
    }
}