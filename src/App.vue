<template>
    <Graphql :show="appStore.showGQLError"/>

    <template v-if="$route.meta.layout === 'public'">
        <Public>
            <router-view/>
        </Public>
    </template>

    <template v-if="$route.meta.layout === 'private'">
        <Private>
            <router-view/>
        </Private>
    </template>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import Graphql from "@/components/errors/Graphql.vue";
import { useTheme } from "vuetify";
import Private from "@/layouts/Private.vue";
import Public from "@/layouts/Public.vue";

const appStore = useAppStore();
const VuetifyTheme = useTheme();

const currentTheme = localStorage.getItem('sailcms_theme') || 'light';
appStore.setCurrentTheme(currentTheme);
VuetifyTheme.global.name.value = appStore.theme;
</script>
