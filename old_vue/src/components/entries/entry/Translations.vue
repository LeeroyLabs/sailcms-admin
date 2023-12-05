<template>
    <div v-if="entry._id !== ''" class="tw-rounded-md tw-pb-4" :class="{'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
        <h2 class="panel-title tw-p-4 tw-pb-0 tw-mb-2">Translations</h2>

        <div class="panel-trans">
            <div
                class="tw-flex !tw-flex-row tw-items-center tw-justify-between hover:tw-bg-gray-100 tw-px-4 tw-py-2"
                :class="{'hover:tw-bg-gray-100': $vuetify.theme.name === 'light', 'hover:tw-bg-neutral-700': $vuetify.theme.name === 'dark'}"
            >
                <h4>Francais</h4>
                <v-btn variant="flat" color="primary" size="x-small" icon="mdi-pencil-outline"></v-btn>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    entry: {
        type: Object,
        default: {}
    }
});
</script>

<style lang="postcss">
.panel-title {
    @apply tw-font-medium;
}

.panel-trans {
    @apply tw-flex tw-flex-col;
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
</style>
