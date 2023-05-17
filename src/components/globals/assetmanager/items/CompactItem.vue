<template>
    <div
        @click.prevent="(e) => toggleSelection(e, file._id)"
        class="tw-cursor-pointer hover:tw-outline tw-bg-center tw-bg-cover tw-group tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        :class="{
            'tw-outline-gray-300': $vuetify.theme.name !== 'light',
            'tw-outline-blue-500': $vuetify.theme.name === 'light',
            'tw-outline': store.assets.selected.includes(file._id)
        }"
        style="outline-width: 3px;"
    >
        <img :src="file.url" loading="lazy" class="tw-rounded-lg tw-max-h-[80px] lg:tw-max-h-[90px]" :width="($vuetify.display.lgAndUp) ? 90 : 80" :height="($vuetify.display.lgAndUp) ? 90 : 80" alt=""/>
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
