<script>
    import { _ } from 'svelte-i18n';
    import { AppStore } from '@stores/app.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Save } from '@steeze-ui/lucide-icons';
    import PageHead from '@components/structure/pagehead.svelte';
    import FieldTypeSearch from '@components/utils/typesearch.svelte';
    import TextField from '@components/fieldtypes/text.svelte';
    import Select from '@components//fieldtypes/select.svelte';
    import TextInput from '@components/forms/textinput.svelte';
    import Form from '@components//forms/form.svelte';
    import { SailCMS } from '@graphql/index.js';
    import { availableTypes } from '$lib/sources/availabletypes.js';

    export let data;
    let isReady = true;

    let pageForm;
    let title = 'fields.new';
    let searchField;
    let fields = [];
    let selectedType = 'select';
    let selectedComponent = Select; //TextField;
    let keyAllowEdit = false;

    // Fields
    let nameField, keyField;
    let labelFields = {};

    // Field Structure
    let fieldObject = {
        key: '',
        name: '',
        label: {fr: '', en: ''},
        placeholder: {fr: '', en: ''},
        explain: {fr: '', en: ''},
        type: 'text',
        validation: 'text',
        repeatable: false,
        required: false,
        config: {},
        searchable: false
    };

    let breadcrumb = [
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: false},
        {url: '/settings/fields', label: 'fields.title', active: false}
    ];

    const init = async () =>
    {
        if (data.id === 'new') {
            keyAllowEdit = true;
            breadcrumb = [...breadcrumb, {url: '', label: $_(title), active: true}];
            AppStore.setBreadcrumbs(breadcrumb);
        } else {

        }
    }

    const loadComponent = (e) =>
    {
        // Reset Config object
        fieldObject.config = {};
        selectedComponent = e.detail.component;
    }

    $: {
        console.log(fieldObject);

        if (pageForm) {
            pageForm.validate();
        }
    }

    init();

    // TODO: CONFIG VIEWS, REPEAT/REQUIRED, SAVE, LOAD, UPDATE
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
        <Form bind:this={pageForm}>
            <div class="grid grid-cols-2 gap-x-4">
                <div>
                    <label>{$_('fields.field_name')} <span class="text-red-500">*</span>:</label>
                    <TextInput type="text" bind:value={fieldObject.name} bind:this={nameField} validation={['required']} />
                </div>
                <div>
                    <label>{$_('fields.field_key')} <span class="text-red-500">*</span>:</label>
                    <TextInput type="text" bind:value={fieldObject.key} bind:this={keyField} validation={['required']} slugFormat={true} disabled={!keyAllowEdit} />
                    <small class="text-right block">{$_('fields.key_explain')}</small>
                </div>
            </div>

            <div class="grid gap-4 grid-cols-2 mb-6">
                {#each SailCMS.getLocales() as locale, idx}
                    <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                        <label>{$_('fields.label') + ' (' + locale + ')'} <span class="text-red-500">*</span>:</label>
                        <TextInput type="text" bind:value={fieldObject.label[locale]} bind:this={labelFields[locale]} validation={['required']} />
                    </div>
                {/each}
            </div>

            <div class="grid gap-4 grid-cols-2 mb-6">
                {#each SailCMS.getLocales() as locale, idx}
                    <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                        <label>{$_('fields.placeholder') + ' (' + locale + ')'}:</label>
                        <TextInput type="text" bind:value={fieldObject.placeholder[locale]} bind:this={labelFields[locale]} />
                    </div>
                {/each}
            </div>

            <div class="grid gap-4 grid-cols-2 mb-6">
                {#each SailCMS.getLocales() as locale, idx}
                    <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                        <label>{$_('fields.explain') + ' (' + locale + ')'}:</label>
                        <TextInput type="text" bind:value={fieldObject.explain[locale]} bind:this={labelFields[locale]} />
                    </div>
                {/each}
            </div>

            <div>
                <label>{$_('fields.type')} <span class="text-red-500">*</span>:</label>
                <FieldTypeSearch
                    placeholder={$_('fields.type_ph')}
                    bind:this={searchField}
                    bind:value={selectedType}
                    types={availableTypes}
                    on:change={loadComponent}
                />
            </div>

            {#if selectedComponent}
                <div class="mt-6">
                    <svelte:component this={selectedComponent} type={selectedType} bind:config={fieldObject.config} />
                </div>
            {/if}
        </Form>
    </div>
{/if}