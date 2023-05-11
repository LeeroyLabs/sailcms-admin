<template>
    <div
        @click.prevent="toggleSelection(file._id)"
        class="tw-cursor-pointer hover:tw-outline tw-bg-center tw-bg-cover tw-w-[140px] tw-group tw-h-[140px] tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name !== 'light',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline': store.assets.selected.includes(file._id)
        }"
        :style="'outline-width: 5px; background-image: url(' + file.url + ')'"
    >
        <div class="tw-w-full tw-flex-row tw-items-center tw-justify-between tw-bg-black/60 tw-py-1 tw-px-2 tw-rounded-b-lg tw-text-sm tw-hidden group-hover:tw-flex">
            <span>{{ fileExtension(file.filename) }}</span>
            <span>{{ humanFileSize(file.filesize) }}</span>
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

const toggleSelection = (file) =>
{
    if (!store.assets.selected.includes(file)) {
        store.setSelectedFile(file, true, props.multi);
        return;
    }

    store.setSelectedFile(file, false, props.multi);
}
</script>
