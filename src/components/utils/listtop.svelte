<script>
    import { Icon } from '@steeze-ui/svelte-icon';
    import { ChevronRight } from '@steeze-ui/heroicons';
    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';
    import SearchField from '@components/utils/searchfield.svelte';

    export let actionSelected = '';
    export let actions = [];
    export let search = false;
    export let isAllowed = true;

    const dispatch = createEventDispatcher();
    const setValue = (e) => dispatch('selected', actionSelected);
</script>

<div class="flex flex-row justify-between items-center mb-4">
    <div class="flex flex-row gap-x-2 items-center">
        {#if isAllowed}
            <div class="w-[250px]">
                <select bind:value={actionSelected} class="select !bg-white dark:!bg-surface-600 dark:!border-surface-900 !rounded-md">
                    {#each actions as action}
                        <option value={action.value}>{$_(action.label)}</option>
                    {/each}
                </select>
            </div>
            <div>
                <button on:click={setValue} class="btn transition-colors duration-150 {actionSelected !== '' ? 'variant-filled-primary' : 'disabled'}">
                    <span class="w-4 h-[22px]"><Icon src={ChevronRight}/></span>
                </button>
            </div>
        {/if}
    </div>

    <SearchField on:clear on:search class="w-4/12"/>
</div>

<style lang="scss">
    .disabled {
        @apply pointer-events-none bg-surface-200 text-surface-400 dark:variant-filled-surface opacity-50;
    }

    .fakefield {
        @apply flex flex-row items-center px-3 border bg-white dark:bg-surface-600 dark:border-surface-800 rounded-md;
        @apply focus-within:ring-1 focus-within:ring-primary-500 dark:focus-within:ring-surface-800;
    }

    .manual-input {
        @apply border-0 focus:ring-0 bg-white dark:bg-surface-600 flex-grow;
    }
</style>