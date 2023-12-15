<script>
    import { slide } from 'svelte/transition';
    import { Icon } from '@steeze-ui/svelte-icon';
    import * as Icons from '@steeze-ui/lucide-icons';
    import {
        Article,
        Group,
        Widgets,
        Menu,
        TravelExplore,
        ContactPhone,
    } from '@steeze-ui/material-design-icons';
    import { ChevronDown } from '@steeze-ui/heroicons';
    import { AppStore } from '@stores/app.js';
    import { _, locale } from 'svelte-i18n';
    import { isSectionActive } from '$lib/helpers/navigation.js';
    import { Cog } from '@steeze-ui/lucide-icons';

    let entriesMenuState = false;
</script>

<aside class="flex">
    <div class="flex flex-col w-[250px]">
        <div class="flex flex-col h-0 flex-1 bg-gray-800">
            <div class="flex items-center flex-shrink-0 px-4 mt-8">
                <img class="w-24 rounded-md mx-auto transition-all" src="https://mir-s3-cdn-cf.behance.net/user/276/7530587.53f253b5e501a.jpg" alt="">
            </div>
            <div class="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
                <nav class="nav flex-1 px-0 py-4 pt-5">
                    <div class="flex flex-row justify-between items-center w-full group">
                        <a href="#" on:click|preventDefault={() => entriesMenuState = !entriesMenuState} class="flex flex-row justify-between items-center">
                            <div class="flex flex-row gap-x-2">
                                <Icon src={Article} size="24"/> {$_('systembar.entries')}
                            </div>
                            <div role="button" class="text-interface-100 group:hover:text-black transition-transform {entriesMenuState ? 'rotate-180' : ''}">
                             <Icon src={ChevronDown} size="20" />
                            </div>
                        </a>
                    </div>

                    {#if entriesMenuState}
                        <div out:slide in:slide class="bg-surface-700 overflow-auto hide-scrollbar">
                            {#each $AppStore.configuration.dataTypes as type}
                                <a href="">
                                    <div class="ml-8">{type.title}</div>
                                </a>
                            {/each}
                        </div>
                    {/if}

                    <div class="flex flex-col gap-y-2 mt-2">
                        {#each $AppStore.configuration.dynamicNavigationElements.post_entries as item}
                            <a href={$AppStore.baseURL + '/' + item.url} class="{isSectionActive(item.url) ? 'active' : ''}">
                                <Icon src={Icons[item.icon]} size="24"/>
                                {item.label[$locale]}
                            </a>
                        {/each}
                        <a href="">
                            <Icon src={Menu} size="24"/>
                            {$_('systembar.content.navigations')}
                        </a>
                        <a href="">
                            <Icon src={Widgets} size="24" theme="outlined" />
                            {$_('systembar.content.categories')}
                        </a>
                        <a href="">
                            <Icon src={ContactPhone} size="24" theme="outlined" />
                            {$_('systembar.forms')}
                        </a>
                        <a href="">
                            <Icon src={TravelExplore} size="24"/>
                            SEO
                        </a>
                        {#each $AppStore.configuration.dynamicNavigationElements.pre_users as item}
                            <a href={$AppStore.baseURL + '/' + item.url} class="{isSectionActive(item.url) ? 'active' : ''}">
                                <Icon src={Icons[item.icon]} size="24"/>
                                {item.label[$locale]}
                            </a>
                        {/each}
                        <a href="">
                            <Icon src={Group} size="24" />
                            {$_('systembar.users.users')}
                        </a>
                        {#each $AppStore.configuration.dynamicNavigationElements.pre_settings as item}
                            <a href={$AppStore.baseURL + '/' + item.url} class="{isSectionActive(item.url) ? 'active' : ''}">
                                <Icon src={Icons[item.icon]} size="24"/>
                                {item.label[$locale]}
                            </a>
                        {/each}
                        <a href="/settings" class="{isSectionActive('/settings') ? 'active' : ''}">
                            <Icon src={Cog} size="24"/>
                            {$_('systembar.main.settings')}
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    </div>
</aside>

<style lang="scss">
    .sidebar {
        @apply w-[250px] relative flex flex-col pb-8;
    }

    .nav {
        @apply flex flex-col flex-grow;

        a {
            @apply flex flex-row items-center gap-x-2 text-surface-100 text-lg;
            @apply hover:bg-primary-500 hover:text-black py-2 px-6 w-full;

            span {
                @apply text-surface-100;
            }

            &:hover {
                span {
                    @apply text-black;
                }
            }

            &.active {
                @apply bg-primary-500 text-black;
            }
        }
    }
</style>