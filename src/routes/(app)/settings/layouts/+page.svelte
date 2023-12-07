<script>
    import { AppStore } from '@stores/app.js';
    import { tableMapperValues, Table, TabGroup, Tab } from '@skeletonlabs/skeleton';
    import PageHead from '@components/structure/pagehead.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Plus } from '@steeze-ui/heroicons';
    import { _ } from 'svelte-i18n';

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/layouts', label: 'system.entry_layouts', active: true}
    ]);

    let activeTab = 0;

    const sourceData = [
        { name: 'Name', weight: 1.0079, symbol: 'H' },
        { name: 'Create By', weight: 4.0026, symbol: 'He' },
        { name: 'Last Updated On', weight: 6.941, symbol: 'Li' },
        { name: 'Used By', weight: 9.0122, symbol: 'Be' },
        { name: 'Record Count', weight: 10.811, symbol: 'B' },
    ];

    const tableSimple = {
        // A list of heading labels.
        head: ['Name', 'Created By', 'Last Update', 'Used By', 'Record Count'],
        // The data visibly shown in your table body UI.
        body: tableMapperValues(sourceData, ['name', 'symbol', 'weight']),
        // Optional: The data returned when interactive is enabled and a row is clicked.
        meta: tableMapperValues(sourceData, ['name', 'symbol', 'weight'])
    };

    const bookmarkData = {
        url: '/settings/layouts',
        name: {
            fr: 'Mises en page',
            en: 'Layouts'
        }
    }

    const init = async () =>
    {
        console.log($AppStore);
    }

    init();
</script>

<svelte:head>
    <title>{$_('system.entry_layouts')} - SailCMS</title>
</svelte:head>

<PageHead bookmarkable={true} bookmark={bookmarkData}>
    <svelte:fragment slot="title">
        Layouts
    </svelte:fragment>
    <svelte:fragment slot="actions">
        <button class="btn variant-filled-primary">
            <span><Icon src={Plus} size="20"/></span>
            <span>Add Layout</span>
        </button>
    </svelte:fragment>
</PageHead>

<div class="card p-4">
    <TabGroup active="border-b-2 border-primary-500">
        <Tab bind:group={activeTab} name="tab1" value={0}><span>Active</span></Tab>
        <Tab bind:group={activeTab} name="tab2" value={1}>Trash</Tab>

        <svelte:fragment slot="panel">
            <div class="{activeTab === 0 ? '' : 'hidden'}">
                <div class="table-wrapper">
                    <Table interactive={true} source={tableSimple} />
                </div>
            </div>

            <div class="{activeTab === 1 ? '' : 'hidden'}">
                (tab panel 2 contents)
            </div>
        </svelte:fragment>
    </TabGroup>
</div>

<style lang="scss">
    .table-wrapper {
        @apply rounded-lg border border-surface-300 dark:border-surface-600;
    }
</style>