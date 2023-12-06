<script>
    import { AppStore } from '@stores/app.js';
    import { _ } from 'svelte-i18n';
</script>

{#if $AppStore.breadcrumbs.length > 1}
    <ol class="breadcrumb">
        {#each $AppStore.breadcrumbs as crumb, index}
            {#if index > 0}
                <li class="crumb-separator" aria-hidden="true">&rsaquo;</li>
            {/if}

            {#if crumb.active}
                <li class="crumb font-bold">{$_(crumb.label)}</li>
            {:else}
                <li class="crumb"><a class="anchor" href="/elements/breadcrumbs">{$_(crumb.label)}</a></li>
            {/if}
        {/each}
    </ol>
{/if}