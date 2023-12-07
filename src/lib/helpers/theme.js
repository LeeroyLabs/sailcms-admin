import { get } from 'svelte/store';
import { AppStore } from '@stores/app.js';

export function switchTheme()
{
    let theme = localStorage.getItem(import.meta.env.VITE_SAILCMS_THEME_TOKEN);
    theme = (theme === 'dark') ? 'light' : 'dark';
    localStorage.setItem(import.meta.env.VITE_SAILCMS_THEME_TOKEN, theme);

    AppStore.setTheme(theme);

    if (theme === 'light') {
        document.getElementsByTagName('html')[0].classList.remove('dark');
    } else {
        document.getElementsByTagName('html')[0].classList.add('dark');
    }
}

export function setThemeFromPreferences()
{
    // Fetch Storage
    let storageSetting = localStorage.getItem(import.meta.env.VITE_SAILCMS_THEME_TOKEN) || '';

    // No Storage, Get Preference, default to light
    if (storageSetting === '') {
        storageSetting = 'light';

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            storageSetting = 'dark';
        }
    }

    AppStore.setTheme(storageSetting);

    // Store
    localStorage.setItem(import.meta.env.VITE_SAILCMS_THEME_TOKEN, storageSetting);

    if (storageSetting === 'light') {
        document.getElementsByTagName('html')[0].classList.remove('dark');
    } else {
        document.getElementsByTagName('html')[0].classList.add('dark');
    }
}