<template>
    <div
        @click.prevent="emitter.emit('crop', {image: 'xxxxxxx', src: 'https://voxatl.org/wp-content/uploads/2019/04/avengers-endgame-poster-square-crop.jpg'})"
        class="tw-cursor-pointer tw-bg-center tw-bg-cover tw-w-[150px] tw-group tw-h-[150px] tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        :style="'background-image: url(' + file.url + ')'"
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

defineEmits(['openCrop']);

defineProps({
    file: {
        type: Object,
        default: null
    }
});

const emitter = inject('emitter');
</script>
