<template>
    <div class="tw-rounded-md" :class="{'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
        <div class="tw-p-4">
            <div class="panel-info !tw-px-0">
                <div v-if="$route.params.id === 'add'" class="tw-text-center tw-mt-4 tw-font-medium tw-text-gray-400">
                    Available after entry is created.
                </div>
            </div>
        </div>

        <div
            class="panel-bottom"
            :class="{'tw-border-gray-200 tw-bg-gray-50': $vuetify.theme.name === 'light', 'tw-bg-lightdark tw-border-neutral-700': $vuetify.theme.name === 'dark'}"
        >
            <v-btn variant="flat" color="primary">Use</v-btn>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="postcss">
.panel-title {
    @apply tw-font-medium;
}

.panel-info {
    @apply tw-p-4 tw-flex tw-flex-col tw-gap-y-2;
}

.panel-info div {
    @apply tw-flex tw-flex-col;
}

.panel-info div h2 {
    @apply tw-font-medium tw-text-neutral-600;
}

.panel-info div p {
    @apply tw-text-neutral-400 tw-text-sm;
}

.panel-bottom {
    @apply tw-mt-4 tw-px-4 tw-py-3 tw-rounded-b-md tw-border-t tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-x-2;
}
</style>
