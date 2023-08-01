<template>
    <div
        v-if="mode === 'image' && isImage || mode !== 'image'"
        @click.prevent="(e) => toggleSelection(e, file._id)"
        class="hover:tw-outline hover:tw-outline-[5px] tw-bg-center tw-bg-cover tw-group tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name === 'dark',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline tw-outline-[5px]': store.assets.selected.includes(file._id),
            'tw-bg-[#1B2431] tw-text-white': !isImage && $vuetify.theme.name === 'dark',
            'tw-bg-gray-200': !isImage && $vuetify.theme.name === 'light',
            'tw-cursor-pointer': isUsable
        }"
    >
        <div v-if="!isUsable" class="tw-absolute tw-inset-0 tw-inset-b-4 tw-rounded-md tw-bg-black/60 tw-z-[999]"></div>

        <div @click.prevent="openInfo" class="tw-rounded-full tw-hidden group-hover:tw-block tw-absolute tw-top-2 tw-right-2 tw-z-[999] tw-cursor-pointer">
            <v-icon icon="mdi-information-outline" size="default" class="tw-bg-black tw-rounded-full tw-text-white"/>
        </div>

        <template v-if="isImage">
            <img :src="thumbnail" loading="lazy" class="tw-rounded-lg tw-max-h-[130px] lg:tw-max-h-[140px]" :width="($vuetify.display.lgAndUp) ? 140 : 130" :height="($vuetify.display.lgAndUp) ? 140 : 130" alt=""/>
        </template>
        <template v-else>
            <div class="tw-pt-4 tw-select-none">
                <svg class="tw-w-[130px] tw-h-[100px] lg:tw-w-[140px] lg:tw-h-[100px] tw-block tw-mb-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M458.57,161.13,282.66,8.1a14.08,14.08,0,0,0-8-2.87H68.83a29.72,29.72,0,0,0-8.93,1.65l-7.83,6.83a20.09,20.09,0,0,0-1.92,7.77v469a20.08,20.08,0,0,0,1.92,7.75l7.83,6.83a29.45,29.45,0,0,0,8.93,1.67H443.18a29.18,29.18,0,0,0,8.93-1.67l7.85-6.83a20.5,20.5,0,0,0,1.89-7.75V168.06A10.54,10.54,0,0,0,458.57,161.13ZM450,492.9l-4.09,3.56a16.74,16.74,0,0,1-2.75.38H68.83a16.16,16.16,0,0,1-2.73-.38L62,492.9a11.31,11.31,0,0,1-.43-2.38v-469A11.15,11.15,0,0,1,62,19.09l4.12-3.57a16.27,16.27,0,0,1,2.73-.37h201V172.2H450.48V490.52A11.73,11.73,0,0,1,450,492.9Z" fill="currentColor"/>
                    <path color="currentColor" d="M443.18,512H68.83a36.24,36.24,0,0,1-11.37-2.12,6,6,0,0,1-1.8-1.08L47.8,502a4.81,4.81,0,0,1-1.22-1.58,24.75,24.75,0,0,1-2.44-9.87v-469a24.81,24.81,0,0,1,2.44-9.91A5.21,5.21,0,0,1,47.8,10l7.83-6.83A6.17,6.17,0,0,1,57.48,2.1,36,36,0,0,1,68.83,0H274.69a20.51,20.51,0,0,1,12.24,4.42l175.88,153a15.42,15.42,0,0,1,5.05,10.61V490.52a24.91,24.91,0,0,1-2.42,9.87A5.13,5.13,0,0,1,464.2,502l-7.83,6.81a6.28,6.28,0,0,1-1.8,1.08A36.38,36.38,0,0,1,443.18,512ZM67.56,490.36,69,491.63l374,0,1.46-1.27V177.42H269.83c-3.3,0-6-2.33-6-5.22V20.37H69l-1.44,1.26ZM275.84,167H450.48a6.16,6.16,0,0,1,5.39,2.92v-1.83a6.08,6.08,0,0,0-1.53-3.22L278.42,11.79a8.24,8.24,0,0,0-3.74-1.34h-2.23a5.21,5.21,0,0,1,3.38,4.7Z" fill="currentColor"/>
                </svg>
                <div class="tw-absolute tw-inset-0 tw-flex tw-uppercase tw-flex-row tw-items-center justify-center tw-mt-4 tw-text-xl tw-font-medium">
                    {{ fileExtension(file.filename) }}
                </div>
            </div>
        </template>

        <div class="tw-absolute tw-z-[999] tw-w-full tw-flex-row tw-items-center tw-justify-between tw-bg-black/60 tw-text-white tw-py-1 tw-px-2 tw-rounded-b-lg tw-text-sm tw-hidden group-hover:tw-flex">
            <span v-if="isImage">{{ fileExtension(file.filename) }}</span>
            <span class="tw-truncate" v-else>{{ file.name }}</span>
            <span class="tw-flex-grow tw-flex-shrink-0 tw-text-right">{{ humanFileSize(file.filesize) }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { humanFileSize, fileExtension } from '@/libs/tools';
import { useAppStore } from '@/store/app';

const store = useAppStore();
const emitter = defineEmits(['openInfo']);

const props = defineProps({
    file: {
        type: Object,
        default: null
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

const isImage = computed(() =>
{
    const imageTypes = ['jpeg', 'jpg', 'png', 'webp'];
    const ext = props.file.url.split('.').pop();
    return (imageTypes.includes(ext));
});

const isUsable = computed(() =>
{
    if (props.mode === 'image' && isImage.value) return true;
    return props.mode !== 'image';
});

const openInfo = (e) =>
{
    e.preventDefault();
    e.stopPropagation();
    emitter('openInfo', props.file);
}

const toggleSelection = (event, file) =>
{
    if (props.mode === 'image' && isImage.value || props.mode !== 'image' && !isImage.value) {
        let isMulti = props.multi;
        if (event.metaKey || event.ctrlKey) isMulti = true;

        if (!store.assets.selected.includes(file)) {
            store.setSelectedFile(file, true, isMulti);
            return;
        }

        store.setSelectedFile(file, false, isMulti);
    }
}
</script>
