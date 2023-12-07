<script>
    export let arrowPosition = 'left';
    export let position = 'top-[50px] left-[-10px]';

    let positionClasses = '';

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
</script>

<div class="popup arrow-top {position} {positionClasses}">
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
        @apply bg-white dark:bg-surface-800 w-full p-4 rounded-md relative z-[998];
    }
</style>