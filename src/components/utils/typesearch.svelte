<script>
    import { _ } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import { clickOutside } from '@directives/clickout.js';
    import { searchable } from '$lib/helpers/text.js';
    import SearchField from '@components/utils/searchfield.svelte';
    import { v4 } from 'uuid';

    export let value = '';
    export let types = [];
    export let placeholder = '';

    let showingTypes = types;
    let text = '';
    let valueDisplay = '';
    let isFocused = false;
    let searchField;
    const sid = v4();

    const dispatch = createEventDispatcher();

    if (value !== '') {
        let type = types.find(t => t.value === value);

        if (type) {
            valueDisplay = type.title;
        } else {
            value = '';
        }
    }

    const clearSearch = () =>
    {
        showingTypes = types;
    }

    const searchFields = (e) =>
    {
        showingTypes = [];
        let stext = searchable(e.detail);

        for (let field of types) {
            let fname = searchable($_(field.title));

            if (fname.includes(stext)) {
                showingTypes = [...showingTypes, field];
            }
        }
    }

    const selectField = (v) =>
    {
        let type = types.find(t => t.value === v);

        if (type) {
            value = v;
            valueDisplay = type.title;
            isFocused = false;
            searchField.clearSearch();
            dispatch('change', type);
        }
    }

    const openField = () =>
    {
        isFocused = true
        setTimeout(() => document.getElementById('search-' + sid).focus(), 50);
    }
</script>

<div class="relative" use:clickOutside on:click_outside={() => isFocused = false}>
    <div
        class="input py-2 px-3 {isFocused ? '!border-primary-500' : ''} {value === '' ? 'text-surface-400' : ''}"
        on:click={openField}
    >
        {#if value === ''}
            {$_(placeholder)}
        {:else}
            {$_(valueDisplay)}
        {/if}
    </div>
    <div class="floating-box {!isFocused ? '!hidden' : ''}">
        <div class="px-3 mb-1 pt-2 relative">
            <SearchField id="search-{sid}" bind:this={searchField} searchOnPress={true} on:clear={clearSearch} on:search={searchFields}/>
        </div>
        <div class="typelist flex flex-col flex-grow overflow-y-auto">
            {#each showingTypes as field, idx}
                <button on:click={() => selectField(field.value)} role="option" aria-selected="false" class="flex flex-col">
                    <span class="text-lg">{$_(field.title)}</span>
                    <small>{$_(field.description)}</small>
                </button>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    .floating-box {
        @apply absolute z-[9999] top-[45px] left-0 border border-surface-300 overflow-y-auto;
        @apply hide-scrollbar h-[325px] w-[100%] bg-white rounded-md flex flex-col;
        @apply dark:bg-surface-700 dark:border-surface-500 overflow-hidden;
    }

    .typelist {
        button {
            @apply py-2 px-4 hover:bg-primary-500 hover:text-black;
        }
    }
</style>