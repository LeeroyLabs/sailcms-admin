<template>
    <v-overlay content-class="tw-flex tw-flex-row tw-items-center tw-w-full tw-h-full" persistent scroll-strategy="block" location-strategy="static" v-model="show">
        <v-card class="tw-mx-auto tw-h-[95%] tw-max-h-[95%] tw-rounded-lg tw-border tw-border-slate-700 tw-w-11/12 tw-flex tw-flex-col tw-shadow-xl">
            <div class="tw-w-full tw-bg-slate-700 tw-py-3 tw-pl-6 tw-pr-3 tw-text-white tw-items-center tw-text-xl tw-flex tw-flex-row tw-justify-between">
                {{ $t('assets.title') }}

                <div>
                    <v-btn flat icon v-if="(store.assets.selected.length === 1 && !multi) || (store.assets.selected.length >= 1 && multi)">
                        <v-icon icon="mdi-check-circle-outline"/>
                    </v-btn>
                    <v-btn icon flat>
                        <v-icon icon="mdi-close"/>
                    </v-btn>
                </div>
            </div>
            <div class="tw-flex-grow tw-max-h-[calc(100%-72px)]" v-if="!showCropper">
                <div class="tw-flex tw-flex-row tw-max-h-full tw-h-full">
                    <Navigation
                        ref="navigation"
                        :active="activeFolder"
                        :folders="folderList"
                        :show="showSidebar"
                        @close="toggleSidebarPreference"
                        @change="setActiveFolder"
                    />

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
                                SEARCH
                            </div>
                            <div>
                                <v-btn @click="openCropper" flat icon v-if="store.assets.selected.length === 1">
                                    <v-icon icon="mdi-crop"/>
                                </v-btn>
                                <v-btn @click="showMover=true" flat icon v-if="store.assets.selected.length >= 1">
                                    <v-icon icon="mdi-folder-move-outline"/>
                                </v-btn>
                                <v-btn @click="openCropper" flat icon v-if="store.assets.selected.length >= 1">
                                    <v-icon icon="mdi-trash-can-outline" color="red-lighten-2"/>
                                </v-btn>

                                <DisplayModeSelector
                                    :display-mode="currentViewMode"
                                    v-on:change-mode="setCurrentViewMode"
                                />
                            </div>
                        </div>
                        <Listing :multi="multi" :files="fileList" :display-mode="currentViewMode" @more="loadNextPage"/>
                    </div>
                </div>
            </div>
            <CroppingManager v-if="showCropper" :settings="cropping" @close="showCropper = false"/>
            <FileMover :show="showMover" :folder="activeFolder" @cancel="closeMover"/>
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
import { Assets } from '@/libs/graphql';
import { useAppStore } from '@/store/app';
import FileMover from '@/components/globals/assetmanager/FileMover.vue';

const emitter = inject('emitter');
const store = useAppStore();

const display = useDisplay();
const showSidebar = ref(true);
const navigation = ref(null);

// View mode and cropper control
const currentViewMode = ref('grid');
const showCropper = ref(false);

// Selection Mode
const selectionMode = ref(false);

// Folders
const folderList = ref([]);
const activeFolder = ref('root');
const foldersReady = ref(false);

// Files
const fileList = ref([]);
const currentSearch = ref('');

// Moving Files
const showMover = ref(false);

const show = computed(() => props.show);

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    cropping: {
        type: Object,
        default: {ratio: 0, min: { width: 50, height: 50 }, max: {width: 10000, height: 10000}, lockedType: ''}
    },
    multi: {
        type: Boolean,
        default: false
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

// Load folders from the server
const loadFolders = async () =>
{
    folderList.value = await Assets.folders();
    foldersReady.value = true;

    store.setAvailableFolders(folderList.value);

    loadFiles('root');
}

// Load files
const loadFiles = async () =>
{
    const result = await Assets.assets({
        page: store.assets.currentPage,
        limit: 100,
        folder: activeFolder.value,
        search: currentSearch.value
    });

    store.setAssetPagination(result.pagination.current, result.pagination.totalPages);
    fileList.value.push(...result.list);
    store.setLoadingPage(false);
}

// Load Following Page
const loadNextPage = async () =>
{
    store.incrementAssetPage();
    await loadFiles();
}

// Open Cropper
const openCropper = () =>
{
    let file = fileList.value.find(f => f._id === store.assets.selected[0]);
    emitter.emit('crop', {image: store.assets.selected, src: file.url})
}

// Active folder was changed
const setActiveFolder = (e) => activeFolder.value = e;

// Close Mover
const closeMover = () =>
{
    showMover.value = false;
}

loadFolders();
</script>
