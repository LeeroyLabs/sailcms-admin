<template>
    <div class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center">
        <v-card rounded class="tw-p-6 tw-w-11/12 lg:tw-w-8/12">
            <v-card-title>{{ $t('assets.upload') }}</v-card-title>
            <v-btn :disabled="isUploading" @click.prevent="$emit('cancel')" class="tw-absolute tw-top-6 tw-right-6" rounded flat icon="mdi-close"></v-btn>
            <v-card-text class="tw-mt-4 tw-w-full tw-flex tw-max-h-[350px]">
                <div
                    id="dnd"
                    @click="openFileBrowser"
                    class="tw-min-h-[300px] tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-lg tw-flex tw-w-full"
                    :class="{'tw-cursor-pointer': previewList.length === 0}"
                >
                    <div v-if="previewList.length === 0" class="tw-text-xl tw-p-6 tw-rounded-lg tw-h-full tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-center tw-text-center">
                        Drop files here or click in this box to upload
                    </div>
                    <div v-else class="tw-flex tw-gap-2.5 tw-p-6 tw-flex-wrap tw-overflow-y-auto">
                        <template v-for="(file, idx) in previewList">
                            <Preview :disabled="isUploading" :file="file" :index="idx" @remove="removeUpload" />
                        </template>
                    </div>
                </div>
            </v-card-text>

            <input type="file" class="tw-hidden" id="fileElem" ref="uploader" multiple accept="*.*" @change="handleFiles">

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <div class="tw-w-[150px] tw-mr-4" v-if="isUploading">
                    <v-progress-linear
                        v-model="progressValue"
                        :buffer-value="100"
                        class=""
                    />
                </div>
                <v-btn v-if="!isUploading" @click.prevent="startUpload" color="primary" variant="flat" >{{ $t('assets.do_upload') }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Preview from '@/components/globals/assetmanager/upload/preview.vue';
import { useAppStore } from '@/store/app';
import { fileExtension } from '@/libs/tools';
import { Assets } from '@/libs/graphql';

const fileList = ref([]);
const previewList = ref([]);
const uploader = ref(null);
const isUploading = ref(false);
const progressValue = ref(0);

const store = useAppStore();

const emitter = defineEmits(['cancel', 'upload']);

const props = defineProps({
    folder: {
        type: String,
        default: 'root'
    }
});

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

const handleFiles = (e) =>
{
    let files = e.target.files;
    ([...files]).forEach(prepareFiles);
}

const prepareFiles = async (file) =>
{
    // Get file data
    let isImage = file.type.includes('image/');
    let fileObj = {file: file, data: '', isImage: isImage, uploadable: true, toobig: false};
    let reader = new FileReader();

    const config = store.assets.config;

    // File is too big
    if (file.size > config.maxSize) {
        fileObj.uploadable = false;
        fileObj.toobig = true;
    }

    // File type is blacklisted
    if (config.blacklist.includes(fileExtension(file.name))) {
        fileObj.uploadable = false;
    }

    reader.addEventListener('load', (event) =>
    {
        previewList.value.push({
            data: reader.result,
            uploadable: fileObj.uploadable,
            toobig: fileObj.toobig,
            isImage: fileObj.isImage
        });

        fileObj.data = reader.result.split('base64,')[1];
        fileList.value.push(fileObj);
    });

    reader.readAsDataURL(file);
}

const openFileBrowser = () =>
{
    if (previewList.value.length === 0) {
        uploader.value.click();
    }
}

// Remove given file index from the list of files to upload
const removeUpload = (index) =>
{
    previewList.value = previewList.value.filter((item, idx) => idx !== index);
    fileList.value = fileList.value.filter((item, idx) => idx !== index);
}

// Upload all files
const startUpload = async () =>
{
    isUploading.value = true;

    let itemCount = 0;

    for (let file of fileList.value) {
        if (file.uploadable) {
           itemCount++;
        }
    }

    let promises = [];
    let total = 0;
    let itemValue = 100 / itemCount;

    // Upload files
    for (let file of fileList.value) {
        if (file.uploadable) {
            total++;
            promises.push(new Promise(async (resolve, reject) =>
            {
                let asset = await Assets.uploadAsset(file.data, file.file.name, props.folder, store.locales);
                progressValue.value += itemValue;

                // Tell the ui we have a new file
                if (asset !== null) emitter('upload', asset);

                resolve(true);
            }));
        }
    }

   Promise.allSettled(promises).then(results =>
   {
       setTimeout(() =>
       {
           isUploading.value = false;
           fileList.value = [];
           previewList.value = [];
       }, 250);
   });
}
</script>

<style>
#dnd.highlight {
    @apply tw-bg-primary;
}
</style>
