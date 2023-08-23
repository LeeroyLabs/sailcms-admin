// @ts-nocheck

import { computed } from "vue";
import { i18n } from "@/plugins/i18n";
import { useAppStore } from "@/store/app";
import inflector from "inflector-js";
import plural from "pluralize-fr";

export const navigationItems = computed(() => {
    const store = useAppStore();
    let dynamics = [];

    for (let type of store.configuration.dataTypes) {
        let name = "";

        if (i18n.global.locale.value === "fr") {
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
            icon: "mdi-shape-outline",
            to: { name: "Forms" },
            parent: "",
            text: i18n.global.t("forms.title"),
            permission: "any",
        },
        {
            icon: "mdi-cloud-search-outline",
            parent: "",
            text: "SEO",
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
