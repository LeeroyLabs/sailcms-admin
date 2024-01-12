<script>
    import { _ } from 'svelte-i18n';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { AlertTriangle, Menu, Trash } from '@steeze-ui/lucide-icons';
    import TextInput from '@components/forms/textinput.svelte';
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';
    import { SlideToggle } from '@skeletonlabs/skeleton';

    export let config = {choices: [], multi: false};
    export let type = 'select';

    let internalValue = {choices: config.choices || [], multi: config.multi || false};

    let label = '';
    let value = '';
    let showError = false;
    let sortable;

    const addChoice = () =>
    {
        let foundValue = internalValue.choices.find(c => c.value === value);

        if (foundValue) {
            showError = true;
            return;
        }

        internalValue.choices = [...internalValue.choices, {value: value, label: label}];
        config.choices = internalValue.choices;

        value = '';
        label = '';
    }

    const deleteChoice = (idx) =>
    {
        internalValue.choices = internalValue.choices.filter((c, ind) => ind !== idx);
        config.choices = internalValue.choices;
    }

    const handleChange = (e) =>
    {

        let elms = document.getElementsByClassName('choice-item');
        let choices = [];

        for (let el of elms) {
            let value = el.getAttribute('data-value');
            let item = internalValue.choices.find(c => c.value === value);
            choices = [...choices, item];
        }

        // Note: We do not update the internalValue here because it causes it reset the first time you move an item
        // This sets the right value at the top level and triggers all changes. The order of internalValue does not
        // matter at this point since the drag and drop library will tell us the order on every change.
        config.choices = choices;
    }

    const updateMulti = (e) => config = internalValue;

    onMount(() =>
    {
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

        let el = document.querySelector('#choice-wrapper');
        sortable = new Sortable(el, opts);
    });
</script>

<div class="grid grid-cols-2 gap-y-6">
    <div class="w-full flex flex-row gap-x-4 items-center">
        <TextInput type="text" blockClass="flex-grow" bind:value={value} validation={['required']} placeholder={$_('fields.options.value')} />
        <TextInput type="text" blockClass="flex-grow" bind:value={label} validation={['required']} placeholder={$_('fields.options.select_label')} />

        <button on:click={addChoice} class="btn variant-filled-primary">{$_('system.add')}</button>
    </div>
    <div></div>

    {#if showError}
        <div class="col-span-1 alert variant-ghost-error">
            <div class="text-red-300">
                <Icon src={AlertTriangle} size="24"/>
            </div>
            <div class="alert-message text-red-300">
                <p>{$_('fields.value_exists')}.</p>
            </div>
        </div>
        <div></div>
    {/if}

    <div id="choice-wrapper" class="choice-wrapper">
        {#each internalValue.choices as choice, idx}
            <div class="choice-item group" data-value={choice.value}>
                <div class="flex flex-row gap-x-4 items-center">
                    <div class="cursor-grab list-dnd-handle">
                        <Icon src={Menu} size="24"/>
                    </div>
                    <span>{choice.value} &mdash; {choice.label}</span>
                </div>
                <div class="flex-col items-center hidden group-hover:flex">
                    <button on:click={() => deleteChoice(idx)} class="hover:text-red-500">
                        <Icon src={Trash} size="20" />
                    </button>
                </div>
            </div>
        {:else}
            <h2 class="text-center text-lg text-surface-400 dark:text-surface-400">{$_('fields.options.no_choices')}</h2>
        {/each}
    </div>
    <div></div>

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
</div>

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