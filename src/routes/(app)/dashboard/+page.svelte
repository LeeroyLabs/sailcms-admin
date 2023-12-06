<script>
    import Portal from "svelte-portal";
    import { AppStore } from '@stores/app.js';

    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/entries', label: 'systembar.entries', active: true}
    ]);

</script>

<svelte:head>
    <title>Entries - SailCMS</title>
</svelte:head>
<Portal target="#pageActions">
    BUTTON HERE
</Portal>