<script>
    import { LoginController } from '@/controllers/login.js';
    import { _, locale } from 'svelte-i18n';
    import { Message } from '@stores/message.js';
    import { LightSwitch } from '@skeletonlabs/skeleton';
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import { authenticationGuard } from '$lib/helpers/guard.js';

    // Force move to dashboard if already logged in
    const credentialCheck = authenticationGuard();

    let emailAddress = '';
    let password = '';
    let mfaCode = '';

    let showVerification = false;

    const switchLocale = () =>
    {
        locale.set(($locale === 'fr') ? 'en' : 'fr');
        localStorage.setItem('sailcms_locale', $locale);
    }

    // let emailField, passwordField;
    // let isLoading = false;
    //
    // let showVerification = false;
    //
    // const submitForm = async () =>
    // {
    //     if (isLoading) return;
    //     isLoading = true;
    //
    //     const result = await LoginController.performLogin({email: emailField, password: passwordField});
    //     isLoading = false;
    //
    //     if (result.error) {
    //         // Show error Message
    //         Message.set({show: true, message: 'login.error_message', type: 'error', ttl: 15000});
    //         return;
    //     }
    //
    //     // Nothing to do, nothing happened
    //     if (result.invalid) return;
    //
    //     // Redirect
    //     window.location = '/dashboard';
    // }
</script>

<div class="loginbar">
    <div class="fixed top-6 right-4 flex flex-row gap-x-4">
        <button on:click={switchLocale}>{#if $locale === 'fr'}EN{:else}FR{/if}</button>
        <LightSwitch/>
    </div>
    <div class="text-4xl py-6">
        SAILCMS
    </div>

    {#await credentialCheck}
        <div class="w-full px-28 mt-5">
            <ProgressBar meter="bg-primary-600" />
        </div>
    {:then data}
        <div class="w-full px-14 flex flex-col gap-y-4">
            <input class="input" type="text" autocomplete="one-time-code" placeholder={$_('login.email')} />
            <input class="input" type="password" autocomplete="one-time-code" placeholder={$_('login.password')} />

            <div class="flex flex-row justify-between items-start">
                <button type="button" class="btn variant-filled-primary">{$_('login.sign_in')}</button>
                <a href="/forgot-password" class="text-xs">{$_('login.forgot') }</a>
            </div>
        </div>
    {/await}

    <div class="fixed bottom-4 right-4">
        <div class="flex flex-row text-xs mt-2">version 3.0.0</div>
    </div>

    {#if !showVerification}
        <div class="mt-12 w-full flex flex-col gap-y-4">
<!--            <TextField-->
<!--                    type="email"-->
<!--                    validation={['required', 'email']}-->
<!--                    placeholder="general.email"-->
<!--                    autofill={false}-->
<!--                    bind:value={emailAddress}-->
<!--                    bind:this={emailField}-->
<!--                    on:return={submitForm}-->
<!--            />-->

<!--            <TextField-->
<!--                    type="password"-->
<!--                    validation={['required']}-->
<!--                    placeholder="general.password"-->
<!--                    autofill={false}-->
<!--                    bind:value={password}-->
<!--                    bind:this={passwordField}-->
<!--                    on:return={submitForm}-->
<!--            />-->

<!--            <div class="flex flex-row justify-between items-center">-->
<!--                <Button loading={isLoading} icon={DownhillSkiing} on:click={submitForm} label="login.connect"/>-->

<!--                <a-->
<!--                        href="/forgot-password"-->
<!--                        data-sveltekit-preload-data="hover"-->
<!--                        class="text-sm text-skin-base hover:text-skin-muted">-->
<!--                    {$_('login.forgot_password')}-->
<!--                </a>-->
<!--            </div>-->

        </div>
    {:else}
        <div class="mt-12 w-full flex flex-col gap-y-4">
            <span class="text-sm text-center">{$_('general.verify_explain')}</span>
            <div class="w-full">
<!--                <TextField-->
<!--                        type="text"-->
<!--                        validation={['required']}-->
<!--                        bind:value={mfaCode}-->
<!--                        placeholder="general.verification_code"-->
<!--                        autofill={false}-->
<!--                />-->
            </div>
            <div>
                BUTTON
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .loginbar {
        @apply w-full sm:w-7/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-[400px] border-l border-tertiary-900;
        @apply flex flex-col items-center justify-center bg-surface-100 dark:bg-surface-800;
    }
</style>