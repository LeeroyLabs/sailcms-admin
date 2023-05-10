<template>
    <div
        @click.prevent="emitter.emit('crop', {image: 'xxxxxxx', src: 'https://voxatl.org/wp-content/uploads/2019/04/avengers-endgame-poster-square-crop.jpg'})"
        class="tw-cursor-pointer tw-bg-center tw-bg-cover tw-w-[150px] tw-group tw-h-[150px] tw-rounded-lg tw-flex tw-flex-row tw-items-end tw-relative"
        style="background-image: url(https://voxatl.org/wp-content/uploads/2019/04/avengers-endgame-poster-square-crop.jpg);"
    >
        <div class="tw-absolute tw-top-0 tw-right-0 tw-hidden group-hover:tw-block tw-bg-black/60">
            <v-icon icon="mdi-cloud-check-outline"/>
        </div>
        <div class="tw-w-full tw-flex-row tw-items-center tw-justify-between tw-bg-black/60 tw-py-1 tw-px-2 tw-rounded-b-lg tw-text-sm tw-hidden group-hover:tw-flex">
            <span>webp</span>
            <span>98KB</span>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue';

defineEmits(['openCrop']);

const emitter = inject('emitter');
</script>
