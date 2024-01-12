<script>
    import { _ } from 'svelte-i18n';
    import { v4 } from 'uuid';
    import { createEventDispatcher } from 'svelte';
    import { Icon } from '@steeze-ui/svelte-icon';
    import { ErrorOutline } from '@steeze-ui/material-design-icons';
    import { Validation } from '$lib/helpers/validation.js';
    import { searchable } from '$lib/helpers/text.js';

    // Props
    export let value = '';
    export let placeholder = '';
    export let disabled = false;
    export let type = 'text';
    export let id = v4();
    export let autocomplete = false;
    export let readonly = false;
    export let validation = [];
    export let css = '';
    export let blockCss = '';
    export let isValid = true;
    export let slugFormat = false;

    // Special Exports
    export { css as class };
    export { blockCss as blockClass };

    // Internals
    let hasError = false

    const dispatcher = createEventDispatcher();

    export const validate = () =>
    {
        if (slugFormat) {
            value = searchable(value, true);
        }

        if (validation.length === 0) {
            hasError = false;
            isValid = true;
            return;
        }

        // Assume it's good, then find a reason to make it bad
        isValid = true;

        for (let rule of validation) {
            const result = Validation.validate(value, rule);
            if (!result) isValid = false;
        }

        if (!isValid) hasError = true;
        if (isValid) hasError = false;
    }

    export const handleKeypress = (e) =>
    {
        if (e.keyCode === 13) dispatcher('return');
    }
</script>

<svelte:options accessors/>
<div class="relative {blockCss}">
    {#if type === 'text'}
        <input
            class="input validation {css} {hasError ? 'is-error !border-error-500' : ''}"
            type="text"
            data-validation={validation}
            data-validate={validation.length > 0}
            data-error-id="validation-error-{id}"
            readonly={readonly}
            autocomplete="{(autocomplete) ? '' : 'one-time-code'}"
            bind:value={value}
            placeholder={$_(placeholder)}
            on:blur={validate}
            on:keypress={handleKeypress}
        />
    {:else if type === 'password'}
        <input
            class="input validation {css} {hasError ? 'is-error !border-error-500' : ''}"
            type="password"
            readonly={readonly}
            data-validation={validation}
            data-validate={validation.length > 0}
            data-error-id="validation-error-{id}"
            autocomplete="{(autocomplete) ? '' : 'one-time-code'}"
            bind:value={value}
            placeholder={$_(placeholder)}
            on:blur={validate}
            on:keypress={handleKeypress}
        />
    {:else if type === 'number'}
        <input
            class="input validation {css} {hasError ? 'is-error !border-error-500' : ''}"
            type="number"
            readonly={readonly}
            data-validation={validation}
            data-validate={validation.length > 0}
            data-error-id="validation-error-{id}"
            autocomplete="{(autocomplete) ? '' : 'one-time-code'}"
            bind:value={value}
            placeholder={$_(placeholder)}
            on:blur={validate}
            on:keypress={handleKeypress}
        />
    {:else if type === 'email'}
        <input
            class="input validation {css} {hasError ? 'is-error !border-error-500' : ''}"
            type="email"
            readonly={readonly}
            data-validation={validation}
            data-validate={validation.length > 0}
            data-error-id="validation-error-{id}"
            autocomplete="{(autocomplete) ? '' : 'one-time-code'}"
            bind:value={value}
            placeholder={$_(placeholder)}
            on:blur={validate}
            on:keypress={handleKeypress}
        />
    {/if}

    <div id="validation-error-{id}" class="text-error-500 h-6 w-6 absolute top-2 right-2 {hasError ? '' : 'invisible'}">
        <Icon src={ErrorOutline}/>
    </div>
</div>