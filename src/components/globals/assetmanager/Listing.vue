<template>
    <div v-if="displayMode === 'grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
        <Item/>
    </div>

    <div v-if="displayMode === 'compact-grid'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
        <CompactItem/>
    </div>

    <div v-if="displayMode === 'list'" :class="{'tw-bg-gray-800 tw-text-white': $vuetify.theme.name !== 'light', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}" class="tw-w-full tw-max-w-full tw-max-h-full tw-overflow-y-auto tw-text-black tw-p-6 tw-flex tw-flex-row tw-flex-wrap tw-gap-7">
        <ListItem/>
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
    }
});
</script>
