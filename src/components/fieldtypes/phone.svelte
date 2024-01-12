<script>
    import { Countries } from '$lib/sources/countries.js';
    import { _ } from 'svelte-i18n';

    export let config = {};
    export let type = 'phone';

    let internalValue = {country: config.country || 'all'};

    const selectList = [{value: 'all', label: 'fields.options.all_countries'}];

    for (let code of Countries) {
        selectList.push({value: code, label: 'countries.' + code});
    }

    const handleSelect = (e) => config = internalValue;
</script>

<div>
    <label>{$_('fields.options.country')}:</label>
    <select bind:value={internalValue.country} on:change={handleSelect} class="select !bg-white dark:!bg-surface-600 dark:!border-surface-900 !rounded-md">
        {#each selectList as country}
            <option value={country.value}>{$_(country.label)}</option>
        {/each}
    </select>
</div>