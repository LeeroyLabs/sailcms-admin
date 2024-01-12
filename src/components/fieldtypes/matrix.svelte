<script>
    import { _ } from 'svelte-i18n';
    import { Entries } from '@graphql/lib/entries.js';
    import { SailCMS } from '@graphql/index.js';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { Menu, Trash } from '@steeze-ui/lucide-icons';
    import Sortable from 'sortablejs';
    import Searchable from '@components/utils/searchable.svelte';

    export let config = {fields: []};
    export let type = 'matrix';

    let internalValue = {fields: config.fields || []};
    let sortable = null;
    let selector = null;
    let isReady = false;
    let fieldList = [];
    let selectedField = null;

    const addField = () =>
    {
        internalValue.fields = [...internalValue.fields, selectedField];
        config = internalValue;
        selectedField = null;
        selector.clear();
    }

    const deleteField = (id) =>
    {
        let idx = internalValue.fields.findIndex(f => f === id);

        if (idx >= 0) {
            for (let field of fieldList) {
                if (field._id === id) {
                    field.used = false;
                }
            }

            internalValue.fields = internalValue.fields.filter((f, indx) => indx !== idx);
            config = internalValue;
            selector.updateFields(fieldList);
        }
    }

    const handleChange = () =>
    {
        let elms = document.getElementsByClassName('choice-item');
        let choices = [];

        for (let el of elms) {
            let id = el.getAttribute('data-id');
            let item = fieldList.find(f => f._id === id);
            choices = [...choices, item._id];
        }

        // Note: We do not update the internalValue here because it causes it reset the first time you move an item
        // This sets the right value at the top level and triggers all changes. The order of internalValue does not
        // matter at this point since the drag and drop library will tell us the order on every change.
        config.fields = choices;
    }

    const handleSelect = (e) =>
    {
        selectedField = e.detail

        for (let field of fieldList) {
            if (field._id === e.detail) {
                field.used = true;
            }
        }
    }

    const getField = (field) => fieldList.find(f => field === f._id);

    const init = async () =>
    {
        fieldList = await Entries.fields(SailCMS.getLocales());

        setTimeout(() => isReady = true, 25);

        const opts = {
            tag: 'div',
            direction: 'vertical',
            handle: '.list-dnd-handle',
            ghostClass: 'ghost',
            animation: 0,
            swapTreshold: 0.05,
            dragoverBubble: false,
            onEnd: handleChange
        };

        setTimeout(() =>
        {
            let el = document.querySelector('#choice-wrapper');
            sortable = new Sortable(el, opts);
        }, 50);
    }

    init();
</script>

{#if isReady}
    <div class="grid grid-cols-2 gap-y-6">
        <div class="w-full flex flex-row gap-x-4 items-center">
            <div class="flex-grow"><Searchable bind:this={selector} placeholder={$_('fields.options.add_field_ph')} showSelection={true} fields={fieldList} on:selected={handleSelect} /></div>
            <button on:click={addField} class="btn variant-filled-primary !py-[0.35rem]">{$_('system.add')}</button>
        </div>
        <div></div>

        <div id="choice-wrapper" class="choice-wrapper">
            {#each internalValue.fields as field, idx}
                {@const f = getField(field)}
                <div class="choice-item group" data-id={f._id}>
                    <div class="flex flex-row gap-x-4 items-center">
                        <div class="cursor-grab list-dnd-handle">
                            <Icon src={Menu} size="24"/>
                        </div>
                        <span>{f.name}</span>
                    </div>
                    <div class="flex-col items-center hidden group-hover:flex">
                        <button on:click={() => deleteField(f._id)} class="hover:text-red-500">
                            <Icon src={Trash} size="20" />
                        </button>
                    </div>
                </div>
            {:else}
                <h2 class="text-center text-lg text-surface-400 dark:text-surface-400">{$_('fields.options.no_fields')}</h2>
            {/each}
        </div>
    </div>
{/if}

<style lang="scss">
    .choice-wrapper {
        @apply border border-surface-300 dark:border-surface-400 p-4 rounded-md flex flex-col gap-y-4;
    }

    .choice-item {
        @apply flex flex-row justify-between items-center border border-surface-300;
        @apply dark:border-surface-400 p-4 hover:border-surface-500 dark:hover:border-surface-200;
        @apply dark:bg-surface-700;
    }

    .ghost {
        opacity: 0.55;
    }
</style>