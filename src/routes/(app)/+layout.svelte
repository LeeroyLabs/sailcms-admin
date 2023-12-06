<script>
    import '@/app.scss';
    import { initLocale } from '$lib/helpers/i18n.js';
    import Messages from '@components/structure/message.svelte';
    import { AppShell } from '@skeletonlabs/skeleton';
    import SystemBar from '@components/structure/systembar.svelte';
    import BookmarkBar from '@components/structure/bookmarks.svelte';
    import Breadcrumbs from '@components/structure/breadcrumbs.svelte';

    import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

    // Initialize Skeleton Stores
    import { initializeStores, storePopup } from '@skeletonlabs/skeleton';
    import { loadJSON } from '$lib/helpers/boot.js';

    // Initialize store
    initializeStores();

    // Floating UI Setup
    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

    // Load JSON file
    loadJSON(true);

    // Initialize Locale
    initLocale();
</script>

<!-- App Shell -->
<div style="display: contents" class="h-full overflow-hidden">
    <Messages/>
    <AppShell>
        <svelte:fragment slot="header">
            <SystemBar/>
            <BookmarkBar/>
            <div class="flex flex-row gap-x-8 items-center py-2 px-4">
                <div><Breadcrumbs/></div>
                <div class="flex-grow flex flex-row justify-end py-2" id="pageActions"></div>
            </div>
        </svelte:fragment>
        <!-- Router Slot -->
        <div class="px-4 pb-4">
            <slot/>
        </div>
    </AppShell>
</div>