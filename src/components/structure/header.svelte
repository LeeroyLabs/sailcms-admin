<script>
    import { locale } from 'svelte-i18n';
    import { switchTheme } from '$lib/helpers/theme.js';
    import { AppStore } from '@stores/app.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { DarkMode, LightMode } from '@steeze-ui/material-design-icons';
    import Breadcrumbs from '@components/structure/breadcrumbs.svelte';
    import BookmarksMenu from '@components/structure/bookmarks.svelte';

    const switchLocale = () =>
    {
        locale.set(($locale === 'fr') ? 'en' : 'fr');
        localStorage.setItem(import.meta.env.VITE_SAILCMS_LOCALE_TOKEN, $locale);
    }
</script>

<header class="header">
    <div class="flex-grow flex flex-row items-center gap-x-4 relative">
        <BookmarksMenu/>
        <Breadcrumbs/>
    </div>
    <div class="flex flex-row items-center gap-x-4">
        <button on:click={switchLocale} class="text-[16px]">
            {($locale === 'en') ? 'FR' : 'EN'}
        </button>
        <button on:click={() => switchTheme()} class="text-black dark:text-surface-100 hover:text-primary-500 dark:hover:text-primary-500">
            <Icon src={($AppStore.theme === 'light') ? DarkMode: LightMode} size="22"/>
        </button>
    </div>
</header>

<style lang="scss">
    .header {
        @apply py-2.5 px-3 flex flex-row gap-x-4 items-center bg-gray-50 border-b border-surface-300;
        @apply dark:bg-surface-700 dark:border-surface-500;
    }

    .subbar {
        @apply flex flex-row gap-x-8 items-center py-2 px-4 bg-gray-200 border-surface-300;
        @apply dark:bg-surface-800 border-b dark:border-surface-600;
    }
</style>