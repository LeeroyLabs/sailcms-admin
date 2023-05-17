<template>
    <div v-if="file.isImage" class="tw-flex tw-relative tw-group tw-flex-row tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px] tw-border tw-border-gray-900 tw-rounded-lg tw-bg-center tw-bg-cover" :style="'background-image: url(' + file.data + ');'">
        <div v-if="file.toobig || !file.uploadable" class="tw-absolute tw-flex tw-flex-row tw-items-center tw-justify-center tw-inset-0 tw-bg-black/70">
            <v-icon icon="mdi-alert-outline" color="yellow" size="48" class="group-hover:tw-opacity-40"/>
        </div>
        <v-btn v-if="!disabled" @click.prevent="removeFile" class="tw-hidden tw-z-[9999] group-hover:!tw-block tw-bg-red-800/60" icon="mdi-close" variant="elevated" size="x-large"></v-btn>
        <v-tooltip v-if="file.toobig" activator="parent" location="bottom">{{ $t('assets.errors.toobig') }}</v-tooltip>
        <v-tooltip v-if="!file.uploadable" activator="parent" location="bottom">{{ $t('assets.errors.notallowed') }}</v-tooltip>
    </div>
    <div v-else class="tw-flex tw-relative tw-group tw-flex-row tw-items-center tw-justify-center tw-w-[100px] tw-h-[100px] tw-border tw-border-gray-900 tw-rounded-lg tw-bg-center tw-bg-cover">
        <v-icon icon="mdi-file-outline" size="60"/>
        <div v-if="file.toobig || !file.uploadable" class="tw-absolute tw-flex tw-flex-row tw-items-center tw-justify-center tw-inset-0 tw-bg-black/70">
            <v-icon icon="mdi-alert-outline" color="yellow" size="48" class="group-hover:tw-opacity-40"/>
        </div>
        <v-btn v-if="!disabled" @click.prevent="removeFile" class="tw-hidden tw-z-[9999] group-hover:!tw-block tw-absolute tw-bg-red-800/60" icon="mdi-close" variant="elevated" size="x-large"></v-btn>
        <v-tooltip v-if="file.toobig" activator="parent" location="bottom">{{ $t('assets.errors.toobig') }}</v-tooltip>
        <v-tooltip v-if="!file.uploadable" activator="parent" location="bottom">{{ $t('assets.errors.notallowed') }}</v-tooltip>
    </div>
</template>

<script setup>
const emitter = defineEmits(['remove']);

const props = defineProps({
    file: {
        type: Object,
        default: null
    },
    index: {
        type: Number,
        default: 0
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const removeFile = () =>
{
    if (props.disabled) return;
    emitter('remove', props.index);
}
</script>
