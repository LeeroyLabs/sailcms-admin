// @ts-nocheck

import { computed } from "vue";
import { i18n } from "@/plugins/i18n";

export const navigationItems = computed(() =>
{
    return [
        {icon: 'mdi-file-document-outline', text: 'Entries', permission: 'any'},
        {icon: 'mdi-image-outline', text: 'Assets', permission: 'any'},
        {icon: 'mdi-menu', text: 'Navigations', permission: 'any'},
        {icon: 'mdi-shape-outline', text: 'Categories', permission: 'any'},
        {icon: 'mdi-cloud-search-outline', text: 'SEO', permission: 'any'},
        {icon: 'mdi-account-tie-hat', to: window.baseURL + '/roles', text: i18n.global.t('roles.title'), permission: 'read_role'},
        {icon: 'mdi-account-group-outline', to: window.baseURL + '/user-groups', text: i18n.global.t('usergroups.title'), permission: 'read_group'},
        {icon: 'mdi-account', to: window.baseURL + '/users', text: i18n.global.t('users.title'), permission: 'read_user'},
        {icon: 'mdi-puzzle-outline', to: window.baseURL + '/extensions', text: 'Extensions', permission: 'any'},
        {icon: 'mdi-calendar-check-outline', text: 'Tasks', permission: 'any'},
        {icon: 'mdi-cog-outline', text: 'Settings', permission: 'any'}
    ]
});
