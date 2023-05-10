<template>
    <div v-if="!$vuetify.display.mobile" :class="{'tw-w-[250px]': show, 'tw-w-[0px]': !show, 'tw-bg-slate-600': $vuetify.theme.name !== 'light', 'tw-bg-gray-200': $vuetify.theme.name === 'light'}" class="tw-transition-all tw-duration-300 tw-flex tw-flex-shrink-0 tw-flex-col tw-h-full tw-max-h-full">
        <Transition>
            <div
                v-if="showContent"
                class="tw-flex-grow tw-max-h-full tw-w-full tw-flex tw-flex-col tw-justify-between tw-border-r"
                :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}"
            >
                <div class="tw-overflow-y-auto tw-flex tw-flex-col tw-p-4">
                    <Folder name="root" :active="true"/>
                </div>
                <div class="tw-p-3 tw-border-t" :class="{'tw-bg-slate-600 tw-border-slate-700': $vuetify.theme.name !== 'light', 'tw-bg-gray-200 tw-border-gray-300': $vuetify.theme.name === 'light'}">
                    FOLDER ACTIONS
                </div>
            </div>
        </Transition>
    </div>

    <Transition>
        <div v-if="show && $vuetify.display.mobile" class="tw-absolute tw-inset-0 tw-bg-black/40 tw-flex tw-flex-row tw-items-center tw-z-[999]">
            <div class="tw-w-11/12 tw-mx-auto tw-pt-4 tw-pb-6 tw-px-6 tw-rounded-lg tw-flex tw-flex-col" :class="{'tw-bg-gray-200 tw-shadow-lg': false, 'tw-bg-slate-700': true}">
                <div class="tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <h2 class="tw-text-lg text-font-medium">Select Folder</h2>
                    <v-btn @click.prevent="cancelSelection" flat icon>
                        <v-icon icon="mdi-close"/>
                    </v-btn>
                </div>
                <div class="tw-mt-6">
                    <v-select density="comfortable" hide-details variant="outlined" color="primary" label="Select" :single-line="true" :items="['Root', 'Coolio']"></v-select>
                </div>
                <div class="tw-flex tw-flex-row tw-justify-end tw-mt-6">
                    <v-btn @click.prevent="cancelSelection" flat>Cancel</v-btn>
                    <v-btn color="primary" class="tw-ml-2">Select</v-btn>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Folder from "@/components/globals/assetmanager/Folder.vue";

const showContent = ref(true);
const emit = defineEmits(['close']);

const props = defineProps({
    show: {
        type: Boolean,
        default: true
    }
});

const toggleState = () =>
{
    showContent.value = !showContent.value;

    let value = 'show';
    if (!props.show) value = 'hide';
    localStorage.setItem('sam_nav', value);
}

const cancelSelection = () => emit('close');

defineExpose({toggleState});
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
