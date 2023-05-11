<template>
    <div v-if="show" class="tw-absolute tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center">
        <v-card rounded class="tw-p-6">
            <v-card-title>Move (x) files</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                <v-select
                    v-model="selectedGroup"
                    label="current folder"
                    color="primary"
                    :items="availableGroups"
                    variant="outlined"
                    density="comfortable"
                    single-line
                    :no-data-text="$t('user.no_groups')"
                    placeholder="current folder"
                    class="tw-w-full"
                ></v-select>
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn @click.prevent="$emit('cancel')" flat>Cancel</v-btn>
                <v-btn variant="tonal">Move</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
<script setup>

import { computed } from 'vue';
import { useAppStore } from '@/store/app';

defineEmits(['cancel']);

defineProps({
    show: {
        type: Boolean,
        default: true
    }
});

const store = useAppStore();

const folders = computed(() =>
{
    const list = [];

    for (let i = 0; i < store.assets.folders.length; i++) {

    }
});
</script>
