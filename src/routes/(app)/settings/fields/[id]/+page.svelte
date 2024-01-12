<script>
    import { _ } from 'svelte-i18n';
    import { AppStore } from '@stores/app.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Save } from '@steeze-ui/lucide-icons';
    import PageHead from '@components/structure/pagehead.svelte';
    import FieldTypeSearch from '@components/utils/typesearch.svelte';
    import TextInput from '@components/forms/textinput.svelte';
    import Form from '@components//forms/form.svelte';
    import { SailCMS } from '@graphql/index.js';
    import { availableTypes } from '$lib/sources/availabletypes.js';
    import { ProgressRadial, SlideToggle } from '@skeletonlabs/skeleton';
    import { Entries } from '@graphql/lib/entries.js';
    import { Message } from '@stores/message.js';
    import { goto } from '$app/navigation';
    import { FieldsController } from '$lib/controllers/fields.js';

    export let data;
    let isReady = true;

    let pageForm;
    let title;
    let searchField;
    let fields = [];
    let selectedType = '';
    let selectedComponent = null;
    let keyAllowEdit = false;
    let isSaving = false;

    // Fields
    let nameField, keyField;
    let labelFields = {};

    let currentConfig = {hideRepeat: true, hideExplain: false, hideRequired: true};

    // Field Structure
    let fieldObject = {
        key: '',
        name: '',
        label: {fr: '', en: ''},
        placeholder: {fr: '', en: ''},
        explain: {fr: '', en: ''},
        type: '',
        validation: '',
        repeatable: false,
        required: false,
        config: {},
        searchable: false
    };

    const init = async () =>
    {
        const info = await FieldsController.fieldInit(data);
        keyAllowEdit = info.keyAllowEdit;
        title = info.title;

        // Set only if set
        if (info.field) fieldObject = info.field;
    }

    const loadComponent = (e) =>
    {
        // Reset Config object
        fieldObject.config = {};
        fieldObject.type = e.detail.value;
        selectedComponent = false;

        currentConfig = e.detail;

        // This is required for the same component to be reset (ex: Date vs DateTime)
        setTimeout(() => selectedComponent = e.detail.component, 25);
    }

    const saveField = async () =>
    {
        if (isSaving) return;

        let valid = pageForm.validate();
        let result;

        if (fieldObject.type === '') {
            valid = false;
        }

        if (valid) {
            isSaving = true;

            if (data.id === 'new') {
                result = await Entries.createEntryField(fieldObject);
            }

            isSaving = false;

            if (result) {
                Message.set({show: true, message: 'fields.toast.success', type: 'success', ttl: 2500});
                await goto($AppStore.baseURL + '/settings/fields');
            } else {
                Message.set({show: true, message: 'fields.toast.error', type: 'error', ttl: 2500});
            }
        } else {
            console.log('here');
        }
    }

    $: {
        console.log(fieldObject);
    }

    init();

    // TODO: SAVE, LOAD, UPDATE
</script>

{#if isReady}
    <PageHead bookmarkable={false}>
        <svelte:fragment slot="title">
            {$_(title)}
        </svelte:fragment>
        <svelte:fragment slot="actions">
            <a href="javascript:void(0);" on:click={saveField} class="btn variant-filled-primary">
                {#if isSaving}
                    <span><ProgressRadial width="w-4"/></span>
                {:else}
                    <span><Icon src={Save} size="20"/></span>
                {/if}
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
                    <TextInput type="text" bind:value={fieldObject.key} bind:this={keyField} validation={['required']} slugFormat={true} readonly={!keyAllowEdit} />
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

            {#if !currentConfig.hideExplain}
                <div class="grid gap-4 grid-cols-2 mb-6">
                    {#each SailCMS.getLocales() as locale, idx}
                        <div class="{SailCMS.getLocales().length % 2 !== 0 && idx+1 === SailCMS.getLocales().length ? 'col-span-2' : ''}">
                            <label>{$_('fields.explain') + ' (' + locale + ')'}:</label>
                            <TextInput type="text" bind:value={fieldObject.explain[locale]} bind:this={labelFields[locale]} />
                        </div>
                    {/each}
                </div>
            {/if}

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

            <div class="{(!currentConfig.hideRepeat || !currentConfig.hideRepeat) ? 'mt-6' : ''} flex flex-row gap-x-6">
                {#if !currentConfig.hideRepeat}
                    <SlideToggle
                        name="slider-label"
                        background="bg-surface-200 dark:bg-surface-400"
                        active="bg-primary-500"
                        bind:checked={fieldObject.repeatable}
                    >
                        {$_('fields.repeatable')}
                    </SlideToggle>
                {/if}

                {#if !currentConfig.hideRepeat}
                    <SlideToggle
                        name="slider-label"
                        background="bg-surface-200 dark:bg-surface-400"
                        active="bg-primary-500"
                        bind:checked={fieldObject.required}
                    >
                        {$_('fields.required')}
                    </SlideToggle>
                {/if}
            </div>
        </Form>
    </div>
{/if}