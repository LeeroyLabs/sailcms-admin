<script>
    import { Icon } from '@steeze-ui/svelte-icon';
    import { ChevronRight } from '@steeze-ui/heroicons';
    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';

    export let actionSelected = '';
    export let actions = [];

    const dispatch = createEventDispatcher();

    const setValue = (e) => dispatch('selected', actionSelected);
</script>

<div class="flex flex-row gap-x-2 my-4 items-center">
    <div class="w-[250px]">
        <select bind:value={actionSelected} class="select !bg-surface-50 dark:!bg-surface-600 dark:!border-surface-900 !rounded-md">
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

<style lang="scss">
    .disabled {
        @apply pointer-events-none bg-surface-200 text-surface-400 dark:variant-filled-surface opacity-50;
    }
</style>