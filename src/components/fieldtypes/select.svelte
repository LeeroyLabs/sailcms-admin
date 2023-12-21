<script>
    import { _ } from 'svelte-i18n';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { AlertTriangle } from '@steeze-ui/lucide-icons';
    import TextInput from '@components/forms/textinput.svelte';

    export let config = {choices: []};
    export let type = 'select';

    let internalValue = {choices: config.choices || []};

    let label = '';
    let value = '';

</script>

<div class="grid grid-cols-2 gap-y-6">
    <div class="w-full flex flex-row gap-x-4 items-center">
        <TextInput type="text" blockClass="flex-grow" bind:value={label} validation={['required']} placeholder={$_('fields.options.value')} />
        <TextInput type="text" blockClass="flex-grow" bind:value={value} validation={['required']} placeholder={$_('fields.options.select_label')} />

        <button class="btn variant-filled-primary">Add</button>
    </div>
    <div></div>

    <div class="col-span-1 alert variant-ghost-error">
        <div class="text-red-300">
            <Icon src={AlertTriangle} size="24"/>
        </div>
        <div class="alert-message text-red-300">
            <p>You cannot add the same value twice.</p>
        </div>
    </div>
    <div></div>

    <div class="border border-surface-300 dark:border-surface-400 p-4 rounded-md">
        {#each internalValue.choices as choice, idx}
            ggg
        {:else}
            <h2 class="text-center text-lg text-surface-400 dark:text-surface-400">{$_('fields.options.no_choices')}</h2>
        {/each}
    </div>
    <div></div>

    <div>ALLOW MULTIPLE</div>
</div>