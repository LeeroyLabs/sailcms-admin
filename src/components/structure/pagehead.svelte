<script>
    import { Icon } from '@steeze-ui/svelte-icon';
    import { BookmarkAdd, BookmarkAdded } from '@steeze-ui/material-design-icons';
    import { isBookmarked } from '$lib/helpers/bookmarks.js';
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css';
    import { onMount } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { addBookmark, removeBookmark } from '$lib/helpers/bookmarks.js';

    export let bookmarkable = false;
    export let bookmark = {url: '', name: {fr: '', en: ''}};
    let t1;

    let bookmarked = isBookmarked(bookmark.url)

    onMount(() =>
    {
        setupTippy();
    });

    const setupTippy = () =>
    {
        t1 = tippy('.bm', {
            content: (bookmarked) ? $_('bookmarks.remove') : $_('bookmarks.add'),
            delay: 500
        });
    }

    const removePage = async () =>
    {
        await removeBookmark(bookmark.url);
        bookmarked = false;
        setTimeout(() => setupTippy(), 50);
    }

    const addPage = async () =>
    {
        await addBookmark(bookmark.url, bookmark.name);
        bookmarked = true;
        setTimeout(() => setupTippy(), 50);
    }
</script>

<div class="flex flex-row justify-between items-center mb-4">
    <h1 class="text-2xl font-medium"><slot name="title"/></h1>
    <div class="flex flex-row items-center justify-end gap-x-2">
        {#if bookmarkable}
            {#if bookmarked}
                <button on:click={removePage} class="text-success-500 hover:text-success-400 bm">
                    <Icon src={BookmarkAdded} size="38"/>
                </button>
            {:else}
                <button on:click={addPage} class="dark:text-surface-400 dark:hover:text-success-500 hover:text-success-500 bm">
                    <Icon src={BookmarkAdd} size="38"/>
                </button>
            {/if}
        {/if}
        <slot name="actions"/>
    </div>
</div>