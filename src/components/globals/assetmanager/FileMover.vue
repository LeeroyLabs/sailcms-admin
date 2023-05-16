<template>
    <div v-if="show" class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center">
        <v-card rounded class="tw-p-6">
            <v-card-title>{{ $t('assets.move_some') }} {{ (store.assets.selected.length > 1) ? $t('assets.files') : $t('assets.file') }} ({{ store.assets.selected.length }})</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                <v-select
                    v-model="selectedFolder"
                    color="primary"
                    :items="folders"
                    variant="outlined"
                    density="comfortable"
                    single-line
                    class="tw-w-full"
                ></v-select>
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn :disabled="isLoading" @click.prevent="$emit('cancel')" flat>{{ $t('assets.cancel') }}</v-btn>
                <v-btn type="primary" variant="flat" color="primary" @click.prevent="moveFiles" :loading="isLoading">{{ $t('assets.move') }}</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>

import { computed, ref } from 'vue';
import { useAppStore } from '@/store/app';
import { Assets } from '@/libs/graphql';

const emitter = defineEmits(['cancel', 'moved']);

const props = defineProps({
    show: {
        type: Boolean,
        default: true
    },
    folder: {
        type: String,
        default: ''
    }
});

const store = useAppStore();

const selectedFolder = ref(props.folder);
const isLoading = ref(false);

const folders = computed(() =>
{
    const list = [{value: 'root', title: 'Root'}];

    for (let i = 0; i < store.assets.folders.length; i++) {
        const folder = store.assets.folders[i];

        if (folder.slug !== 'root') {
            list.push({ value: folder.slug, title: folder.name });
        }
    }

    return list;
});

const moveFiles = async () =>
{
    isLoading.value = true;
    await Assets.moveFiles(store.assets.selected, selectedFolder.value);
    isLoading.value = false;

    emitter('moved', store.assets.selected);
    selectedFolder.value = 'root';
    store.clearSelectedAssets();
}
</script>
