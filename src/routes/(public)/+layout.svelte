<script>
    import '@/app.scss';
    import { initLocale } from '$lib/helpers/i18n.js';
    import Messages from '@components/structure/message.svelte';
    import { setThemeFromPreferences } from '$lib/helpers/theme.js';
    import { initializeStores } from '@skeletonlabs/skeleton';
    import { loadJSON } from '$lib/helpers/boot.js';

    // Set theme
    setThemeFromPreferences();

    // Initialize Skeleton Stores
    initializeStores();

    // Load JSON file
    loadJSON(true);

    // Initialize Locale
    initLocale();
</script>

<div>
    <Messages/>
    <div class="bg-container" style="background-image: url(/sailcms.webp);">
        <div class="bg-dimmer h-screen flex flex-row">
            <div class="flex-grow"></div>
            <slot/>
        </div>
    </div>
</div>

<style lang="scss">
    .bg-container {
        @apply h-screen bg-cover bg-[left_top_-200px] bg-no-repeat relative bg-white flex flex-col;
    }

    .bg-dimmer {
        @apply bg-black/30;
    }
</style>