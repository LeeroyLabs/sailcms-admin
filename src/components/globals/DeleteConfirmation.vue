<template>
    <div
        v-if="show"
        :class="{ 'tw-absolute': !overall, 'tw-fixed': overall }"
        class="tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]"
    >
        <v-card rounded class="tw-p-6">
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                {{ message }}
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn
                    :disabled="loading"
                    @click.prevent="$emit('cancel')"
                    flat
                    >{{ $t("system.no") }}</v-btn
                >
                <v-btn
                    type="primary"
                    variant="flat"
                    color="red"
                    @click.prevent="$emit('accept')"
                    :loading="loading"
                    >{{ $t("system.yes") }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    overall: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: "",
    },
    message: {
        type: String,
        default: "",
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

defineEmits(["cancel", "accept"]);
</script>
