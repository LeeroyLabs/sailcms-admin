<template>
    <template v-if="files.length > 0">
        <div v-if="displayMode === 'grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-10">
            <Item v-for="file in files" :file="file"/>
        </div>

        <div v-if="displayMode === 'compact-grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
            <CompactItem v-for="file in files"/>
        </div>

        <div v-if="displayMode === 'list'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
            <ListItem v-for="file in files"/>
        </div>
    </template>

    <div class="tw-h-full tw-flex tw-flex-row tw-items-center" v-if="files.length === 0">
        <div class="tw-flex tw-w-full tw-flex-col tw-items-center">
            <v-progress-circular indeterminate size="150"/>
        </div>
    </div>
</template>

<script setup>
import Item from '@/components/globals/assetmanager/items/Item.vue';
import CompactItem from '@/components/globals/assetmanager/items/CompactItem.vue';
import ListItem from '@/components/globals/assetmanager/items/ListItem.vue';

const props = defineProps({
    displayMode: {
        type: String,
        default: 'grid'
    },
    files: {
        type: Array,
        default: []
    }
});
</script>
