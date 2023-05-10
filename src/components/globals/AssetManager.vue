<template>
    <v-overlay content-class="tw-flex tw-flex-row tw-items-center tw-w-full tw-h-full" persistent scroll-strategy="block" location-strategy="static" v-model="show">
        <v-card class="tw-mx-auto tw-h-[95%] tw-max-h-[95%] tw-rounded-lg tw-border tw-border-slate-700 tw-w-11/12 tw-flex tw-flex-col tw-shadow-xl">
            <div class="tw-w-full tw-bg-slate-700 tw-py-3 tw-pl-6 tw-pr-3 tw-text-white tw-items-center tw-text-xl tw-flex tw-flex-row tw-justify-between">
                {{ $t('assets.title') }}
                <v-btn icon flat>
                    <v-icon icon="mdi-close"/>
                </v-btn>
            </div>
            <div class="tw-flex-grow tw-max-h-[calc(100%-72px)]" v-if="!showCropper">
                <div class="tw-flex tw-flex-row tw-max-h-full tw-h-full">
                    <Navigation ref="navigation" :show="showSidebar" v-on:close="toggleSidebarPreference" />
                    <div
                        class="tw-flex-grow tw-flex tw-flex-col tw-h-full"
                        :class="{'tw-bg-gray-800': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}"
                    >
                        <div :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}" class="tw-p-2.5 tw-pr-3 tw-flex tw-flex-row tw-border-b tw-items-center tw-justify-between">
                            <div>
                                <v-btn @click.prevent="toggleSidebarPreference" flat icon>
                                    <v-icon icon="mdi-menu" />
                                </v-btn>
                            </div>
                            <div>

                            </div>
                            <div>
                                <DisplayModeSelector
                                    :display-mode="currentViewMode"
                                    v-on:change-mode="setCurrentViewMode"
                                />

<!--                                <v-btn flat icon>-->
<!--                                    <v-icon icon="mdi-dots-vertical"/>-->
<!--                                </v-btn>-->
                            </div>
                        </div>
                        <Listing :display-mode="currentViewMode"/>
                    </div>
                </div>
            </div>
            <CroppingManager v-if="showCropper" :settings="cropping"/>
        </v-card>
    </v-overlay>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useDisplay } from "vuetify";
import Navigation from "@/components/globals/assetmanager/Navigation.vue";
import Listing from "@/components/globals/assetmanager/Listing.vue";
import DisplayModeSelector from "@/components/globals/assetmanager/DisplayModeSelector.vue";
import CroppingManager from "@/components/globals/assetmanager/CroppingManager.vue";

const emitter = inject('emitter');

const display = useDisplay();
const showSidebar = ref(true);
const navigation = ref(null);

const currentPath = ref('root');
const currentViewMode = ref('grid');
const showCropper = ref(false);

const show = computed(() => props.show);

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    cropping: {
        type: Object,
        default: {ratio: 0, min: { width: 50, height: 50 }, max: {width: 10000, height: 10000}, lockedType: ''}
    }
});

// Handler cropper signal
emitter.on('crop', (event) =>
{
    showCropper.value = true;
});

// Should we show the sidebar on load?
let pref = localStorage.getItem('sam_nav') || 'show';

if (display.mobile === true) {
    showSidebar.value = true;
} else {
    showSidebar.value = (pref === 'show');
}

// Toggle the sidebar on or off (or show popup on mobile)
const toggleSidebarPreference = () =>
{
    if (showSidebar.value) {
        // Close
        navigation.value.toggleState();
        setTimeout(() => showSidebar.value = !showSidebar.value, 300);
    } else {
        showSidebar.value = !showSidebar.value
        setTimeout(() => navigation.value.toggleState(), 300);
    }
}

// handle display mode change
const setCurrentViewMode = (e) => currentViewMode.value = e[0];
</script>
