<script>
    import PageHead from '@components/structure/pagehead.svelte';
    import { AppStore } from '@stores/app.js';

    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/entries', label: 'systembar.entries', active: true}
    ]);

</script>

<svelte:head>
    <title>Entries - SailCMS</title>
</svelte:head>

<PageHead>
    <svelte:fragment slot="title">
        Page Tile
    </svelte:fragment>
    <svelte:fragment slot="actions">
        BUTTON HERE
    </svelte:fragment>
</PageHead>

HELLO<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/>wefwewef<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>fefwefefwe