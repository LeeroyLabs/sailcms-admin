<template>
    <div class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center">
        <v-card rounded class="tw-p-6 tw-w-11/12 lg:tw-w-6/12">
            <v-card-title>Upload</v-card-title>
            <v-card-text class="tw-mt-4 tw-w-full tw-flex tw-max-h-[300px]">
                <div id="dnd" class="tw-min-h-[300px] tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-lg tw-flex tw-w-full">
                    <div v-if="previewList.length === 0" class="tw-text-xl tw-p-6 tw-rounded-lg tw-h-full tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-center tw-text-center">
                        Drop files here or click in this box to upload
                    </div>
                    <div v-else class="tw-flex tw-gap-2.5 tw-p-6 tw-flex-wrap tw-overflow-y-auto">
                        <template v-for="file in previewList">
                            <Preview :file="file" />
                        </template>
                    </div>
                </div>
            </v-card-text>

<!--            <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)">-->

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn color="primary" variant="flat" >Upload</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Preview from '@/components/globals/assetmanager/upload/preview.vue';

const fileList = ref([]);
const previewList = ref([]);

onMounted(() =>
{
    // Listen to DnD
    let dropArea = document.getElementById('dnd');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    dropArea.addEventListener('drop', handleDrop, false);
});

const preventDefaults = (e) =>
{
    e.preventDefault();
    e.stopPropagation();
}

const highlight = (e) =>
{
    let dropArea = document.getElementById('dnd');
    dropArea.classList.add('highlight');
}

const unhighlight = (e) =>
{
    let dropArea = document.getElementById('dnd');
    dropArea.classList.remove('highlight');
}

const handleDrop = (e) =>
{
    let dt = e.dataTransfer;
    let files = dt.files;

    ([...files]).forEach(prepareFiles);
}

const prepareFiles = async (file) =>
{
    // Get file data
    let isImage = file.type.includes('image/');
    let fileObj = {file: file, data: '', isImage: isImage, uploadable: true, toobig: false};
    let reader = new FileReader();

    if (file.size > 5000) {
        fileObj.uploadable = false;
        fileObj.toobig = true;
    }

    reader.addEventListener('load', (event) =>
    {
        previewList.value.push({
            data: reader.result,
            uploadable: fileObj.uploadable,
            toobig: fileObj.toobig
        });

        fileObj.data = reader.result.split('base64,')[1];
        fileList.value.push(fileObj);
    });

    reader.readAsDataURL(file);
}

defineProps({
    folder: {
        type: String,
        default: 'root'
    }
});
</script>

<style>
#dnd.highlight {
    @apply tw-bg-primary;
}
</style>
