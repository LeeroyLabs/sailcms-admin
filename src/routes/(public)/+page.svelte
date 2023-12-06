<script>
    import { LoginController } from '$lib/controllers/login.js';
    import { _, locale } from 'svelte-i18n';
    import { Message } from '@stores/message.js';
    import { LightSwitch, ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
    import TextInput from '@components/forms/textinput.svelte';
    import { AppStore } from '@stores/app.js';

    let emailField, passwordField;
    let isLoading = false;

    const switchLocale = () =>
    {
        locale.set(($locale === 'fr') ? 'en' : 'fr');
        localStorage.setItem(import.meta.env.VITE_SAILCMS_LOCALE_TOKEN, $locale);
    }

    const submitForm = async () =>
    {
        if (isLoading) return;
        isLoading = true;

        const result = await LoginController.performLogin({email: emailField, password: passwordField});

        console.log(result);

        if (!result.error) {
            const user = await LoginController.getUserFromAuthentication(result.data);

            if (user) {
                AppStore.setCurrentUser(user);
                AppStore.setLoginState(true);
                localStorage.setItem(import.meta.env.VITE_SAILCMS_TOKEN, user.auth_token);
                isLoading = false;

                window.location.href = $AppStore.baseURL + '/dashboard';
            }
        } else {
            // Show error Message
            Message.set({show: true, message: 'login.errors.bad_credentials', type: 'error', ttl: 15000});
        }
    }
</script>

<div class="loginbar">
    <div class="fixed top-6 right-4 flex flex-row gap-x-4">
        <button on:click={switchLocale}>{#if $locale === 'fr'}EN{:else}FR{/if}</button>
        <LightSwitch/>
    </div>
    <div class="text-4xl py-6">
        SAILCMS
    </div>

    {#await $AppStore.guardCheck}
        <div class="w-full px-28 mt-5">
            <ProgressBar meter="bg-primary-600" />
        </div>
    {:then data}
        <div class="w-full px-14 flex flex-col gap-y-4">
            <TextInput placeholder="login.email" validation={['required', 'email']} bind:this={emailField} />
            <TextInput placeholder="login.password" validation={['required']} type="password" bind:this={passwordField} on:return={submitForm} />

            <div class="flex flex-row justify-between items-start">
                <button type="button" class="btn variant-filled-primary flex flex-col" on:click={submitForm}>
                    {#if isLoading}
                        <ProgressRadial width="w-6" />
                    {:else}
                        {$_('login.sign_in')}
                    {/if}
                </button>
                <a href="/forgot-password" class="text-xs">{$_('login.forgot') }</a>
            </div>
        </div>
    {/await}

    <div class="fixed bottom-4 right-4">
        <div class="flex flex-row text-xs mt-2">version 3.0.0</div>
    </div>
</div>

<style lang="scss">
    .loginbar {
        @apply w-full sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-[400px] border-l border-tertiary-900;
        @apply flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-800;
    }
</style>