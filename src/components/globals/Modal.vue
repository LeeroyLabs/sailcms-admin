<template>
    <div
        class="tw-bg-black/40 tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-[9999]"
    >
        <v-card rounded class="tw-p-6">
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                {{ message }}
            </v-card-text>

            <slot name="content" />
        </v-card>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: "",
    },
    message: {
        type: String,
        default: "",
    },
});
</script>
