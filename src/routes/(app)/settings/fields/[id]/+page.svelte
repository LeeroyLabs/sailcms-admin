<script>
    import { _ } from 'svelte-i18n';
    import { AppStore } from '@stores/app.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Save } from '@steeze-ui/lucide-icons';
    import PageHead from '@components/structure/pagehead.svelte';
    import FieldTypeSearch from '@components/utils/typesearch.svelte';
    import { SailCMS } from '@graphql/index.js';
    import { availableTypes } from '$lib/sources/availabletypes.js';

    export let data;
    let isReady = true;

    let title = 'fields.new';
    let searchField;
    let fields = [];
    let selectedType = 'html';

    let breadcrumb = [
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/fields', label: 'fields.title', active: false}
    ];

    const init = async () =>
    {
        if (data.id === 'new') {
            breadcrumb = [...breadcrumb, {url: '', label: $_(title), active: true}];
            AppStore.setBreadcrumbs(breadcrumb);
        } else {

        }
    }

    init();

    // TODO: CONFIG VIEWS, REPEAT/REQUIRED OPTS, VALIDATION, SAVE, LOAD, UPDATE
</script>

{#if isReady}
    <PageHead bookmarkable={false}>
        <svelte:fragment slot="title">
            {$_(title)}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <a href="javascript:void(0);" class="btn variant-filled-primary">
                <span><Icon src={Save} size="20"/></span>
                <span>{$_('system.save')}</span>
            </a>
        </svelte:fragment>
    </PageHead>

    <div class="card !bg-gray-100 dark:!bg-surface-700 p-4">
        <div class="grid grid-cols-2 gap-x-4">
            <div>
                <label>{$_('fields.field_name')}:</label>
                <input type="text" class="input"/>
            </div>
            <div>
                <label>{$_('fields.field_key')}:</label>
                <input type="text" class="input"/>
                <small class="text-right block">{$_('fields.key_explain')}</small>
            </div>
        </div>

        <div class="grid gap-4 grid-cols-2 mb-6">
            {#each SailCMS.getLocales() as locale, idx}
                <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                    <label>{$_('fields.label') + ' (' + locale + ')'}:</label>
                    <input type="text" class="input" />
                </div>
            {/each}
        </div>

        <div class="grid gap-4 grid-cols-2 mb-6">
            {#each SailCMS.getLocales() as locale, idx}
                <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                    <label>{$_('fields.placeholder') + ' (' + locale + ')'}:</label>
                    <input type="text" class="input" />
                </div>
            {/each}
        </div>

        <div class="grid gap-4 grid-cols-2 mb-6">
            {#each SailCMS.getLocales() as locale, idx}
                <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                    <label>{$_('fields.explain') + ' (' + locale + ')'}:</label>
                    <input type="text" class="input" />
                </div>
            {/each}
        </div>

        <div>
            <label>{$_('fields.type')}:</label>
            <FieldTypeSearch
                placeholder={$_('fields.type_ph')}
                bind:this={searchField}
                bind:value={selectedType}
                types={availableTypes}
            />
        </div>
    </div>
{/if}