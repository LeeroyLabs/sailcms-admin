<script>
    import '@/app.scss';
    import { initLocale } from '$lib/helpers/i18n.js';
    import Messages from '@components/structure/message.svelte';
    import { AppShell, ProgressBar } from '@skeletonlabs/skeleton';
    import Breadcrumbs from '@components/structure/breadcrumbs.svelte';
    import Sidebar from '@components/structure/sidebar.svelte';
    import Header from '@components/structure/header.svelte';
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
    import { initializeStores, storePopup } from '@skeletonlabs/skeleton';
    import { loadJSON } from '$lib/helpers/boot.js';
    import { setThemeFromPreferences } from '$lib/helpers/theme.js';
    import { AppStore } from '@stores/app.js';

    // Set theme
    setThemeFromPreferences();

    // Initialize store
    initializeStores();

    // Floating UI Setup
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

    // Load JSON file
    loadJSON(false);

    // Initialize Locale
    initLocale();
</script>

<!-- App Shell -->
<div style="display: contents" class="h-full overflow-hidden">
    <Messages/>
    {#if $AppStore.OSMode}
        <AppShell>
            <svelte:fragment slot="header">
<!--                <SystemBar/>-->
<!--                <BookmarkBar/>-->
                <div class="flex flex-row gap-x-8 items-center py-2 px-4">
                    <div><Breadcrumbs/></div>
                    <div class="flex-grow flex flex-row justify-end py-2" id="pageActions"></div>
                </div>
            </svelte:fragment>
            <div class="p-4">
                <slot />
            </div>
        </AppShell>
    {:else}
        <div class="flex flex-row h-full max-h-full bg-surface-50 dark:bg-surface-900 overflow-hidden">
            {#if $AppStore.appReady}
                <Sidebar/>
            {/if}

            <div class="flex flex-col w-full">
                {#if $AppStore.appReady}
                    <header id="header-container" class="w-full">
                        <Header/>
                    </header>
                {/if}

                <main id="content-container" class="p-4 flex-grow overflow-auto">
                    {#if $AppStore.appReady}
                        <slot/>
                    {:else}
                        <div class="flex flex-col h-full items-center justify-center px-64">
                            <ProgressBar meter="bg-primary-400"/>
                        </div>
                    {/if}
                </main>
            </div>
        </div>
    {/if}
</div>