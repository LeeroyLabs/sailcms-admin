<template>
    <v-overlay v-model="showing" content-class="tw-flex tw-flex-row tw-items-center tw-w-full tw-h-full" persistent scroll-strategy="block" location-strategy="static">
        <v-card class="tw-mx-auto tw-h-[95%] tw-max-h-[95%] tw-rounded-lg tw-border tw-border-slate-700 tw-w-11/12 tw-flex tw-flex-col tw-shadow-xl">
            <div class="tw-w-full tw-bg-slate-700 tw-py-3 tw-pl-6 tw-pr-3 tw-text-white tw-items-center tw-text-xl tw-flex tw-flex-row tw-justify-between">
                {{ $t('assets.title') }}

                <div>
                    <v-btn @click="$emit('selected', selectedFileObjects)" flat icon v-if="!showCropper && ((store.assets.selected.length === 1 && !multi) || (store.assets.selected.length >= 1 && multi))">
                        <v-icon icon="mdi-check-circle-outline"/>
                    </v-btn>
                    <v-btn @click="$emit('close')" icon flat>
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
                        @folder-added="loadFolders"
                        @folder-removed="removeFolder"
                    />

                    <div
                        class="tw-flex-grow tw-flex tw-flex-col tw-h-full"
                        :class="{'tw-bg-gray-800': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}"
                    >
                        <div
                            :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
                            class="tw-p-2.5 tw-pr-3 tw-flex tw-flex-row tw-border-b tw-items-center tw-justify-between"
                        >
                            <div>
                                <v-btn @click.prevent="toggleSidebarPreference" flat icon>
                                    <v-icon icon="mdi-menu" />
                                </v-btn>

                                <v-btn v-if="$vuetify.display.mobile && !showSidebar" @click.prevent="toggleSearch" flat icon>
                                    <v-icon icon="mdi-magnify" />
                                </v-btn>
                            </div>
                            <div v-if="!$vuetify.display.mobile">
                                <v-text-field
                                    class="tw-w-[300px] lg:tw-w-[400px] tw-my-2"
                                    density="compact"
                                    variant="outlined"
                                    color="primary"
                                    placeholder="Search"
                                    rounded
                                    :hide-details="true"
                                    prepend-inner-icon="mdi-magnify"
                                    @keydown.enter="searchFiles"
                                    v-model="currentSearch"
                                    :clearable="true"
                                    @click:clear="searchFiles"
                                />
                            </div>
                            <div v-if="!$vuetify.display.mobile || !showSidebar">
                                <v-btn @click="showInfo" flat icon v-if="store.assets.selected.length === 1">
                                    <v-icon icon="mdi-information-outline"/>
                                </v-btn>
                                <v-btn @click="openCropper" flat icon v-if="store.assets.selected.length === 1">
                                    <v-icon icon="mdi-crop"/>
                                </v-btn>
                                <v-btn @click="showMover=true" flat icon v-if="store.assets.selected.length >= 1">
                                    <v-icon icon="mdi-folder-move-outline"/>
                                </v-btn>
                                <v-btn @click="confirmDelete" flat icon v-if="store.assets.selected.length >= 1">
                                    <v-icon icon="mdi-trash-can-outline" color="red-lighten-2"/>
                                </v-btn>

                                <DisplayModeSelector
                                    v-if="!$vuetify.display.mobile"
                                    :display-mode="currentViewMode"
                                    v-on:change-mode="setCurrentViewMode"
                                />
                            </div>
                        </div>
                        <div
                            v-if="showSearch"
                            class="tw-w-full tw-flex tw-flex-row tw-py-2 tw-px-3 tw-border-b"
                            :class="{'tw-bg-slate-800 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-100 tw-border-gray-200': $vuetify.theme.name === 'light'}"
                        >
                            <v-text-field
                                ref="searchField"
                                class="tw-w-[300px] lg:tw-w-[400px] tw-my-2"
                                density="compact"
                                color="primary"
                                variant="outlined"
                                placeholder="Search"
                                rounded
                                :hide-details="true"
                                prepend-inner-icon="mdi-magnify"
                                @keydown.enter="searchFiles"
                                v-model="currentSearch"
                                :clearable="true"
                                @click:clear="searchFiles"
                            />
                        </div>
                        <Listing
                            v-if="(!showSidebar && $vuetify.display.mobile) || !$vuetify.display.mobile"
                            :loading="store.assets.loadingPage"
                            :multi="multi"
                            :files="fileList"
                            :display-mode="currentViewMode"
                            ref="listing"
                            @more="loadNextPage"
                        />
                    </div>
                    <div class="tw-absolute tw-bottom-8 tw-right-8">
                        <v-btn @click.prevent="showUploader=true" density="comfortable" color="green-darken-2" size="x-large" icon="mdi-plus"></v-btn>
                    </div>
                </div>
            </div>

            <CroppingManager v-if="showCropper" :settings="cropping" :file="croppingFile" @close="showCropper = false" @generated="handleCropping"/>

            <Transition>
                <FileMover v-if="showMover" :folder="activeFolder" @cancel="closeMover" @moved="closeMoverAndUpdate"/>
            </Transition>

            <Transition>
                <UploadPanel v-if="showUploader" :folder="activeFolder" @cancel="showUploader=false" @upload="showFile"/>
            </Transition>

            <DeleteConfirmation
                :show="showDeleteConfirm"
                :loading="deleteLoading"
                :message="(store.assets.selected.length === 1) ? $t('assets.delete.single_conf') : $t('assets.delete.multi_conf')"
                :title="(store.assets.selected.length === 1) ? $t('assets.delete.single_title') : $t('assets.delete.multi_title')"
                @cancel="showDeleteConfirm=false"
                @accept="deleteSelectedFiles"
            />
        </v-card>
    </v-overlay>
</template>

<script setup>
import { computed, inject, nextTick, ref } from 'vue';
import { useDisplay } from "vuetify";
import Navigation from "@/components/globals/assetmanager/Navigation.vue";
import Listing from "@/components/globals/assetmanager/Listing.vue";
import DisplayModeSelector from "@/components/globals/assetmanager/DisplayModeSelector.vue";
import CroppingManager from "@/components/globals/assetmanager/CroppingManager.vue";
import { Assets } from '@/libs/graphql';
import { useAppStore } from '@/store/app';
import FileMover from '@/components/globals/assetmanager/FileMover.vue';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import { useI18n } from 'vue-i18n';
import UploadPanel from '@/components/globals/assetmanager/UploadPanel.vue';
import AssetInformationPanel from '@/components/globals/assetmanager/AssetInformationPanel.vue';

defineEmits(['close', 'selected']);

const i18n = useI18n();
const emitter = inject('emitter');
const store = useAppStore();

const showing = ref(true);

const display = useDisplay();
const showSidebar = ref(true);
const navigation = ref(null);
const listing = ref(null);

// View mode and cropper control
const currentViewMode = ref('grid');
const showCropper = ref(false);
const croppingFile = ref(null);

// Search
const showSearch = ref(false);
const searchField = ref(null);

// Folders
const folderList = ref([]);
const activeFolder = ref('root');
const foldersReady = ref(false);

// Files
const fileList = ref([]);
const currentSearch = ref('');

// Moving Files
const showMover = ref(false);

// Deleting
const showDeleteConfirm = ref(false);
const deleteLoading = ref(false);

// Uploading
const showUploader = ref(false);

const show = computed(() => props.show);

const props = defineProps({
    cropping: {
        type: Object,
        default: {name: '', ratio: 0, min: { width: 50, height: 50 }, max: {width: 10000, height: 10000}, lockedType: ''}
    },
    allowed: {
        type: Array,
        default: ['.*']
    },
    multi: {
        type: Boolean,
        default: false
    }
});

// Get file Objects for the select items
const selectedFileObjects = computed(() =>
{
    return fileList.value.filter(f => store.assets.selected.includes(f._id));
});

// Should we show the sidebar on load?
let pref = localStorage.getItem('sam_nav') || 'show';
let viewPref = localStorage.getItem('sam_view') || 'grid';

if (display.mobile.value) {
    showSidebar.value = false;
} else {
    showSidebar.value = (pref === 'show');
}

currentViewMode.value = viewPref;

const loadConfig = async () =>
{
    const config = await Assets.getConfig();
    store.setAssetConfig(config);
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
const setCurrentViewMode = (e) =>
{
    currentViewMode.value = e[0];
    localStorage.setItem('sam_view', e[0]);
}

// Load folders from the server
const loadFolders = async (skipFiles = false) =>
{
    folderList.value = await Assets.folders();
    foldersReady.value = true;

    store.setAvailableFolders(folderList.value);

    if (!skipFiles) loadFiles();
}

// Load files
const loadFiles = async (fromList = false) =>
{
    if (fromList) {
        store.setLoadingMorePage(true);
    } else if (!fromList) {
        store.setLoadingPage(true);
    }

    const result = await Assets.assets({
        page: store.assets.currentPage,
        limit: 100,
        folder: activeFolder.value,
        search: currentSearch.value
    }, store.locales);

    store.setAssetPagination(result.pagination.current, result.pagination.totalPages);
    fileList.value.push(...result.list);

    store.setLoadingMorePage(false);
    store.setLoadingPage(false);
}

// Load Following Page
const loadNextPage = async () =>
{
    store.incrementAssetPage();
    await loadFiles(true);
}

// Open Cropper
const openCropper = () =>
{
    let file = fileList.value.find(f => f._id === store.assets.selected[0]);
    croppingFile.value = file;
    showCropper.value = true;
}

// Active folder was changed
const setActiveFolder = async (e) =>
{
    activeFolder.value = e;
    currentSearch.value = '';
    store.setAssetPagination(1, 1);
    fileList.value = [];
    await loadFiles(false);
}

// Close Mover
const closeMover = () => showMover.value = false;
const closeMoverAndUpdate = (moved) =>
{
    closeMover();
    fileList.value = fileList.value.filter(f => !moved.includes(f._id));
}

// Toggle search (with autofocus)
const toggleSearch = () =>
{
    showSearch.value = !showSearch.value;
    nextTick(() => searchField.value.focus());
}

// Search Now! (reset pagination)
const searchFiles = async () =>
{
    store.setAssetPagination(1, 1);
    fileList.value = [];
    await loadFiles();
}

// React to removing a folder
const removeFolder = (e) =>
{
    activeFolder.value = 'root';
    loadFolders(true);
}

// Show delete confirmation
const confirmDelete = () => showDeleteConfirm.value = true;

const deleteSelectedFiles = async () =>
{
    deleteLoading.value = true;
    const response = await Assets.deleteAssets(store.assets.selected);

    if (response) {
        // Remove from list
        fileList.value = fileList.value.filter(f => !store.assets.selected.includes(f._id));
        store.clearSelectedAssets();

        showDeleteConfirm.value = false;
        deleteLoading.value = false;

        store.displayToast('success', i18n.t('assets.delete_success'));
        return;
    }

    deleteLoading.value = false;
    store.displayToast('error', i18n.t('assets.errors.permissions'));
}

const showInfo = () =>
{
    let file = fileList.value.filter(f => f._id === store.assets.selected[0]);
    listing.value.openFileInfo(file[0]);
}

// Show new uploaded file
const showFile = (file) => fileList.value.unshift(file);

const handleCropping = async () =>
{
    showCropper.value = false;

    // Reload fresh copy of the image data
    let fileIndex = fileList.value.findIndex(f => f._id === store.assets.selected[0]);
    let newCopy = await Assets.asset(store.assets.selected[0], store.locales);

    if (newCopy) {
        fileList.value[fileIndex] = newCopy;
    }
}

loadConfig();
loadFolders();
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
