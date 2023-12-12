<script>
    import { fade } from 'svelte/transition';
    import { clickOutside } from '@directives/clickout.js';
    import ArrowPopup from '@components/utils/arrowpopup.svelte';
    import { Bookmarks } from '@steeze-ui/material-design-icons';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { AppStore } from '@stores/app.js';
    import { locale } from 'svelte-i18n';

    export let show = false;
</script>

<div class="flex items-center">
    <button class="hover:text-primary-500" on:click={() => show = !show}>
        <Icon src={Bookmarks} size="22"/>
    </button>

    {#if show}
        <div in:fade={{duration: 250}} out:fade={{duration: 250}} use:clickOutside on:click_outside={() => show = false}>
            <ArrowPopup arrowPosition="left" position="min-w-[150px] top-[38px] left-[-10px]">
                <div class="flex flex-col bookmarks">
                    {#each $AppStore.currentUser.bookmarks as bm}
                    <a href="">{bm.name[$locale]}</a>
                    {:else}
                        <div class="text-center mx-8 text-surface-500 dark:text-surface-400">No bookmarks yet.</div>
                    {/each}
                </div>
            </ArrowPopup>
        </div>
    {/if}
</div>

<style lang="scss">
    .bookmarks {
        a {
            @apply hover:bg-primary-500 px-4 py-2;
            @apply dark:hover:text-black;
        }

        a:first-child {
            @apply rounded-t;
        }

        a:last-child {
            @apply rounded-b;
        }
    }
</style>