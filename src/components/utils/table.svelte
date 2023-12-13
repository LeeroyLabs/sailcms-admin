<script>
    import { _ } from 'svelte-i18n';
    import { linkTo } from '$lib/helpers/navigation.js';
    import { v4 } from 'uuid';

    export let columns = [];
    export let rows = [];1
    export let emptyRows = 'system.no_data_for_now';
    export let selectedList = [];

    const id = v4();
    let queryAllState = false;

    const handleClick = (row) => linkTo(row.link);

    const selectRow = (row, idx) =>
    {
        const el = document.getElementById('row_' + idx);
        const inList = selectedList.find(id => id === el.value);

        if (!inList) {
            el.checked = true;
            selectedList = [...selectedList, el.value];
            return;
        }

        el.checked = false;
        selectedList = selectedList.filter(id => id !== el.value);
    }

    const toggleAll = () =>
    {
        selectedList = [];

        document.querySelectorAll('.children').forEach(chk =>
        {
            if (!queryAllState) {
                chk.checked = true;
                queryAllState = true;
                selectedList = [...selectedList, chk.value]
                return;
            }

            queryAllState = false;
            chk.checked = false;
        });
    }
</script>

<div class="border-2 rounded border-surface-200 dark:border-surface-800">
    <table class="w-full">
        <thead class="bg-surface-200 dark:bg-surface-800 border-b border-surface-300 dark:border-surface-400 tablehead">
            {#each columns as column, index}
                {#if column.title === 'check'}
                    <th class="py-3 px-2 text-center w-[44px]">
                        <input id={id} type="checkbox" class="chk" on:click={toggleAll} />
                    </th>
                {:else}
                    <th class="py-3 px-2 text-left {column.css} {column.center ? 'text-center' : ''}">{$_(column.title)}</th>
                 {/if}
            {/each}
        </thead>
        <tbody class="tablebody">
            {#each rows as row, ridx}
                <tr on:click={() => handleClick(row)} class="{row.hasLink ? 'has-link' : ''}">
                    {#if row.check}
                        <td class="text-center"><input type="checkbox" id="row_{ridx}" class="chk children" value={row.id} on:click|stopPropagation={() => selectRow(row, ridx)} /></td>
                    {/if}

                    {#each row.data as col, cidx}
                        <td class="{col.options.center ? 'text-center' : ''}">{@html col.data}</td>
                    {/each}
                </tr>
            {:else}
                <tr class="nohover"><td colspan={columns.length} class="text-center text-lg text-surface-500 dark:text-surface-300">{$_(emptyRows)}</td></tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .tablehead {
        th:first-child {
            @apply rounded-tl;
        }

        th:last-child {
            @apply rounded-tr;
        }
    }

    .tablebody {
        tr {
            @apply bg-surface-50 dark:bg-surface-500;

            td {
                @apply px-3 py-3;
            }
        }

        tr:not(.nohover) {
            @apply hover:bg-surface-300 dark:hover:bg-surface-800 dark:hover:text-surface-50;
        }

        tr:nth-child(even) {
            @apply dark:bg-surface-700 bg-surface-200 hover:bg-surface-300 hover:dark:text-surface-50;
        }

        tr:last-child {
            @apply rounded-b;
        }
    }

    [type='checkbox']:focus {
        @apply ring-offset-2 ring-offset-primary-600;
    }

    .chk {
        @apply focus:ring-0 focus:border-0 border-0;

        &:checked {
            @apply bg-primary-400;
        }
    }

    .has-link {
        @apply cursor-pointer;
    }
</style>