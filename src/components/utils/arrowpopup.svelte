<script>
    import { v4 } from 'uuid';
    import { clickOutside } from '@directives/clickout.js';
    import { createEventDispatcher } from 'svelte';

    export let arrowPosition = 'left';
    export let position = 'top-[50px] left-[-10px]';
    export let id = v4();
    export let hideOnClickOutside = false;

    let css = '';
    export { css as class };

    let inline = '';
    export { inline as style };

    let positionClasses = '';

    const dispatch = createEventDispatcher();

    switch (arrowPosition)
    {
        default:
        case 'left':
            positionClasses = 'before:left-[10px] before:top-[-8px]';
            break;

        case 'center':
            positionClasses = 'before:left-[calc(50%-10px)] before:top-[-8px]';
            break;

        case 'right':
            positionClasses = 'before:right-[10px] before:top-[-8px]';
            break;
    }

    const hidePopup = () =>
    {
        if (hideOnClickOutside) {
            dispatch('hide');
        }
    }
</script>

<div {id} use:clickOutside on:click_outside={hidePopup} class="popup arrow-top {css !== '' ? css : position} {positionClasses}" style={inline}>
    <div class="popup-wrapper">
        <slot/>
    </div>
</div>

<style lang="scss">
    .popup {
        @apply absolute z-[9999] rounded-md border border-surface-300 dark:border-surface-400;
    }

    .popup:after {
        @apply content-[''] h-full w-full rounded-md absolute top-0 left-0;
    }

    .popup:before {
        @apply content-[''] h-[20px] w-[20px] rotate-[45deg] border border-surface-300 dark:border-surface-400 bg-white dark:bg-surface-800 absolute z-[998];
    }

    .popup-wrapper {
        @apply bg-white dark:bg-surface-800 w-full rounded-md relative z-[998];
    }
</style>