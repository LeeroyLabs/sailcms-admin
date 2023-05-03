<template>
    <v-app>
        <v-card>
            <v-layout class="tw-flex tw-flex-col tw-h-screen">
                <v-navigation-drawer v-model="mobileStatus" :rail="($vuetify.display.smAndUp && !navigationState)" color="primary-darker" class="!tw-text-white tw-relative">
                    <v-list density="comfortable">
                        <v-list-item-media class="tw-max-h-[100px] tw-min-h-[100px]">
                            <img
                                :class="{'tw-w-20': (($vuetify.display.smAndUp && navigationState) || $vuetify.display.smAndDown), 'tw-w-10 !tw-mt-3': (!$vuetify.display.mobile && !navigationState)}"
                                class="tw-rounded-md tw-mx-auto tw-transition-all tw-m-4"
                                src="https://mir-s3-cdn-cf.behance.net/user/276/7530587.53f253b5e501a.jpg"
                                alt=""
                            />
                        </v-list-item-media>

                        <a href="#" v-if="$vuetify.display.smAndDown" @click.prevent="toggleNavigation" class="tw-absolute tw-top-3 tw-right-3">
                            <v-icon icon="mdi-close"></v-icon>
                        </a>

                        <v-spacer/>

                        <template v-for="(item, i) in items">
                            <v-list-item v-if="hasPermission(item.permission)" :key="i" :value="item" :to="item.to" :active="$route.path.includes(item.to)" :title="item.text" active-color="white">
                                <template v-slot:prepend>
                                    <v-icon :icon="item.icon" :alt="item.text"></v-icon>
                                </template>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-navigation-drawer>

                <v-app-bar :title="store.currentTitle" :color="appStore.theme === 'light' ? 'grey-lighten-3' : ''">
                    <template v-slot:prepend>
                        <v-app-bar-nav-icon v-if="!navigationState" @click="toggleNavigation"></v-app-bar-nav-icon>
                        <v-app-bar-nav-icon v-if="navigationState" icon="mdi-menu-open" @click="toggleNavigation"></v-app-bar-nav-icon>
                    </template>

                    <v-spacer/>

                    <v-btn
                        variant="text"
                        @click.prevent="$i18n.locale=($i18n.locale === 'fr') ? 'en' : 'fr'"
                        v-html="($i18n.locale === 'en') ? 'FR' : 'EN'"
                    >
                    </v-btn>

                    <v-btn @click="setTheme('dark')" v-if="appStore.theme === 'light'" icon>
                        <v-icon>mdi-weather-night</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{ $t('system.appbar.darkmode') }}</v-tooltip>
                    </v-btn>

                    <v-btn @click="setTheme('light')" v-if="appStore.theme === 'dark'" icon>
                        <v-icon>mdi-weather-sunny</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{ $t('system.appbar.lightmode') }}</v-tooltip>
                    </v-btn>

                    <v-btn icon>
                        <img :src="store.currentUser.avatar" v-if="store.currentUser.avatar !== ''" class="tw-rounded-full tw-w-7 tw-h-7" alt=""/>
                        <v-icon v-else>mdi-account-circle-outline</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{ $t('system.appbar.profile') }}</v-tooltip>
                    </v-btn>

                    <v-btn @click="performLogout" icon>
                        <v-icon>mdi-logout-variant</v-icon>
                        <v-tooltip activator="parent" location="bottom">{{ $t('system.appbar.logout') }}</v-tooltip>
                    </v-btn>
                </v-app-bar>

                <v-main scrollable>
                    <div class="tw-flex tw-flex-row tw-items-center tw-pr-4 tw-mt-1">
                        <div class="tw-flex-grow">
                            <v-breadcrumbs :items="store.breadcrumbs">
                                <template v-slot:prepend>
                                    <router-link :to="{name: 'Dashboard'}">
                                        <v-icon icon="mdi-home" class="tw-ml-2.5 tw-mr-3"></v-icon>
                                    </router-link>
                                </template>

                                <template v-slot:divider>
                                    <v-icon icon="mdi-chevron-right"></v-icon>
                                </template>
                            </v-breadcrumbs>
                        </div>
                        <div id="actions">

                        </div>
                    </div>
                    <div class="tw-m-4">
                        <slot/>
                    </div>
                </v-main>
            </v-layout>
        </v-card>
    </v-app>

    <Toast/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDisplay, useTheme } from "vuetify";
import { useAppStore } from '@/store/app';
import { useRouter } from 'vue-router';
import Toast from '@/components/globals/Toast.vue';
import { useI18n } from 'vue-i18n';
import { hasPermission } from "@/libs/tools";

const NAV_STATE_KEY = 'sailcms_nav_state';

let state = localStorage.getItem(NAV_STATE_KEY) || 'open';
const navigationState = ref((state === 'open'));
const display = useDisplay();
const i18n = useI18n();
const VuetifyTheme = useTheme();

const store = useAppStore();
const router = useRouter();
const appStore = useAppStore();

const items = computed(() =>
{
    return [
        {icon: 'mdi-file-document-outline', text: 'Entries', permission: 'any'},
        {icon: 'mdi-image-outline', text: 'Assets', permission: 'any'},
        {icon: 'mdi-menu', text: 'Navigations', permission: 'any'},
        {icon: 'mdi-shape-outline', text: 'Categories', permission: 'any'},
        {icon: 'mdi-cloud-search-outline', text: 'SEO', permission: 'any'},
        {icon: 'mdi-account-group-outline', to: store.baseURL + '/users', text: i18n.t('users.title'), permission: 'read_user'},
        {icon: 'mdi-puzzle-outline', to: store.baseURL + '/extensions', text: 'Extensions', permission: 'any'},
        {icon: 'mdi-calendar-check-outline', text: 'Tasks', permission: 'any'},
        {icon: 'mdi-cog-outline', text: 'Settings', permission: 'any'}
    ]
});

const mobileStatus = computed(() =>
{
    if (display.mdAndUp.value) return true;
    return (!navigationState.value) ? display.smAndDown.value : false
});

const toggleNavigation = () =>
{
    navigationState.value = !navigationState.value;
    const status = (!navigationState.value) ? 'closed' : 'open';
    localStorage.setItem(NAV_STATE_KEY, status);
}

const performLogout = () =>
{
    localStorage.removeItem(import.meta.env.VITE_SAILCMS_TOKEN);
    store.setCurrentUser(null);
    store.setLoginState(false);
    router.push('/');
}

const setTheme = (theme: string) =>
{
    appStore.setCurrentTheme(theme);
    VuetifyTheme.global.name.value = appStore.theme;
    localStorage.setItem('sailcms_theme', appStore.theme);
}
</script>
