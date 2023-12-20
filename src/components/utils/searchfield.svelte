<script>
    import { MagnifyingGlass } from '@steeze-ui/heroicons';
    import { XCircle } from '@steeze-ui/lucide-icons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { _ } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';

    export let id = '';
    export let searchValue = '';
    export let searchOnPress = false;

    let css = '';
    export { css as class };

    const dispatch = createEventDispatcher();

    const handleEnter = (e) =>
    {
        if (searchOnPress) {
            dispatch('search', searchValue);
            return;
        }

        if (e.key === 'Enter') {
            if (searchValue.trim() === '') return;
            dispatch('search', searchValue);
        }
    }

    export const clearSearch = () =>
    {
        searchValue = '';
        dispatch('clear');
    }
</script>

<div class="fakefield {css}">
    <div><Icon src={MagnifyingGlass} size="22"/></div>
    <input {id} type="text" bind:value={searchValue} class="manual-input" placeholder="{$_('system.search')}..." on:keyup={handleEnter} />

    {#if searchValue.trim() !== ''}
        <button on:click={clearSearch} class="hover:text-primary-500">
            <Icon src={XCircle} size="22"/>
        </button>
    {/if}
</div>

<style lang="scss">
    .fakefield {
        @apply flex flex-row items-center px-3 border bg-white dark:bg-surface-600 dark:border-surface-800 rounded-md;
        @apply focus-within:ring-1 focus-within:ring-primary-500 dark:focus-within:ring-surface-800;
    }

    .manual-input {
        @apply border-0 focus:ring-0 bg-white dark:bg-surface-600 flex-grow;
    }
</style>