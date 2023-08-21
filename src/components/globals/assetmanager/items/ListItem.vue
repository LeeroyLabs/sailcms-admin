<template>
    <div
        v-if="mode === 'image' && isImage || mode !== 'image'"
        @click.prevent="(e) => toggleSelection(e, file._id)"
        class="tw-flex tw-flex-row tw-items-center tw-p-2 tw-rounded-lg hover:tw-outline"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name !== 'light',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline': store.assets.selected.includes(file._id),
            'tw-cursor-pointer': isUsable
        }"
        style="outline-width: 3px;"
    >
        <div
            v-if="isImage"
            class="tw-bg-center tw-bg-cover tw-w-[40px] tw-h-[40px] tw-rounded-lg tw-mr-4"
            :style="'background-image: url(' + file.url + ');'"
        ></div>
        <div
            v-else
            class="tw-w-[40px] tw-h-[40px] tw-rounded-lg tw-mr-4"
        >
            <svg class="tw-w-[35px] tw-h-[35px] tw-block tw-mb-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M458.57,161.13,282.66,8.1a14.08,14.08,0,0,0-8-2.87H68.83a29.72,29.72,0,0,0-8.93,1.65l-7.83,6.83a20.09,20.09,0,0,0-1.92,7.77v469a20.08,20.08,0,0,0,1.92,7.75l7.83,6.83a29.45,29.45,0,0,0,8.93,1.67H443.18a29.18,29.18,0,0,0,8.93-1.67l7.85-6.83a20.5,20.5,0,0,0,1.89-7.75V168.06A10.54,10.54,0,0,0,458.57,161.13ZM450,492.9l-4.09,3.56a16.74,16.74,0,0,1-2.75.38H68.83a16.16,16.16,0,0,1-2.73-.38L62,492.9a11.31,11.31,0,0,1-.43-2.38v-469A11.15,11.15,0,0,1,62,19.09l4.12-3.57a16.27,16.27,0,0,1,2.73-.37h201V172.2H450.48V490.52A11.73,11.73,0,0,1,450,492.9Z" fill="currentColor"/>
                <path color="currentColor" d="M443.18,512H68.83a36.24,36.24,0,0,1-11.37-2.12,6,6,0,0,1-1.8-1.08L47.8,502a4.81,4.81,0,0,1-1.22-1.58,24.75,24.75,0,0,1-2.44-9.87v-469a24.81,24.81,0,0,1,2.44-9.91A5.21,5.21,0,0,1,47.8,10l7.83-6.83A6.17,6.17,0,0,1,57.48,2.1,36,36,0,0,1,68.83,0H274.69a20.51,20.51,0,0,1,12.24,4.42l175.88,153a15.42,15.42,0,0,1,5.05,10.61V490.52a24.91,24.91,0,0,1-2.42,9.87A5.13,5.13,0,0,1,464.2,502l-7.83,6.81a6.28,6.28,0,0,1-1.8,1.08A36.38,36.38,0,0,1,443.18,512ZM67.56,490.36,69,491.63l374,0,1.46-1.27V177.42H269.83c-3.3,0-6-2.33-6-5.22V20.37H69l-1.44,1.26ZM275.84,167H450.48a6.16,6.16,0,0,1,5.39,2.92v-1.83a6.08,6.08,0,0,0-1.53-3.22L278.42,11.79a8.24,8.24,0,0,0-3.74-1.34h-2.23a5.21,5.21,0,0,1,3.38,4.7Z" fill="currentColor"/>
            </svg>
        </div>
        <div class="tw-w-full tw-flex tw-flex-col tw-gap-y-0.2">
            <h2 class="tw-font-medium tw-flex-grow">{{ cleanName(file.title[$i18n.locale]) }}</h2>
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
    },
    mode: {
        type: String,
        default: 'image'
    }
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

const emitter = inject('emitter');

const toggleSelection = (event, file) =>
{
    if (props.mode === 'image' && isImage.value || props.mode !== 'image') {
        let isMulti = props.multi;
        if (event.metaKey || event.ctrlKey) isMulti = true;

        if (!store.assets.selected.includes(file)) {
            store.setSelectedFile(file, true, isMulti);
            return;
        }

        store.setSelectedFile(file, false, isMulti);
    }
}

const cleanName = (filename) =>
{
    const parts = filename.split('/');
    const count = parts.length;

    return parts[count - 1];
}
</script>
