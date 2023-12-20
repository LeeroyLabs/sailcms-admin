<script>
    import { Icon } from '@steeze-ui/svelte-icon';
    import PageHead from '@components/structure/pagehead.svelte';
    import { _, locale } from 'svelte-i18n';
    import { AppStore } from '@stores/app.js';
    import * as Icons from '@steeze-ui/lucide-icons';
    import { hasPermission } from '$lib/helpers/permissions.js';
    import { goto } from '$app/navigation';

    // Breadcrumb
    AppStore.setBreadcrumbs([
        {url: '/dashboard', label: 'systembar.dashboard', active: false},
        {url: '/settings', label: 'system.settings', active: true}
    ]);

    if (!hasPermission('any')) {
        goto('/settings');
    }

    let isReady = false;
</script>

<PageHead>
    <svelte:fragment slot="title">
        {$_('system.settings')}
    </svelte:fragment>
</PageHead>

<div class="flex flex-col gap-y-4">
    {#if hasPermission('read_group') || hasPermission('read_role') || hasPermission('admin')}
    <section class="card p-4">
        <h2 class="text-xl mb-6">{$_('system.system')}</h2>
        <div class="flex flex-row gap-x-4">
            {#if hasPermission('read_group')}
                <a href="/settings/groups" class="sysbtn">
                    <Icon src={Icons.Users2} size="60" theme="outlined" />
                    {$_('usergroups.title')}
                </a>
            {/if}

            {#if hasPermission('read_role')}
                <a href="/settings/roles" class="sysbtn">
                    <Icon src={Icons.ShieldCheck} size="60" theme="outlined" />
                    {$_('roles.title')}
                </a>
            {/if}

            {#if hasPermission('readwrite_admin')}
                <a href="/settings/email-templates" class="sysbtn">
                    <Icon src={Icons.Mail} size="60" theme="outlined" />
                    {$_('system.email_templates')}
                </a>
            {/if}
        </div>
    </section>
    {/if}

    <section class="card p-4">
        <h2 class="text-xl mb-6">{$_('system.content')}</h2>
        <div class="flex flex-row gap-x-4">
            {#if hasPermission('read_entry_type')}
                <a href="/settings/entry-types" class="sysbtn">
                    <Icon src={Icons.Shapes} size="60" theme="outlined" />
                    {$_('system.entry_types')}
                </a>
                {/if}

            {#if hasPermission('read_entry_fields')}
                <a href="/settings/fields" class="sysbtn">
                    <Icon src={Icons.FormInput} size="60" theme="outlined" />
                    {$_('system.entry_fields')}
                </a>
            {/if}

            {#if hasPermission('read_entry_layout')}
                <a href="/settings/layouts" class="sysbtn">
                    <Icon src={Icons.LayoutDashboard} size="60" theme="outlined" />
                    {$_('system.entry_layouts')}
                </a>
            {/if}
        </div>
    </section>

    <section class="card p-4">
        <h2 class="text-xl mb-6">{$_('system.utilities')}</h2>
        <div class="flex flex-row gap-x-4">
            {#if hasPermission('readwrite_admin')}
            <a href="/settings/extensions" class="sysbtn">
                <Icon src={Icons.Plug} size="60" theme="outlined" />
                Extensions
            </a>
            {/if}

            {#if hasPermission('read_task')}
                <a href="/settings/tasks" class="sysbtn">
                    <Icon src={Icons.CalendarCheck} size="60" theme="outlined" />
                    {$_('system.tasks')}
                </a>
            {/if}

            {#if hasPermission('readwrite_admin')}
                <a href="/settings/email-test" class="sysbtn">
                    <Icon src={Icons.Send} size="60" />
                    {$_('system.email_test')}
                </a>
            {/if}

            {#if hasPermission('readwrite_admin')}
                <a href="/settings/server-status" class="sysbtn">
                    <Icon src={Icons.ServerCog} size="60" theme="outlined" />
                    {$_('system.server_status')}
                </a>
            {/if}

            {#if hasPermission('readwrite_admin')}
                <a href="/settings/logs" class="sysbtn">
                    <Icon src={Icons.ScrollText} size="60" theme="outlined" />
                    {$_('system.app_logs')}
                </a>
            {/if}
        </div>
    </section>

    <section class="card p-4">
        <h2 class="text-xl mb-6">{$_('system.other')}</h2>
        {#if $AppStore.configuration.dynamicSettingsElements.others.length === 0}
            <div class="text-surface-400 text-xl text-center py-6">Nothing available</div>
        {/if}
        {#each $AppStore.configuration.dynamicSettingsElements.others as item}
            <div class="flex flex-row gap-x-4">
                <a href="/settings/groups" class="sysbtn">
                    <Icon src={Icons[item.icon]} size="60" theme="outlined" />
                    {item.label[$locale]}
                </a>
            </div>
        {/each}
    </section>
</div>

<style lang="scss">
    .sysbtn {
        @apply py-2 px-4 rounded-md flex-col hover:bg-primary-500 dark:hover:text-black;
        @apply flex flex-col items-center gap-y-2;
    }
</style>