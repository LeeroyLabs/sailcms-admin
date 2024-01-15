<script>
    import { AppStore } from '@stores/app.js';
    import { _ } from 'svelte-i18n';
    import { moveItem } from '$lib/helpers/layouts.js';
    import { linkTo } from '$lib/helpers/navigation.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Trash2, Plus, Edit, Save } from '@steeze-ui/lucide-icons';
    import PageHead from '@components/structure/pagehead.svelte';
    import Searchable from '@components/utils/searchable.svelte';
    import LayoutItem from '@components/entries/layoutitem.svelte';
    import { ProgressBar, ProgressRadial, Tab, TabGroup } from '@skeletonlabs/skeleton';
    import { LayoutsController } from '$lib/controllers/layouts.js';
    import Modal from '@components/utils/modal.svelte';
    import { Entries } from '@graphql/lib/entries.js';
    import { deburr, kebabCase } from 'lodash';
    import { Message } from '@stores/message.js';

    export let data;

    let activeTab = 0;
    let isReady = false;
    let isSaving = false;
    let title = 'layout.add';
    let fields = [];
    let tabs = [];
    let showAddTab = false;
    let newTabName = '';
    let isAddTab = false;
    let showDeleteConfirm = false;
    let searchField;
    let isAdding = false;
    let layoutName = '';

    if (data.id !== 'new') {
        title = '';
    } else {
        tabs = [{
            label: 'Main',
            fields: []
        }];

        isAdding = true;
    }

    const init = async () =>
    {
        let info = await LayoutsController.initLayout(isAdding, data.id);

        layoutName = info.layoutName;
        tabs = info.tabs;
        fields = info.fields;
        title = info.title;
        isReady = true;
    }

    const openTab = () =>
    {
        isAddTab = true;
        showAddTab = true;
        setTimeout(() => document.getElementById('tabmodal').focus(), 200);
    }

    const closeAddTab = () =>
    {
        isAddTab = false;
        showAddTab = false;
        newTabName = '';
    }

    const openEditTab = () =>
    {
        isAddTab = false;
        showAddTab = true;
        newTabName = tabs[activeTab].label;
        setTimeout(() => document.getElementById('tabmodal').focus(), 200);
    }

    const deleteTab = () =>
    {
        let usedFields = tabs[activeTab].fields;

        for (let field of fields) {
            for (let f of usedFields) {
                if (field._id === f.id) {
                    field.used = false;
                }
            }
        }

        fields = fields;
        searchField.updateFields(fields);

        tabs = tabs.filter((tab, idx) => idx !== activeTab);
        activeTab = 0;
        showDeleteConfirm = false;
    }

    const addTab = () =>
    {
        if (isAddTab) {
            tabs = [...tabs, { label: newTabName, fields: [] }];
        } else {
            tabs[activeTab].label = newTabName;
        }

        showAddTab = false;
        newTabName = '';
        isAddTab = false;
    }

    // Add field to active tab and trigger reactivity
    const addField = (id) =>
    {
        tabs[activeTab].fields = [...tabs[activeTab].fields, {id: id, width: 'full'}];

        for (let field of fields) {
            if (field._id === id) {
                field.used = true;
            }
        }

        // Force reactive change
        fields = fields;
    }

    // When a width is set for an item, trigger reactivity and set width
    const setWidth = (tab, field, width) =>
    {
        tabs[tab].fields[field].width = width;
        tabs = tabs;
    }

    // Move a field up or down in the list of the tab
    const move = (tab, field, opts) =>
    {
        let total = tabs[tab].fields.length;

        // Don't go out of bounds
        if (opts.direction === 'up' && field === 0) return;
        if (opts.direction === 'down' && field + 1 === total) return;

        let target = (opts.direction === 'up') ? field - 1 : field + 1;
        tabs[tab].fields = moveItem(tabs[tab].fields, field, target);
    }

    // Remove a field from the fields list of the tab
    const remove = (tab, field, id) =>
    {
        tabs[tab].fields = tabs[tab].fields.filter((f,idx) => idx !== field);
        tabs = tabs;

        for (let field of fields) {
            if (field._id === id) {
                field.used = false;
            }
        }

        fields = fields;
        searchField.updateFields(fields);
    }

    const saveLayout = async () =>
    {
        if (layoutName === '') return;
        if (isSaving) return;

        isSaving = true;
        const slug = deburr(kebabCase(layoutName));
        let status = false;

        if (isAdding) {
            status = await Entries.createEntryLayout(layoutName, tabs, slug);
        } else {
            status = await Entries.updateEntryLayout(data.id, layoutName, tabs, slug);
        }

        isSaving = false;

        if (status) {
            Message.set({show: true, message: 'layout.save_success', type: 'success', ttl: 15000});
            linkTo('/settings/layouts');
        } else {
            Message.set({show: true, message: 'layout.save_error', type: 'error', ttl: 15000});
        }
    }

    init();
</script>

{#if isReady}
    <PageHead bookmarkable={false}>
        <svelte:fragment slot="title">
            {$_(title)}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <button on:click={saveLayout} class="btn variant-filled-primary">
                {#if isSaving}
                    <span><ProgressRadial width="w-4"/></span>
                {:else}
                    <span><Icon src={Save} size="20"/></span>
                {/if}
                <span>{$_('system.save')}</span>
            </button>
        </svelte:fragment>
    </PageHead>

    <div class="card !bg-gray-100 dark:!bg-surface-700 p-4 flex flex-col gap-y-4 relative">
        <input bind:value={layoutName} type="text" class="input" placeholder="Name of this layout" />

        <TabGroup active="border-b-2 border-primary-500" regionList="relative">
            {#each tabs as tab, idx}
                <Tab bind:group={activeTab} name="tab{idx}" value={idx}>
                    {tab.label}
                </Tab>
            {/each}

            <button on:click={openTab} class="add-tab-btn">
                <Icon src={Plus} size="24"/>
            </button>

            <svelte:fragment slot="panel">
                <div class="tab-editor mt-[-1.02rem]">
                    <div class="flex flex-row justify-between items-center">
                        <div class="w-4/12">
                            <Searchable placeholder="layouts.search_fields" bind:this={searchField} bind:fields={fields} on:selected={(e) => addField(e.detail)}/>
                        </div>
                        <div class="flex flex-row gap-x-2">
                            <button on:click={openEditTab} class="btn variant-filled-primary flex flex-row items-center gap-x-2">
                                <Icon src={Edit} size="20"/>
                            </button>
                            <button on:click={() => showDeleteConfirm = true} class="btn variant-filled-error flex flex-row items-center gap-x-2">
                                <Icon src={Trash2} size="20"/>
                            </button>
                        </div>
                    </div>

                    {#each tabs as tab, idx}
                        <div class="{activeTab === idx ? '' : '!hidden'} grid grid-cols-3 gap-4 p-4 tab-row border-2 rounded-md border-surface-300 dark:border-surface-800 border-dashed">
                            {#if tab.fields.length === 0}
                                <div class="col-span-3 flex flex-col items-center justify-center h-[150px] !border-0">
                                    <h2 class="text-2xl text-surface-400">{$_('layout.add_start')}</h2>
                                </div>
                            {:else}
                                {#each tab.fields as field, fidx}
                                    <LayoutItem
                                        fields={fields}
                                        field={field}
                                        on:set={(v) => setWidth(idx, fidx, v.detail)}
                                        on:move={(v) => move(idx, fidx, v.detail)}
                                        on:remove={(v) => remove(idx, fidx, v.detail)}
                                    />
                                {/each}
                            {/if}
                        </div>
                    {/each}
                </div>
            </svelte:fragment>
        </TabGroup>
    </div>

    <Modal title={isAddTab ? 'layout.add_tab' : 'layout.edit_tab'} show={showAddTab} on:close={() => showAddTab = false}>
        <svelte:fragment slot="content">
            <input type="text" bind:value={newTabName} autocomplete="one-time-code" id="tabmodal" class="input" placeholder={$_('layout.tabname')}/>
        </svelte:fragment>
        <svelte:fragment slot="buttons">
            <button on:click={closeAddTab} class="btn">{$_('system.cancel')}</button>
            <button on:click={addTab} class="btn variant-filled-primary">
                {#if isAddTab}
                    {$_('system.add')}
                {:else}
                    {$_('system.save')}
                {/if}
            </button>
        </svelte:fragment>
    </Modal>

    <Modal title="layouts.confirm" show={showDeleteConfirm} on:close={() => showDeleteConfirm = false}>
        <svelte:fragment slot="content">
            {$_('layout.confirm_delete')}
        </svelte:fragment>
        <svelte:fragment slot="buttons">
            <button on:click={() => showDeleteConfirm = false} class="btn">{$_('system.cancel')}</button>
            <button on:click={deleteTab} class="btn variant-filled-error">
                {$_('system.yes')}
            </button>
        </svelte:fragment>
    </Modal>
{:else}
    <div class="flex flex-col justify-center items-center h-full px-64">
        <ProgressBar meter="bg-primary-500" />
    </div>
{/if}

<style lang="scss">
    .tab-editor {
        @apply border border-t-0 border-surface-400 dark:border-surface-900 p-6 bg-surface-50 dark:bg-surface-600 rounded-md;
        @apply rounded-t-none flex flex-col gap-y-4;
    }

    .add-tab-btn {
        @apply absolute right-0 btn-sm rounded-md flex flex-row gap-x-1 hover:bg-primary-500 hover:text-black;
    }
</style>