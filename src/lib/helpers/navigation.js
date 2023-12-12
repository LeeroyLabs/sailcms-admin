import { goto, preloadCode } from '$app/navigation';
import { get } from 'svelte/store';
import { AppStore } from '@stores/app.js';

export function isSectionActive(url)
{
    return window.location.href.includes(url);
}

export function linkTo(url)
{
    preloadCode([get(AppStore).baseURL + url]);
    goto(get(AppStore).baseURL + url);
}