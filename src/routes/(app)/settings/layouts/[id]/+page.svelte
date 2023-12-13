<script>
    import { AppStore } from '@stores/app.js';
    import { _ } from 'svelte-i18n';
    import { linkTo } from '$lib/helpers/navigation.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Trash2, Plus, Edit, Save } from '@steeze-ui/lucide-icons';
    import PageHead from '@components/structure/pagehead.svelte';
    import Searchable from '@components/utils/searchable.svelte';
    import LayoutItem from '@components/entries/layoutitem.svelte';
    import { Tab, TabGroup } from '@skeletonlabs/skeleton';
    import { LayoutsController } from '$lib/controllers/layouts.js';

    export let data;

    let activeTab = 0;
    let isReady = false;
    let title = 'layout.add';
    let fields = [];

    let tabs = [];

    if (data.id !== 'new') {
        title = '';
    } else {
        tabs = [{
            label: 'Main',
            fields: []
        }];
    }

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/layouts', label: 'layouts.title', active: false},
        {url: '', label: title, active: true}
    ]);

    const init = async () =>
    {
        fields = await LayoutsController.loadFields();
        isReady = true;
    }

    const addTab = () =>
    {
        // Show Name Input and Add
    }

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

    const setWidth = (tab, field, width) =>
    {
        tabs[tab].fields[field].width = width;
        tabs = tabs;
    }

    init();
</script>

<svelte:head>
    <title>{$_(title)} - SailCMS</title>
</svelte:head>

{#if isReady}
    <PageHead bookmarkable={false}>
        <svelte:fragment slot="title">
            {$_(title)}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <button on:click={() => linkTo(`/settings/layouts/new`)} class="btn variant-filled-primary">
                <span><Icon src={Save} size="20"/></span>
                <span>{$_('system.save')}</span>
            </button>
        </svelte:fragment>
    </PageHead>

    <div class="card !bg-gray-100 dark:!bg-surface-700 p-4 flex flex-col gap-y-4 relative">
        NAME

        <TabGroup active="border-b-2 border-primary-500" regionList="relative">
            {#each tabs as tab, idx}
                <Tab bind:group={activeTab} name="tab{idx}" value={idx}>
                    {tab.label}
                </Tab>
            {/each}

            <button on:click={addTab} class="absolute right-0 btn-sm rounded-md flex flex-row gap-x-1 hover:bg-primary-500">
                <Icon src={Plus} size="24"/>
            </button>

            <svelte:fragment slot="panel">
                {#each tabs as tab, idx}
                    <div class="tab-editor mt-[-1.02rem] {activeTab === idx ? '' : 'hidden'}">
                        <div class="flex flex-row justify-between items-center">
                            <div class="w-4/12">
                                <Searchable bind:fields={fields} on:selected={(e) => addField(e.detail)}/>
                            </div>
                            <div class="flex flex-row gap-x-2">
                                <button class="btn variant-filled-primary flex flex-row items-center gap-x-2">
                                    <Icon src={Edit} size="20"/>
                                </button>
                                <button class="btn variant-filled-error flex flex-row items-center gap-x-2">
                                    <Icon src={Trash2} size="20"/>
                                </button>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4 p-4 tab-row border-2 rounded-md border-surface-300 dark:border-surface-800 border-dashed">
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
                                    />
                                {/each}
                            {/if}
                        </div>
                    </div>
                {/each}
            </svelte:fragment>
        </TabGroup>
    </div>
{/if}

<style lang="scss">
    .tab-editor {
        @apply border border-t-0 border-surface-400 dark:border-surface-900 p-6 bg-surface-50 dark:bg-surface-600 rounded-md;
        @apply rounded-t-none flex flex-col gap-y-4;
    }
</style>