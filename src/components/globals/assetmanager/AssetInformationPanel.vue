<template>
    <div class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-justify-end tw-z-[9999]">
        <v-card rounded class="tw-p-6 tw-duration-300 tw-transition-all" :class="{'tw-mr-[-300px]': !show, 'tw-mr-[0px]': show}">
            <div class="tw-max-w-[250px] tw-w-[250px]">
                <h1 class="tw-text-2xl">Information</h1>
                <div class="tw-mt-6">
                    Title
                    <div class="info-row">
                        <span class="tw-mr-4">Filename:</span>
                        <span class="tw-overflow-ellipsis tw-truncate">{{ file.name }}</span>
                    </div>
                    <div class="info-row">
                        <span>Filesize:</span>
                        <span>{{ humanFileSize(file.filesize) }}</span>
                    </div>
                    <div class="info-row">
                        <span>Size:</span>
                        <span>{{ file.size.width }}x{{ file.size.height}}</span>
                    </div>
                    <div class="info-row">
                        <span>Transform Count:</span>
                        <span>{{ file.transforms.length }}</span>
                    </div>
                    <div class="info-row">
                        <span>Uploaded by:</span>
                        <span>{{ file.uploader?.name.full || 'Unknown' }}</span>
                    </div>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { humanFileSize } from '@/libs/tools';

const show = ref(false);
const props = defineProps({
    file: {
        type: Object,
        default: null
    }
});

onMounted(() =>
{
    setTimeout(() => show.value = true, 250);
});
</script>

<style lang="postcss">
.info-row {
    @apply tw-flex tw-flex-row tw-justify-between;
}
</style>
