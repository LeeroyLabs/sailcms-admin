<template>
    <div
        @click.prevent="(e) => toggleSelection(e, file._id)"
        class="tw-cursor-pointer hover:tw-outline tw-bg-center tw-bg-cover tw-group tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name !== 'light',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline': store.assets.selected.includes(file._id)
        }"
        style="outline-width: 5px;"
    >
        <img :src="file.url" loading="lazy" class="tw-rounded-lg" width="140" height="140" alt=""/>

        <div class="tw-absolute tw-w-full tw-flex-row tw-items-center tw-justify-between tw-bg-black/60 tw-py-1 tw-px-2 tw-rounded-b-lg tw-text-sm tw-hidden group-hover:tw-flex">
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
