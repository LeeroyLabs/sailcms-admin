<script>
    import { _ } from 'svelte-i18n';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import TextInput from '@components/forms/textinput.svelte';

    export let config = {date_format: '', time_format: '', range: false};
    export let type = 'date';

    let internalValue = {date_format: '', time_format: '', range: false};

    const showTime = ['datetime'];
    const showDate = ['date', 'datetime'];

    let layout = '1col';
    let inited = false;

    $: {
        if (!inited) {
            if (type==='date') {
                internalValue.date_format = config.date_format || 'dd-MM-yyyy';
                internalValue.range = config.range || false;
                layout = '1col';
            } else if (type==='datetime') {
                internalValue.date_format = config.date_format || 'dd-MM-yyyy';
                internalValue.time_format = config.time_format || 'HH:mm:ss';
                internalValue.range = config.range || false;
                layout = '2col';
            }

            inited = true;
        }
    }

    const handleChange = () => config = internalValue;
    const handleRange = () => config = internalValue;
</script>

<div class="grid grid-cols-1 {layout === '2col' ? 'md:grid-cols-2' : ''} gap-y-6 gap-x-4">
    {#if showDate.includes(type)}
        <div>
            <label>{$_('fields.options.date_format')} <span class="text-red-500">*</span></label>
            <TextInput type="text" bind:value={internalValue.date_format} validation={['required']} on:keypress={handleChange} />
        </div>
    {/if}

    {#if showTime.includes(type)}
        <div>
            <label>{$_('fields.options.time_format')} <span class="text-red-500">*</span></label>
            <TextInput type="text" bind:value={internalValue.time_format} validation={['required']} on:keypress={handleChange} />
        </div>
    {/if}

    <div>
        <SlideToggle
                name="slider-label"
                background="bg-surface-200 dark:bg-surface-400"
                active="bg-primary-500"
                bind:checked={internalValue.range}
                on:change={handleRange}
        >
            {$_('fields.options.range')}
        </SlideToggle>
    </div>

</div>