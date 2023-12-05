<template>
    <div
        id="test-test"
        v-if="show"
        :class="{ 'tw-absolute': !overall, 'tw-fixed': overall }"
        class="tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]"
    >
        <v-card rounded class="tw-p-6">
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                <v-form autocomplete="off">
                    <v-text-field
                        variant="outlined"
                        color="primary"
                        id="tab_name"
                        :hide-details="true"
                        v-model="tabName"
                        density="comfortable"
                        :label="$t('layout.tabname')"
                        class="tw-mb-2"
                    />
                </v-form>
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn
                    @click.prevent="$emit('cancel')"
                    flat
                >{{ $t("system.cancel") }}</v-btn
                >
                <v-btn
                    type="primary"
                    variant="flat"
                    color="primary"
                    :disabled="tabName.trim().length===0"
                    @click.prevent="$emit('assign', tabName)"
                    :loading="loading"
                >{{ $t("system.set") }}</v-btn
                >
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

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

const tabName = ref('');

defineEmits(["cancel", "assign"]);

onMounted(() => document.getElementById('tab_name').focus());
</script>
