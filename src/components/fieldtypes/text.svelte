<script>
    import { _ } from 'svelte-i18n';

    export let config = {min: 1, max: 255};
    export let type = 'text';

    let internalValue = {min: config.min || 1, max: config.max || 255};

    $: {
        config = internalValue;
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <div>
        {#if type === 'text' || type === 'password'}
            <label>{$_('fields.options.min_length')}:</label>
        {:else}
            <label>{$_('fields.options.min_num')}:</label>
        {/if}
        <input type="number" class="input" bind:value={internalValue.min}/>
    </div>

    <div>
        {#if type === 'text' || type === 'password'}
            <label>{$_('fields.options.max_length')}:</label>
        {:else}
            <label>{$_('fields.options.max_num')}:</label>
        {/if}
        <input type="number" class="input" bind:value={internalValue.max}/>
    </div>
</div>