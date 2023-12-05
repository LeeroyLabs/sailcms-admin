<script>
    import { fade } from 'svelte/transition';
    import { LightSwitch } from '@skeletonlabs/skeleton';
    import { clickOutside } from '@/directives/clickout.js';
    import { cubicInOut } from 'svelte/easing';
    import { Icon } from '@steeze-ui/svelte-icon'
    import { ConfirmationNumber } from '@steeze-ui/material-design-icons';
    import { NavigationHandler } from '$lib/helpers/navigation.js';
    import { locale } from 'svelte-i18n';
    import { Permission } from '@stores/permission.js';

    let navigationKey = '';

    // $: navigation = NavigationHandler.formatNavigation(
    //         $locale,
    //         $Permission.list,
    //         window.location.pathname,
    //         $Session.user,
    //         $Session.id,
    //         $Session.incognito
    // );

    const hideMenu = () => navigationKey = '';
    const openMenu = (name) => navigationKey = name;
</script>

<div class="systembar">
    <div class="menuitems">
        <a href="javascript:void(0)" on:click={() => openMenu('main')} class="font-bold" use:clickOutside on:click_outside={hideMenu}>
            SnowStorm

            {#if navigationKey === 'main'}
                <div out:fade={{duration: 300, easing: cubicInOut}} class="menubox">
                    <a href="javascript:void(0);" class="listitem">
                        À Props de SnowStorm
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Me Déconnecter
                    </a>
                </div>
            {/if}
        </a>
        <a href="/dashboard">Dashboard</a>
        <a href="javascript:void(0)" on:click={() => openMenu('ecom')} use:clickOutside on:click_outside={hideMenu}>
            E-Commerce

            {#if navigationKey === 'ecom'}
                <div out:fade={{duration: 300, easing: cubicInOut}} class="menubox">
                    <a href="javascript:void(0);" class="listitem">
                        <Icon src={ConfirmationNumber} size="18"/> Produits
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Commandes
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Coupons
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Ski Passe-Partout
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Codes D'invistations
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Renouvellements
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Réservations
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Remboursements
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        Cartes Cadeaux
                    </a>
                    <a href="javascript:void(0)" class="listitem">
                        SGR
                    </a>
                </div>
            {/if}
        </a>
        <a href="">CRM</a>
        <a href="">Gestion</a>
        <a href="">PassCheck</a>
    </div>


    <div class="flex-grow flex flex-row justify-end">
        <LightSwitch bgLight="bg-surface-100" />
    </div>
</div>

<style lang="scss">
    .systembar {
        @apply py-1 px-3 bg-white dark:bg-neutral-500 w-full text-black flex flex-row gap-x-2;
        @apply border-b border-neutral-200 dark:border-neutral-900;
    }

    .menuitems {
        @apply text-[15px] flex flex-row gap-x-3 text-black;
    }

    .menubox {
        @apply font-normal absolute top-[35px] rounded-md bg-white border border-neutral-300;
    }

    .listitem {
        @apply flex flex-row py-2 px-3 hover:bg-primary-500 hover:text-white cursor-pointer;
        @apply items-center gap-x-2;
    }
</style>