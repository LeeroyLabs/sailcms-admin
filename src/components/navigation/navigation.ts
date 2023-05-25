// @ts-nocheck

import { computed } from "vue";
import { i18n } from "@/plugins/i18n";

export const navigationItems = computed(() => {
    return [
        {
            icon: "mdi-file-document-outline",
            parent: "",
            text: "Entries",
            permission: "any",
        },
        {
            icon: "mdi-image-outline",
            text: "Assets",
            parent: "",
            permission: "any",
        },
        {
            icon: "mdi-menu",
            text: "Navigations",
            parent: "",
            permission: "any",
        },
        {
            icon: "mdi-shape-outline",
            to: { name: "Categories" },
            text: "Categories",
            parent: "",
            permission: "any",
        },
        {
            icon: "mdi-cloud-search-outline",
            parent: "",
            text: "SEO",
            permission: "any",
        },
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
            parent: "",
            text: "Tasks",
            permission: "any",
        },
        {
            icon: "mdi-cog-outline",
            parent: "",
            text: "Settings",
            permission: "any",
        },
    ];
});
