<script>
    import { AppStore } from '@stores/app.js';
    import { _ } from 'svelte-i18n';
</script>

<svelte:head>
    <title>{$_($AppStore.breadcrumbs[$AppStore.breadcrumbs.length - 1]?.label)} - SailCMS</title>
</svelte:head>

{#if $AppStore.breadcrumbs.length > 1}
    <ol class="breadcrumb">
        {#each $AppStore.breadcrumbs as crumb, index}
            {#if index > 0}
                <li class="crumb-separator !mx-2" aria-hidden="true">&rsaquo;</li>
            {/if}

            {#if crumb.active}
                <li class="crumb !mx-0 font-bold">{$_(crumb.label)}</li>
            {:else}
                <li class="crumb !mx-0"><a class="anchor" href={crumb.url}>{$_(crumb.label)}</a></li>
            {/if}
        {/each}
    </ol>
{/if}
