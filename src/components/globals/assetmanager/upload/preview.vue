<template>
    <div v-if="file.isImage" class="tw-flex tw-relative tw-group tw-flex-row tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px] tw-border tw-border-gray-900 tw-rounded-lg tw-bg-center tw-bg-cover" :style="'background-image: url(' + file.data + ');'">
        <div v-if="file.toobig" class="tw-absolute tw-flex tw-flex-row tw-items-center tw-justify-center tw-inset-0 tw-bg-black/70">
            <v-icon icon="mdi-alert-outline" color="yellow" size="48" class="group-hover:tw-opacity-40"/>
        </div>
        <v-btn class="tw-hidden tw-z-[9999] group-hover:!tw-block tw-bg-red-800/60" icon="mdi-close" variant="elevated" size="x-large"></v-btn>
        <v-tooltip activator="parent" location="bottom">File too big</v-tooltip>
    </div>
    <div v-else class="tw-flex tw-relative tw-group tw-flex-row tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px] tw-border tw-border-gray-900 tw-rounded-lg tw-bg-center tw-bg-cover">
        <v-icon icon="mdi-file-outline" size="60"/>
        <div v-if="file.toobig" class="tw-absolute tw-flex tw-flex-row tw-items-center tw-justify-center tw-inset-0 tw-bg-black/70">
            <v-icon icon="mdi-alert-outline" color="yellow" size="48" class="group-hover:tw-opacity-40"/>
        </div>
        <v-btn class="tw-hidden tw-z-[9999] group-hover:!tw-block tw-absolute tw-bg-red-800/60" icon="mdi-close" variant="elevated" size="x-large"></v-btn>
        <v-tooltip activator="parent" location="bottom">File too big</v-tooltip>
    </div>
</template>

<script setup>
defineProps({
    file: {
        type: Object,
        default: null
    }
});
</script>
