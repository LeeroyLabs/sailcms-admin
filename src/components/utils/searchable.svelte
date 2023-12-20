<script>
    import { _ } from 'svelte-i18n';
    import { clickOutside } from '@directives/clickout.js';
    import { createEventDispatcher } from 'svelte';
    import { searchable } from '$lib/helpers/text.js';

    export let fields = [];
    export let hidePlaceholder = false;
    export let placeholder = '';

    let showingFields = fields;
    let text = '';
    let isFocused = false;

    const dispatch = createEventDispatcher();

    // $: showingFields = (fields) =>
    // {
    //     console.log("CHANGED");
    // }

    export const updateFields = (fieldsUpdate) =>
    {
        fields = fieldsUpdate;
        showingFields = fieldsUpdate;
    }

    const search = (text) =>
    {
        showingFields = [];

        for (let field of fields) {
            let fname = searchable(field.name);
            let stext = searchable(text);

            if (fname.includes(stext)) {
                showingFields = [...showingFields, field];
            }
        }
    }

    const selectField = (id) =>
    {
        dispatch('selected', id);
        text = '';
        search('');
        isFocused = false;
    }
</script>

<div class="relative" use:clickOutside on:click_outside={() => isFocused = false}>
    <input
        type="text"
        class="input"
        placeholder={hidePlaceholder ? '' : $_(placeholder)}
        on:focus={() => isFocused = true}
        on:keyup={(e) => search(e.target.value)}
    />

    <div class="floating-box {!isFocused ? '!hidden' : ''}">
        {#each showingFields as field, idx}
            <a
                href="javascript:void(0);"
                on:click={() => selectField(field._id)}
                class="truncate overflow-ellipsis {!field.used ? '' : ' text-surface-400 pointer-events-none'}"
            >
                {field.name}
            </a>
        {/each}
    </div>
</div>

<style lang="scss">
    .floating-box {
        @apply absolute z-[9999] top-[45px] left-[1px] border border-surface-400 overflow-y-auto;
        @apply hide-scrollbar max-h-[250px] w-[99%] bg-white rounded-md flex flex-col;
        @apply dark:bg-surface-700 dark:border-surface-800;

        a {
            @apply py-2 px-4 hover:bg-primary-500 hover:text-black;
        }
    }
</style>