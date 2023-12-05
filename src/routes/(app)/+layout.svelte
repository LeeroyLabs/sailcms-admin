<script>
	import '@/app.scss';
	import { AppShell } from '@skeletonlabs/skeleton';
    import SystemBar from '@/components/structure/systembar.svelte';
    import '$lib/helpers/i18n.js';
</script>

<!-- App Shell -->
<div style="display: contents" class="h-full overflow-hidden">
    <AppShell>
        <svelte:fragment slot="header">
            <SystemBar/>
        </svelte:fragment>
        <svelte:fragment slot="pageFooter">
            <div class="fixed w-full bottom-0 z-99 bg-red-100">
                FOOTER
            </div>
        </svelte:fragment>
        <!-- Router Slot -->
        <slot />
    </AppShell>
</div>