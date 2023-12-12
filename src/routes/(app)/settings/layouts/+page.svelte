<script>
    import { AppStore } from '@stores/app.js';
    import { TabGroup, Tab, ProgressBar } from '@skeletonlabs/skeleton';
    import PageHead from '@components/structure/pagehead.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Plus } from '@steeze-ui/heroicons';
    import { _ } from 'svelte-i18n';
    import TableNew from '@components/utils/table.svelte';
    import { LayoutsController } from '$lib/controllers/layouts.js';
    import { linkTo } from '$lib/helpers/navigation.js';
    import ListTop from '@components/utils/listtop.svelte';

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/layouts', label: 'layouts.title', active: true}
    ]);

    let activeTab = 0;
    let optionSelectedActive = '';
    let optionSelectedTrash = '';
    let isReady = false;
    let cols = [];

    const bookmarkData = {
        url: '/settings/layouts',
        name: { fr: 'Mises en page', en: 'Entry Layouts' }
    }

    const actionList = [
        {value: '', label: 'system.bulk'},
        {value: 'trash', label: 'system.trash'}
    ];

    const actionListTrash = [
        {value: '', label: 'system.bulk'},
        {value: 'restore', label: 'system.restore'}
    ];

    let rows = [];
    let trashRows = [];

    let selectedRowsActive = [];
    let selectedRowsTrash = [];

    const init = async () =>
    {
        let result = await LayoutsController.listing();
        rows = result.rows;
        trashRows = result.trash;
        cols = result.columns;
        isReady = true;
    }

    init();
</script>

<svelte:head>
    <title>{$_('layouts.title')} - SailCMS</title>
</svelte:head>

{#if isReady}
<PageHead bookmarkable={true} bookmark={bookmarkData}>
    <svelte:fragment slot="title">
        {$_('layouts.title')}
    </svelte:fragment>
    <svelte:fragment slot="actions">
        <button on:click={() => linkTo(`/settings/layouts/new`)} class="btn variant-filled-primary">
            <span><Icon src={Plus} size="20"/></span>
            <span>Add Layout</span>
        </button>
    </svelte:fragment>
</PageHead>

<div class="card !bg-gray-100 dark:!bg-surface-700 p-4">
    <TabGroup active="border-b-2 border-primary-500">
        <Tab bind:group={activeTab} name="tab1" value={0}><span>Active</span></Tab>
        <Tab bind:group={activeTab} name="tab2" value={1}>Trash</Tab>

        <svelte:fragment slot="panel">
            <div class="{activeTab === 0 ? '' : 'hidden'}">
                <ListTop bind:actionSelected={optionSelectedActive} actions={actionList}/>
                <TableNew columns={cols} rows={rows} emptyRows="layouts.no_layout" bind:selectedList={selectedRowsActive}/>
            </div>

            <div class="{activeTab === 1 ? '' : 'hidden'}">
                <div class="table-wrapper">
                    <ListTop bind:actionSelected={optionSelectedTrash} actions={actionListTrash}/>
                    <TableNew columns={cols} rows={trashRows} emptyRows="layouts.no_layout" bind:selectedList={selectedRowsTrash}/>
                </div>
            </div>
        </svelte:fragment>
    </TabGroup>
</div>
{:else}
    <div class="flex flex-col justify-center items-center h-full px-64">
        <ProgressBar meter="bg-primary-500" />
    </div>
{/if}

<style lang="scss">
</style>