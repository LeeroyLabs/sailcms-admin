<script>
    import { AppStore } from '@stores/app.js';
    import { ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
    import PageHead from '@components/structure/pagehead.svelte';
    import Table from '@components/utils/table.svelte';
    import ListTop from '@components/utils/listtop.svelte';
    import Modal from '@components/utils/modal.svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Plus } from '@steeze-ui/lucide-icons';
    import { _ } from 'svelte-i18n';
    import { FieldsController } from '$lib/controllers/fields.js';

    let isReady = false;
    let fields = [];
    let optionSelected = '';
    let selectedRows = [];
    let cols = [];
    let rows = [];

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/fields', label: 'fields.title', active: true}
    ]);

    const bookmarkData = {
        url: '/settings/fields',
        name: { fr: 'Champs', en: 'Fields' }
    }

    const actionList = [
        {value: '', label: 'system.bulk'},
        {value: 'delete', label: 'system.delete'}
    ];

    const init = async () =>
    {
        const data = await FieldsController.loadList();

        rows = data.rows;
        cols = data.columns;
        isReady = true;
    }

    const handleActionSelection = async (e) =>
    {
        // if (activeTab === 0) {
        //     confirmId = LayoutsController.handleSelection(selectedRowsActive, e.detail);
        // } else {
        //     confirmId = LayoutsController.handleSelection(selectedRowsTrash, e.detail);
        // }
        //
        // if (confirmId === 3) {
        //     // Restore Layout
        //     let result = await LayoutsController.restore(selectedRowsTrash);
        //
        //     rows = result.rows;
        //     trashRows = result.trash;
        //     cols = result.columns;
        // }
    }

    const deleteSelections = () =>
    {

    }

    init();
</script>

<svelte:head>
    <title>{$_('fields.title')} - SailCMS</title>
</svelte:head>

{#if isReady}
    <PageHead bookmarkable={true} bookmark={bookmarkData}>
        <svelte:fragment slot="title">
            {$_('fields.title')}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <a href={`${$AppStore.baseURL}/settings/fields/new`} class="btn variant-filled-primary">
                <span><Icon src={Plus} size="20"/></span>
                <span>{$_('layouts.add')}</span>
            </a>
        </svelte:fragment>
    </PageHead>

    <div class="card !bg-gray-100 dark:!bg-surface-700 p-4">
        <ListTop
            search={true}
            bind:actionSelected={optionSelected}
            actions={actionList}
            on:selected={handleActionSelection}
        />
        <Table columns={cols} rows={rows} emptyRows="fields.no_fields" bind:selectedList={selectedRows}/>

        <!-- Delete Confirmation model -->
<!--        <Modal title="layouts.confirm" show={confirmId === 1}>-->
<!--            <svelte:fragment slot="content">-->
<!--                {#if optionSelectedActive.length === 1}-->
<!--                    {$_('layouts.confirm_delete')}-->
<!--                {:else}-->
<!--                    {$_('layouts.confirm_delete_many')}-->
<!--                {/if}-->
<!--            </svelte:fragment>-->
<!--            <svelte:fragment slot="buttons">-->
<!--                <button on:click={() => confirmId = -1} class="btn ">{$_('system.cancel')}</button>-->
<!--                <button on:click={deleteSelections} class="btn variant-filled-error">-->
<!--                    {#if !isDeleting}-->
<!--                        {$_('system.yes')}-->
<!--                    {:else}-->
<!--                        <ProgressRadial fill="fill-primary" width="w-5" />-->
<!--                    {/if}-->
<!--                </button>-->
<!--            </svelte:fragment>-->
<!--        </Modal>-->
    </div>
{:else}
    <div class="flex flex-col justify-center items-center h-full px-64">
        <ProgressBar meter="bg-primary-500" />
    </div>
{/if}