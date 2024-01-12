<script>
    import { _ } from 'svelte-i18n';
    import { Entries } from '@graphql/lib/entries.js';
    import { SailCMS } from '@graphql/index.js';
    import { SlideToggle } from '@skeletonlabs/skeleton';

    export let config = {type: 'page', multi: false};
    export let type = 'entry';

    let isReady = false;
    let internalValue = {type: config.type || 'page', multi: config.type || false};
    let entryTypes = [];

    const handleSelect = () => config = internalValue;
    const updateMulti = () => config = internalValue;

    const init = async () =>
    {
        const types = await Entries.entryTypes(SailCMS.getLocales());

        for (let type of types) {
            entryTypes = [...entryTypes, {value: type.handle, label: type.title}];
        }

        isReady = true;
    }

    init();
</script>

<div class="grid grid-cols-1 gap-y-6">
    {#if isReady}
        <div>
            <label>{$_('fields.options.entry_type')} <span class="text-red-500">*</span>:</label>
            <select bind:value={internalValue.type} on:change={handleSelect} class="select !bg-white dark:!bg-surface-600 dark:!border-surface-900 !rounded-md">
                {#each entryTypes as type}
                    <option value={type.value}>{$_(type.label)}</option>
                {/each}
            </select>
        </div>

        <div>
            <SlideToggle
                    name="slider-label"
                    background="bg-surface-200 dark:bg-surface-400"
                    active="bg-primary-500"
                    bind:checked={internalValue.multi}
                    on:change={updateMulti}
            >
                {$_('fields.options.multi')}
            </SlideToggle>
        </div>
    {/if}
</div>