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
    import { searchable } from '$lib/helpers/text.js';
    import { Entries } from '@graphql/lib/entries.js';
    import { hasPermission } from '$lib/helpers/permissions.js';
    import { Message } from '@stores/message.js';
    import { linkTo } from '$lib/helpers/navigation.js';

    let isReady = false;
    let fields = [];
    let optionSelected = '';
    let selectedRows = [];
    let cols = [];
    let rows = [];
    let displayedRows = [];
    let showConfirm = false;
    let isDeleting = false;

    const isAllowed = hasPermission('readwrite_entry_fields');

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
        displayedRows = rows;
        cols = data.columns;
        isReady = true;
    }

    const handleActionSelection = (e) => showConfirm = true;

    const deleteSelections = async () =>
    {
        isDeleting = true;
        const result = await Entries.deleteEntryFields(selectedRows);

        if (result) {
            await init();
            isDeleting = false;
            showConfirm = false;

            let msg = 'fields.delete_success_many';

            if (selectedRows.length === 1) {
                msg = 'fields.delete_success';
            }

            Message.set({show: true, message: msg, type: 'success', ttl: 15000});
            selectedRows = [];
        } else {
            isDeleting = false;
            showConfirm = false;

            let msg = 'fields.delete_error_many';

            if (selectedRows.length === 1) {
                msg = 'fields.delete_error';
            }

            Message.set({show: true, message: msg, type: 'error', ttl: 15000});
        }
    }

    const searchFields = async (e) =>
    {
        displayedRows = rows.filter(r => {
            return searchable(r.data[0].data).includes(searchable(e.detail));
        });
    }

    const clearSearch = () => displayedRows = rows;

    init();
</script>

{#if isReady}
    <PageHead bookmarkable={true} bookmark={bookmarkData}>
        <svelte:fragment slot="title">
            {$_('fields.title')}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            {#if isAllowed}
                <a href={`${$AppStore.baseURL}/settings/fields/new`} class="btn variant-filled-primary">
                    <span><Icon src={Plus} size="20"/></span>
                    <span>{$_('layouts.add')}</span>
                </a>
            {/if}
        </svelte:fragment>
    </PageHead>

    <div class="card !bg-gray-100 dark:!bg-surface-700 p-4">
        <ListTop
            search={true}
            bind:actionSelected={optionSelected}
            actions={actionList}
            on:selected={handleActionSelection}
            on:search={searchFields}
            on:clear={clearSearch}
            isAllowed={isAllowed}
        />
        <Table isAllowed={isAllowed} columns={cols} rows={displayedRows} emptyRows="fields.no_fields" bind:selectedList={selectedRows}/>

        <!-- Delete Confirmation model -->
        <Modal title="fields.confirm" show={showConfirm}>
            <svelte:fragment slot="content">
                {#if selectedRows.length === 1}
                    {$_('fields.confirm_delete')}
                {:else}
                    {$_('fields.confirm_delete_many')}
                {/if}
            </svelte:fragment>
            <svelte:fragment slot="buttons">
                <button on:click={() => showConfirm = false} class="btn ">{$_('system.cancel')}</button>
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