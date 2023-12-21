<script>
    import { _ } from 'svelte-i18n';
    import TextInput from '@components/forms/textinput.svelte';

    let opts = {
        name: '',
        min: {width: 0, height: 0},
        max: {width: 0, height: 0},
        ratio: 1.778, // 16:9
        lockedType: '',
        multi: false
    };

    let keyField, ratioField, minWField, minHField, maxWField, maxHField;

    export let config = opts;
    export let type = 'assetimage';

    let internalValue = {
        name: config.name || '',
        min: config.min || {width: 0, height: 0},
        max: config.max || {width: 0, height: 0},
        ratio: config.ratio || 1.778, // 16:9
        lockedType: config.lockedType || '',
        multi: config.multi || false
    };

    $: {
        config = internalValue;
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <div>
        <label>{$_('fields.options.crop_name')} <span class="text-red-500">*</span>:</label>
        <TextInput type="text" bind:value={internalValue.name} bind:this={keyField} validation={['required']} />
        <small class="text-right block">{$_('fields.crop_key_explain')}</small>
    </div>

    <div>
        <label>{$_('fields.options.ratio')} <span class="text-red-500">*</span>:</label>
        <TextInput type="number" bind:value={internalValue.ratio} bind:this={ratioField} validation={['required']} />
        <small class="text-right block">{$_('fields.ratio_explain')}</small>
    </div>

    <div>
        <label>{$_('fields.field_name')} <span class="text-red-500">*</span>:</label>
        <TextInput type="number" bind:value={internalValue.min.width} bind:this={minWField} validation={['required']} />
    </div>

    <div>
        <label>{$_('fields.field_name')} <span class="text-red-500">*</span>:</label>
        <TextInput type="number" bind:value={internalValue.min.height} bind:this={minHField} validation={['required']} />
    </div>

    <div>
        <label>{$_('fields.field_name')} <span class="text-red-500">*</span>:</label>
        <TextInput type="number" bind:value={internalValue.max.width} bind:this={maxWField} validation={['required']} />
    </div>

    <div>
        <label>{$_('fields.field_name')} <span class="text-red-500">*</span>:</label>
        <TextInput type="number" bind:value={internalValue.max.height} bind:this={maxHField} validation={['required']} />
    </div>


</div>