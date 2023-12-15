<script>
    import { Icon } from '@steeze-ui/svelte-icon';
    import { ChevronRight, MagnifyingGlass } from '@steeze-ui/heroicons';
    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { XCircle } from '@steeze-ui/lucide-icons';

    export let actionSelected = '';
    export let actions = [];
    export let search = false;

    let searchValue = '';

    const dispatch = createEventDispatcher();

    const setValue = (e) => dispatch('selected', actionSelected);

    const handleEnter = (e) =>
    {
        if (e.key === 'Enter') {
            if (searchValue.trim() === '') return;
            dispatch('search', searchValue);
        }
    }

    const clearSearch = () =>
    {
        searchValue = '';
        dispatch('clear');
    }

    // TODO: HANDLE SEARCH + CLEAR
</script>

<div class="flex flex-row justify-between items-center mb-4">
    <div class="flex flex-row gap-x-2 items-center">
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
    </div>

    <div class="fakefield w-4/12">
        <div><Icon src={MagnifyingGlass} size="22"/></div>
        <input type="text" bind:value={searchValue} class="manual-input" placeholder="Search..." on:keyup={handleEnter} />
        <button on:click={clearSearch} class="hover:text-primary-500">
            <Icon src={XCircle} size="22"/>
        </button>
    </div>
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