<template>
    <template v-if="!loading && files.length > 0">
        <div v-if="displayMode === 'grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-10">
            <Item v-for="file in files" :file="file" :multi="multi"/>
            <div v-if="store.assets.maxPage !== store.assets.currentPage" @click.prevent="loadMore" class="tw-border tw-border-slate-600 tw-text-slate-600 hover:tw-border-slate-400 hover:tw-text-slate-400 tw-w-[100px] tw-h-[100px] lg:tw-w-[140px] lg:tw-h-[140px] tw-rounded-lg tw-flex tw-flex-row tw-items-center tw-justify-center tw-cursor-pointer">
                <v-progress-circular v-if="store.assets.loadingPage" indeterminate />
                <v-icon v-else icon="mdi-dots-horizontal"/>
            </div>
        </div>

        <div v-if="displayMode === 'compact-grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
            <CompactItem v-for="file in files" :file="file" :multi="multi"/>
            <div v-if="store.assets.maxPage !== store.assets.currentPage" @click.prevent="loadMore" class="tw-border tw-border-slate-600 tw-text-slate-600 hover:tw-border-slate-400 hover:tw-text-slate-400 tw-w-[75px] tw-rounded-lg tw-flex tw-flex-row tw-items-center tw-justify-center tw-cursor-pointer">
                <v-progress-circular v-if="store.assets.loadingPage" indeterminate />
                <v-icon v-else icon="mdi-dots-horizontal"/>
            </div>
        </div>

        <div v-if="displayMode === 'list'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-y-2 tw-gap-x-8">
            <ListItem v-for="file in files" :file="file" :multi="multi"/>
        </div>
    </template>

    <div v-if="!loading && files.length === 0" class="tw-flex tw-flex-row tw-items-center tw-mt-20">
        <h2 class="tw-text-xl tw-text-center tw-w-full">{{ $t('assets.no_files') }}</h2>
    </div>

    <div class="tw-h-full tw-flex tw-flex-row tw-items-center" v-if="loading">
        <div class="tw-flex tw-w-full tw-flex-col tw-items-center">
            <v-progress-circular indeterminate size="150"/>
        </div>
    </div>
</template>

<script setup>
import Item from '@/components/globals/assetmanager/items/Item.vue';
import CompactItem from '@/components/globals/assetmanager/items/CompactItem.vue';
import ListItem from '@/components/globals/assetmanager/items/ListItem.vue';
import { useAppStore } from '@/store/app';

const emitter = defineEmits(['more']);

const store = useAppStore();

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
    }
});

const loadMore = () =>
{
    store.setLoadingPage(true);
    emitter('more');
}
</script>
