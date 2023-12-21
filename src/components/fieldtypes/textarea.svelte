<script>
    import { _ } from 'svelte-i18n';

    export let config = {rows: 8, max: -1};
    export let type = 'textarea';

    let internalValue = {rows: config.rows || 8, max: config.max || -1};

    $: {
        config = internalValue;
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <div>
        <label>{$_('fields.options.rows')}:</label>
        <input type="number" class="input" bind:value={internalValue.rows}/>
    </div>

    <div>
        <label>{$_('fields.options.max_chars')}:</label>
        <input type="number" class="input" bind:value={internalValue.max}/>
        <small class="text-right block">{$_('fields.options.max_chars_explain')}</small>
    </div>
</div>