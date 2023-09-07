<template>
    <div class="tw-relative tw-h-full">
        <template v-if="!loading && files.length > 0">
            <div v-if="displayMode === 'grid'" :class="{'tw-bg-[#111111] tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-10">
                <Item v-for="file in files" :file="file" :mode="mode" :multi="multi" @open-info="openFileInfo"/>
                <div v-if="store.assets.maxPage > store.assets.currentPage" @click.prevent="loadMore" class="tw-border tw-border-slate-600 tw-text-slate-600 hover:tw-border-slate-400 hover:tw-text-slate-400 tw-w-[100px] tw-h-[100px] lg:tw-w-[140px] lg:tw-h-[140px] tw-rounded-lg tw-flex tw-flex-row tw-items-center tw-justify-center tw-cursor-pointer">
                    <v-progress-circular v-if="store.assets.loadingMorePage" indeterminate />
                    <v-icon v-else icon="mdi-dots-horizontal"/>
                </div>
            </div>

            <div v-if="displayMode === 'compact-grid'" :class="{'tw-bg-[#111111] tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
                <CompactItem v-for="file in files" :mode="mode" :file="file" :multi="multi"/>
                <div v-if="store.assets.maxPage > store.assets.currentPage" @click.prevent="loadMore" class="tw-border tw-border-slate-600 tw-text-slate-600 hover:tw-border-slate-400 hover:tw-text-slate-400 tw-w-[75px] tw-rounded-lg tw-flex tw-flex-row tw-items-center tw-justify-center tw-cursor-pointer">
                    <v-progress-circular v-if="store.assets.loadingMorePage" indeterminate />
                    <v-icon v-else icon="mdi-dots-horizontal"/>
                </div>
            </div>

            <div v-if="displayMode === 'list'" :class="{'tw-bg-[#111111] tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-grid tw-grid-cols-2 tw-gap-y-2 tw-gap-x-8">
                <ListItem v-for="file in files" :file="file" :mode="mode" :multi="multi"/>
            </div>
        </template>

        <div class="tw-h-full tw-flex tw-flex-row tw-items-center" v-if="loading">
            <div class="tw-flex tw-w-6/12 tw-flex-col tw-items-center tw-mx-auto">
                <v-progress-linear :indeterminate="true" color="primary" :height="12" class="tw-rounded-md" />
            </div>
        </div>

        <Transition>
            <AssetInformationPanel v-if="showInfo" :file="currentFile" @close="showInfo=false"/>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Item from './items/Item.vue';
import CompactItem from './items/CompactItem.vue';
import ListItem from './items/ListItem.vue';
import { useAppStore } from '@/store/app';
import AssetInformationPanel from './AssetInformationPanel.vue';

const emitter = defineEmits(['more']);

const store = useAppStore();

// Info
const currentFile = ref(null);
const showInfo = ref(false);

const props = defineProps({
    displayMode: {
        type: String,
        default: 'grid'
    },
    files: {
        type: Array,
        default: []
    },
    loading: {
        type: Boolean,
        default: true
    },
    multi: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'image'
    }
});

const loadMore = () =>
{
    store.setLoadingMorePage(true);
    emitter('more');
}

const openFileInfo = (file) =>
{
    currentFile.value = file;
    showInfo.value = true;
}

defineExpose({openFileInfo});

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
