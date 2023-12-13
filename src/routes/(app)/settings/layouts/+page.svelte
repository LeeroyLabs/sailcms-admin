<script>
    import { AppStore } from '@stores/app.js';
    import { TabGroup, Tab, ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
    import PageHead from '@components/structure/pagehead.svelte';
    import TableNew from '@components/utils/table.svelte';
    import ListTop from '@components/utils/listtop.svelte';
    import Modal from '@components/utils/modal.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Plus } from '@steeze-ui/lucide-icons';
    import { _ } from 'svelte-i18n';
    import { LayoutsController } from '$lib/controllers/layouts.js';
    import { linkTo } from '$lib/helpers/navigation.js';

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
    let rows = [];
    let trashRows = [];
    let selectedRowsActive = [];
    let selectedRowsTrash = [];
    let isSoftDeleting = false;
    let isRestoring = false;
    let isDeleting = false;
    let confirmId = -1;

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
        {value: 'restore', label: 'system.restore'},
        {value: 'delete', label: 'system.delete'}
    ];

    const init = async () =>
    {
        let result = await LayoutsController.listing();

        rows = result.rows;
        trashRows = result.trash;
        cols = result.columns;
        isReady = true;
    }

    const handleActionSelection = async (e) =>
    {
        if (activeTab === 0) {
            confirmId = LayoutsController.handleSelection(selectedRowsActive, e.detail);
        } else {
            confirmId = LayoutsController.handleSelection(selectedRowsTrash, e.detail);
        }

        if (confirmId === 3) {
            // Restore Layout
            isRestoring = true;
            let result = await LayoutsController.restore(selectedRowsTrash);

            rows = result.rows;
            trashRows = result.trash;
            cols = result.columns;

            isRestoring = false;
        }
    }

    const trashSelections = async () =>
    {
        isSoftDeleting = true;
        let result = await LayoutsController.trash(selectedRowsActive);

        rows = result.rows;
        trashRows = result.trash;
        cols = result.columns;

        isSoftDeleting = false;
        confirmId = -1;
    }

    const deleteSelections = () =>
    {

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
            <span>{$_('layouts.add')}</span>
        </button>
    </svelte:fragment>
</PageHead>

<div class="card !bg-gray-100 dark:!bg-surface-700 p-4">
    <TabGroup active="border-b-2 border-primary-500">
        <Tab bind:group={activeTab} name="tab1" value={0}>{$_('layouts.active')}</Tab>
        <Tab bind:group={activeTab} name="tab2" value={1}>{$_('layouts.trashed')}</Tab>

        <svelte:fragment slot="panel">
            <!-- Active -->
            <div class="{activeTab === 0 ? '' : 'hidden'}">
                <ListTop
                    bind:actionSelected={optionSelectedActive}
                    actions={actionList}
                    on:selected={handleActionSelection}
                />
                <TableNew columns={cols} rows={rows} emptyRows="layouts.no_layout" bind:selectedList={selectedRowsActive}/>
            </div>

            <!-- Trashed -->
            <div class="{activeTab === 1 ? '' : 'hidden'}">
                <ListTop
                    bind:actionSelected={optionSelectedTrash}
                    actions={actionListTrash}
                    on:selected={handleActionSelection}
                />
                <TableNew columns={cols} rows={trashRows} emptyRows="layouts.no_layout" bind:selectedList={selectedRowsTrash}/>
            </div>
        </svelte:fragment>
    </TabGroup>

    <!-- TODO: Trash Model -->
    <Modal title="layouts.confirm" show={confirmId === 2} on:close={() => confirmId = -1}>
        <svelte:fragment slot="content">
            {#if optionSelectedActive.length === 1}
                {$_('layouts.confirm_softdelete')}
            {:else}
                {$_('layouts.confirm_softdelete_many')}
            {/if}
        </svelte:fragment>
        <svelte:fragment slot="buttons">
            <button on:click={() => confirmId = -1} class="btn {isSoftDeleting ? 'pointer-events-none' : ''}">{$_('system.cancel')}</button>
            <button on:click={trashSelections} class="btn variant-filled-error {isSoftDeleting ? 'pointer-events-none' : ''}">
                {#if !isSoftDeleting}
                    {$_('system.yes')}
                {:else}
                    <ProgressRadial fill="fill-primary" width="w-5" />
                {/if}
            </button>
        </svelte:fragment>
    </Modal>

    <!-- Delete Confirmation model -->
    <Modal title="layouts.confirm" show={confirmId === 1} on:close={() => confirmId = -1}>
        <svelte:fragment slot="content">
            {#if optionSelectedActive.length === 1}
                {$_('layouts.confirm_delete')}
            {:else}
                {$_('layouts.confirm_delete_many')}
            {/if}
        </svelte:fragment>
        <svelte:fragment slot="buttons">
            <button on:click={() => confirmId = -1} class="btn ">{$_('system.cancel')}</button>
            <button on:click={deleteSelections} class="btn variant-filled-error">
                {#if !isDeleting}
                    {$_('system.yes')}
                {:else}
                    <ProgressRadial fill="fill-primary" width="w-5" />
                {/if}
            </button>
        </svelte:fragment>
    </Modal>
</div>
{:else}
    <div class="flex flex-col justify-center items-center h-full px-64">
        <ProgressBar meter="bg-primary-500" />
    </div>
{/if}