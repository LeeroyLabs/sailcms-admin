<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { _ } from 'svelte-i18n';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { X } from '@steeze-ui/lucide-icons';

    export let title = '';
    export let show = false;

    const dispatch = createEventDispatcher();

    const close = () =>
    {
        dispatch('close');
    }
</script>

{#if show}
    <div in:fade={{duration: 250}} out:fade={{duration: 250}} class="fixed inset-0 bg-black/60 flex flex-col justify-center items-center">
        <div class="bg-surface-700 rounded-md min-w-[300px] max-w-11/12 md:max-w-8/12 lg:max-w-6/12 border border-surface-700">
            <header class="flex flex-row p-4 bg-surface-900 rounded-t-md">
                <h2 class="flex-grow font-medium">
                    {$_(title)}
                </h2>
                <button class="hover:text-primary-500" on:click={close}>
                    <Icon src={X} size="20"/>
                </button>
            </header>
            <p class="p-4 my-4">
                <slot name="content"/>
            </p>
            <footer class="flex flex-row justify-end p-4 pt-0 gap-x-2">
                <slot name="buttons"/>
            </footer>
        </div>
    </div>
{/if}