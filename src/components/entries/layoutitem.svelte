<script>
    import { _ } from 'svelte-i18n';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { fieldName } from '$lib/helpers/layouts.js';
    import { Columns, Expand, Square, Trash2, Ruler, ArrowBigUpDash, ArrowBigDownDash } from '@steeze-ui/lucide-icons';
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import tippy from 'tippy.js';
    import 'tippy.js/dist/tippy.css';
    import ArrowPopup from '@components/utils/arrowpopup.svelte';
    import { v4 } from 'uuid';

    export let field;
    export let fields;

    let showSubBlock = false;
    let positionCSS = '';

    const popupId = 'ap-' + v4();
    const rulerId = v4();

    const dispatch = createEventDispatcher();

    const showSubNav = (e) =>
    {
        calculatePosition();
        showSubBlock = true;
    }

    const calculatePosition = () =>
    {
        const rect = document.getElementById('ruler-btn-' + rulerId).getBoundingClientRect();
        positionCSS = `top: ${rect.y + 40}px; left: ${rect.x - 42}px`;
    }

    const applySize = (size) =>
    {
        showSubBlock = false;
        dispatch('set', size);
    }

    onMount(() =>
    {
        setTimeout(() => tippy('.button'), 100);
        window.addEventListener('resize', calculatePosition);
    });

    onDestroy(() => window.removeEventListener('resize', calculatePosition));
</script>

<div class="field relative {field.width} bg-gray-100 dark:bg-surface-600">
    <div>{fieldName(field.id, fields)}</div>
    <div class="flex flex-row items-center justify-end gap-x-2">
        <button class="size-button button" data-tippy-content={$_('layout.editor.move_up')}>
            <Icon src={ArrowBigUpDash} size="24"/>
        </button>
        <button class="size-button button" data-tippy-content={$_('layout.editor.move_down')}>
            <Icon src={ArrowBigDownDash} size="24"/>
        </button>

        <button on:click={showSubNav} id="ruler-btn-{rulerId}" class="size-button button" data-tippy-content={$_('layout.editor.width')}>
            <Icon src={Ruler} size="24"/>
        </button>
        <button
            class="hover:text-error-500 button"
            data-tippy-delay="[250,0]"
            data-tippy-content={$_('layout.editor.delete')}
        >
            <Icon src={Trash2} size="24"/>
        </button>

        <ArrowPopup on:hide={() => showSubBlock = false} id={popupId} hideOnClickOutside={true} arrowPosition="center" class="{showSubBlock ? '!fixed' : 'hidden'}" style={positionCSS}>
            <div class="flex flex-row gap-x-2 p-2">
                <button
                        on:click={() => applySize('third')}
                        class="size-button button"
                        data-tippy-content={$_('layout.editor.third')}
                        data-tippy-delay="[250, 0]"
                >
                    <Icon src={Square} size="24"/>
                </button>

                <button
                        on:click={() => applySize('half')}
                        class="size-button button"
                        data-tippy-content={$_('layout.editor.half')}
                        data-tippy-delay="[250,0]"
                >
                    <Icon src={Columns} size="24"/>
                </button>

                <button
                        on:click={() => applySize('full')}
                        class="size-button button"
                        data-tippy-content={$_('layout.editor.full')}
                        data-tippy-delay="[250,0]"
                >
                    <Icon src={Expand} size="24"/>
                </button>
            </div>
        </ArrowPopup>
    </div>
</div>

<style lang="scss">
     .field {
        @apply py-4 px-4 border border-surface-400 rounded-md;
        @apply flex flex-row items-center justify-between;

        &.third {
            @apply col-span-1;
        }

        &.half {
            @apply col-span-2;
        }

        &.full {
            @apply col-span-3;
        }
    }

    .size-button {
        @apply hover:text-primary-500;
    }
</style>