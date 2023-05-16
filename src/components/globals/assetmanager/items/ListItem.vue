<template>
    <div
        @click.prevent="(e) => toggleSelection(e, file._id)"
        class="tw-flex tw-flex-row tw-items-center tw-cursor-pointer tw-p-2 tw-rounded-lg hover:tw-outline"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name !== 'light',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline': store.assets.selected.includes(file._id)
        }"
        style="outline-width: 3px;"
    >
        <div
            class="tw-bg-center tw-bg-cover tw-w-[40px] tw-h-[40px] tw-rounded-lg tw-mr-4"
            :style="'background-image: url(' + file.url + ');'"
        ></div>
        <div class="tw-w-full tw-flex tw-flex-col tw-gap-y-0.2">
            <h2 class="tw-font-medium tw-flex-grow">super-freaking-long-title-for-an-image-that-it-takes-all-the-space.webp</h2>
            <div
                class="tw-w-full tw-flex tw-flex-row"
                :class="{
                    'tw-text-gray-400': $vuetify.theme.name === 'dark',
                    'tw-text-gray-500': $vuetify.theme.name === 'light'
                }"
            >
                {{ fileExtension(file.filename) }} &mdash; {{ humanFileSize(file.filesize) }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';
import { humanFileSize, fileExtension } from '@/libs/tools';
import { useAppStore } from '@/store/app';

const store = useAppStore();

defineEmits(['openCrop']);

const props = defineProps({
    file: {
        type: Object,
        default: null
    },
    multi: {
        type: Boolean,
        default: false
    }
});

const emitter = inject('emitter');

const toggleSelection = (event, file) =>
{
    let isMulti = props.multi;
    if (event.metaKey || event.ctrlKey) isMulti = true;

    if (!store.assets.selected.includes(file)) {
        store.setSelectedFile(file, true, isMulti);
        return;
    }

    store.setSelectedFile(file, false, isMulti);
}
</script>
