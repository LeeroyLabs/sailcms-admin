// @ts-nocheck

import { computed } from "vue";
import { i18n } from "@/plugins/i18n";
import { useAppStore } from "@/store/app";

export const navigationItems = computed(() => {
    const store = useAppStore();
    let dynamics = [];

    for (let type of store.configuration.dataTypes) {
        dynamics.push({
            icon: "mdi-file-document-outline",
            to: { name: "EntryList", params: { name: type.handle } },
            parent: "",
            text:
                store.configuration.customLocales[i18n.global.locale.value]
                    .types[type.handle] || type.title,
            permission: "read_" + type.handle,
        });
    }

    // Fetch Dynamic navigation from backend (3 categories: post_entries, pre_users, post_settings)
    let post_entries = [];
    let pre_users = [];
    let pre_settings = [];

    for (let item of store.configuration.dynamicNavigationElements
        .post_entries) {
        post_entries.push({
            icon: item.icon,
            text: store.configuration.customLocales[i18n.global.locale.value][
                item.slug
            ],
            to: { name: "DynamicContent", params: { param: item.url } },
            parent: item.parent,
            permission: item.permission,
        });
    }

    for (let item of store.configuration.dynamicNavigationElements.pre_users) {
        pre_users.push({
            icon: item.icon,
            text: store.configuration.customLocales[i18n.global.locale.value][
                item.slug
            ],
            to: { name: "DynamicContent", params: { param: item.url } },
            parent: item.parent,
            permission: item.permission,
        });
    }

    for (let item of store.configuration.dynamicNavigationElements
        .pre_settings) {
        pre_settings.push({
            icon: item.icon,
            text: store.configuration.customLocales[i18n.global.locale.value][
                item.slug
            ],
            to: { name: "DynamicContent", params: { param: item.url } },
            parent: item.parent,
            permission: item.permission,
        });
    }

    return [
        ...dynamics,
        ...post_entries,
        {
            icon: "mdi-image-outline",
            text: "Assets",
            parent: "",
            permission: "any",
        },
        {
            icon: "mdi-menu",
            to: { name: "Navigations" },
            parent: "",
            text: i18n.global.t("navigations.title"),
            permission: "any",
        },
        {
            icon: "mdi-shape-outline",
            to: { name: "Categories" },
            parent: "",
            text: i18n.global.t("categories.title"),
            permission: "any",
        },
        {
            icon: "mdi-cloud-search-outline",
            parent: "",
            text: "SEO",
            permission: "any",
        },
        ...pre_users,
        {
            icon: "mdi-account-tie-hat",
            to: { name: "Roles" },
            parent: "",
            text: i18n.global.t("roles.title"),
            permission: "read_role",
        },
        {
            icon: "mdi-account-group-outline",
            to: { name: "UserGroups" },
            parent: "",
            text: i18n.global.t("usergroups.title"),
            permission: "read_group",
        },
        {
            icon: "mdi-account",
            to: { name: "Users" },
            parent: "",
            text: i18n.global.t("users.title"),
            permission: "read_user",
        },
        {
            icon: "mdi-puzzle-outline",
            to: { name: "Extensions" },
            parent: "",
            text: "Extensions",
            permission: "any",
        },
        {
            icon: "mdi-email-outline",
            parent: "",
            text: "Emails",
            permission: "any",
        },
        {
            icon: "mdi-calendar-check-outline",
            to: { name: "Tasks" },
            text: "Tasks",
            permission: "any",
        },
        ...pre_settings,
        {
            icon: "mdi-cog-outline",
            to: { name: "Settings" },
            parent: "",
            text: i18n.global.t("system.settings"),
            permission: "any",
        },
    ];
});
