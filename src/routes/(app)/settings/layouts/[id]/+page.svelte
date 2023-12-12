<script>
    import { AppStore } from '@stores/app.js';

    export let data;

    let title = 'layout.add';

    if (data.id !== 'new') title = '';

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/layouts', label: 'layouts.title', active: false},
        {url: '', label: title, active: true}
    ]);
</script>

THIS IS THE EDIT PAGE!