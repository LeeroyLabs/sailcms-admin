<script>
    import { fade } from 'svelte/transition';
    import { LightSwitch } from '@skeletonlabs/skeleton';
    import { clickOutside } from '@/directives/clickout.js';
    import { cubicInOut } from 'svelte/easing';
    import { Icon } from '@steeze-ui/svelte-icon'
    import { Article } from '@steeze-ui/material-design-icons';
    import { locale } from 'svelte-i18n';
    import { AppStore } from '@stores/app.js';
    import { _ } from 'svelte-i18n';
    import { systembarNavigation } from '$lib/systembar.js';

    let navigationKey = '';

    const switchLocale = () =>
    {
        locale.set(($locale === 'fr') ? 'en' : 'fr');
        localStorage.setItem(import.meta.env.VITE_SAILCMS_LOCALE_TOKEN, $locale);
    }

    const hideMenu = () => navigationKey = '';
    const openMenu = (name) => navigationKey = name;
</script>

<div class="systembar">
    <div class="menuitems">
        <a href="javascript:void(0)" on:click={() => openMenu('main')} class="font-bold" use:clickOutside on:click_outside={hideMenu}>
            SailCMS

            {#if navigationKey === 'main'}
                <div out:fade={{duration: 200, easing: cubicInOut}} class="menubox">
                    {#each systembarNavigation.main as item}
                    <a href="javascript:void(0);" class="listitem">
                        <Icon src={item.icon} size="18"/> {$_(item.label)}
                    </a>
                    {/each}
                </div>
            {/if}
        </a>
        <a href="/dashboard">{$_('systembar.dashboard')}</a>
        <a href="javascript:void(0)" on:click={() => openMenu('entries')} use:clickOutside on:click_outside={hideMenu}>
            {$_('systembar.entries')}

            {#if navigationKey === 'entries'}
                <div out:fade={{duration: 200, easing: cubicInOut}} class="menubox">
                    {#each $AppStore.configuration.dataTypes as type}
                        <a href={'/entries/' + type.handle} class="listitem">
                            <Icon src={Article} size="18"/> {type.title}
                        </a>
                    {/each}
                </div>
            {/if}
        </a>
        <a href="javascript:void(0)" on:click={() => openMenu('cms')} use:clickOutside on:click_outside={hideMenu}>
            {$_('systembar.cms')}

            {#if navigationKey === 'cms'}
                <div out:fade={{duration: 200, easing: cubicInOut}} class="menubox">
                    {#each systembarNavigation.cms as item}
                        <a href="javascript:void(0);" class="listitem">
                            <Icon src={item.icon} size="18"/> {$_(item.label)}
                        </a>
                    {/each}
                </div>
            {/if}
        </a>
        <a href="">{$_('systembar.form_management')}</a>
        <a href="javascript:void(0)" on:click={() => openMenu('users')} use:clickOutside on:click_outside={hideMenu}>
            {$_('systembar.user_management')}

            {#if navigationKey === 'users'}
                <div out:fade={{duration: 200, easing: cubicInOut}} class="menubox">
                    {#each systembarNavigation.users as item}
                        <a href="javascript:void(0);" class="listitem">
                            <Icon src={item.icon} size="18"/> {$_(item.label)}
                        </a>
                    {/each}
                </div>
            {/if}
        </a>
        <a href="">SEO</a>
        <a href="javascript:void(0)" on:click={() => openMenu('utilities')} use:clickOutside on:click_outside={hideMenu}>
            {$_('systembar.utilities')}

            {#if navigationKey === 'utilities'}
                <div out:fade={{duration: 200, easing: cubicInOut}} class="menubox">
                    {#each systembarNavigation.utilities as item}
                        <a href="javascript:void(0);" class="listitem">
                            <Icon src={item.icon} size="18"/> {$_(item.label)}
                        </a>
                    {/each}
                </div>
            {/if}
        </a>
    </div>

    <div class="flex-grow flex flex-row justify-end gap-x-4">
        <button on:click={switchLocale} class="system-button text-[16px]">
            {($locale === 'en') ? 'FR' : 'EN'}
        </button>
        <LightSwitch bgLight="bg-surface-100" height="h-[24px]" />
    </div>
</div>

<style lang="scss">
    .systembar {
        @apply py-3 px-4 bg-white dark:bg-surface-700 w-full text-black flex flex-row gap-x-2;
        @apply border-b border-surface-200 dark:border-neutral-900;
    }

    .menuitems {
        @apply text-[15px] flex flex-row gap-x-5 text-black dark:text-surface-100;
    }

    .menubox {
        @apply font-normal absolute top-[43px] rounded-md bg-white border border-neutral-300;
        @apply dark:bg-surface-700 dark:text-surface-100 dark:border-surface-500;

        a:first-child {
            @apply rounded-t-md;
        }

        a:last-child {
            @apply rounded-b-md;
        }
    }

    .listitem {
        @apply flex flex-row py-2 px-3 pr-12 hover:bg-primary-500 hover:text-white cursor-pointer;
        @apply items-center gap-x-2;
    }

    .system-button {
        @apply dark:text-surface-100 text-surface-500 dark:hover:text-primary-700 hover:text-primary-700;
    }
</style>