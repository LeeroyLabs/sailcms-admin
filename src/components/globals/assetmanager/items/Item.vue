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
        <img :src="thumbnail" loading="lazy" class="tw-rounded-lg tw-max-h-[130px] lg:tw-max-h-[140px]" :width="($vuetify.display.lgAndUp) ? 140 : 130" :height="($vuetify.display.lgAndUp) ? 140 : 130" alt=""/>

        <div class="tw-absolute tw-w-full tw-flex-row tw-items-center tw-justify-between tw-bg-black/60 tw-py-1 tw-px-2 tw-rounded-b-lg tw-text-sm tw-hidden group-hover:tw-flex">
            <span>{{ fileExtension(file.filename) }}</span>
            <span>{{ humanFileSize(file.filesize) }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue';
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

const thumbnail = computed(() =>
{
    let url = '';

    for (let transform of props.file.transforms) {
        if (transform.transform === 'thumbnail') {
            url = transform.url;
            break;
        }
    }

    // In case we do not have one
    if (url === '') url = props.file.url;
    return url;
});

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
