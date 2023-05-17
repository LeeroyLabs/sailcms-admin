<template>
    <v-app>
        <v-card>
            <v-layout class="tw-flex tw-flex-col tw-h-screen">
                <MobileNavigation v-if="$vuetify.display.mdAndDown" v-model="navigationState"/>
                <DesktopNavigation v-if="$vuetify.display.lgAndUp" :navigation-state="navigationState"/>

                <v-app-bar :title="($vuetify.display.xs) ? '' : store.currentTitle" :color="appStore.theme === 'light' ? 'grey-lighten-3' : ''">
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
                            <v-breadcrumbs v-if="$vuetify.display.smAndUp" :items="store.breadcrumbs">
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
                            <!-- Use Teleport -->
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
import { onMounted, ref } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
import Toast from "@/components/globals/Toast.vue";
import { useI18n } from "vue-i18n";
import MobileNavigation from "@/components/navigation/mobile.vue";
import DesktopNavigation from "@/components/navigation/desktop.vue";

const NAV_STATE_KEY = 'sailcms_nav_state';

const i18n = useI18n();
const VuetifyTheme = useTheme();

const store = useAppStore();
const router = useRouter();
const appStore = useAppStore();
const display = useDisplay();

const navigationState = ref(true);

onMounted(() =>
{
    let state = localStorage.getItem(NAV_STATE_KEY) || 'open';
    navigationState.value = (state === 'open');
});

const toggleNavigation = () =>
{
    navigationState.value = (!navigationState.value);
    const status = (navigationState.value) ? 'open' : 'close';
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

if (display.mobile) {
    navigationState.value = false;
}
</script>
