<script>
    import { _ } from 'svelte-i18n';

    export let config = {allowed_types: '.docx,.doc,.xlsx,.xls,.pdf,.pptx,.ppt'};
    export let type = 'assetfile';

    let internalValue = {allowed_types: config.allowed_types || '.docx,.doc,.xlsx,.xls,.pdf,.pptx,.ppt'};

    $: {
        config = internalValue;
    }
</script>

<div class="grid grid-cols-1 gap-4">
    <div>
        <label>{$_('fields.options.allowed_types')} <span class="text-red-500">*</span>:</label>
        <input type="text" class="input" bind:value={internalValue.allowed_types}/>
    </div>
</div>