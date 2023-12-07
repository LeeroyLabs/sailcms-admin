import { AppStore } from '@stores/app.js';
import { get } from 'svelte/store';
import { Misc } from '@/graphql/index.js';

export function isBookmarked(url)
{
    const bookmarks = get(AppStore).currentUser.bookmarks;
    const foundPage = bookmarks.find(b => b.url === url);
    return (foundPage);
}

export async function addBookmark(url, name)
{
    await Misc.addBookmark(get(AppStore).currentUser._id, url, name);
    AppStore.addBookmark(url, name);
}

export async function removeBookmark(url)
{
    await Misc.removeBookmark(get(AppStore).currentUser._id, url);
    AppStore.removeBookmark(url);
}