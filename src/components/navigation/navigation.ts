// @ts-nocheck

import { computed } from "vue";
import { i18n } from "@/plugins/i18n";
import { useAppStore } from "@/store/app";
import inflector from "inflector-js";
import plural from "pluralize-fr";
import { SailCMS } from "@/libs/graphql";

export const navigationItems = computed(() => {
    const store = useAppStore();
    let dynamics = [];

    for (let type of store.configuration.dataTypes) {
        let name = '';

        if (i18n.global.locale.value === 'fr') {
            name = plural(type.title);
        } else {
            name = inflector.pluralize(type.title);
        }

        dynamics.push({
            icon: "mdi-file-document-outline",
            to: { name: "EntryList", params: { name: type.handle } },
            parent: "",
            text: name,
            isEntries: true,
            permission: "read_" + type.handle,
        });
    }

    // Fetch Dynamic navigation from backend (3 categories: post_entries, pre_users, post_settings)
    let post_entries = [];
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

    for (let item of store.configuration.dynamicNavigationElements.pre_settings) {
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

    const sysItems = [];
    for (let navKey of Object.keys(SailCMS.getNavigation())) {
        if (SailCMS.getNavigation()[navKey]) {
            switch (navKey)
            {
                case 'users':
                    sysItems.push({
                        icon: "mdi-account-outline",
                        to: { name: "Users" },
                        parent: "",
                        text: i18n.global.t("users.title"),
                        permission: "read_users",
                    });
                    break;

                case 'roles':
                    sysItems.push({
                        icon: "mdi-account-tie-hat-outline",
                        to: { name: "Roles" },
                        parent: "",
                        text: i18n.global.t("roles.title"),
                        permission: "readwrite_roles",
                    });
                    break;

                case 'types':
                    sysItems.push({
                        icon: "mdi-shape-plus-outline",
                        to: { name: "EntryTypes" },
                        parent: "",
                        text: i18n.global.t("system.entry_types"),
                        permission: "readwrite_entry_type",
                    });
                    break;

                case 'fields':
                    sysItems.push({
                        icon: "mdi-form-textbox",
                        to: { name: "EntryFields" },
                        parent: "",
                        text: i18n.global.t("system.entry_fields"),
                        permission: "readwrite_entry_fields",
                    });
                    break;

                case 'layouts':
                    sysItems.push({
                        icon: "mdi-order-alphabetical-ascending",
                        to: { name: "EntryLayouts" },
                        parent: "",
                        text: i18n.global.t("system.entry_layouts"),
                        permission: "readwrite_entry_layout",
                    });
                    break;

                case 'tasks':
                    sysItems.push({
                        icon: "mdi-calendar-check-outline",
                        to: { name: "Tasks" },
                        parent: "",
                        text: i18n.global.t("system.tasks"),
                        permission: "readwrite_task",
                    });
                    break;

                case 'logs':
                    sysItems.push({
                        icon: "mdi-console",
                        to: { name: "Logs" },
                        parent: "",
                        text: i18n.global.t("system.logs"),
                        permission: "any",
                    });
                    break;
            }
        }
    }

    return [
        ...dynamics,
        ...post_entries,
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
        ...sysItems,
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
