<template>
    <div class="tw-fixed tw-bg-black tw-bg-opacity-[9%] tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]">
        <v-card rounded class="tw-p-6">
            <div class="tw-flex tw-flex-row tw-items-center tw-justify-between">
                <v-card-title>{{ $t('layout.field_settings') }}</v-card-title>
                <v-btn @click.prevent="$emit('close')" variant="flat" icon="mdi-close"></v-btn>
            </div>

            <v-card-text class="tw-mb-4 tw-mt-2 tw-max-w-[520px]">
                {{ $t('layout.explain_field_size') }}
                <div class="tw-mb-6"></div>
                <v-btn-toggle
                    v-model="selectedWidth"
                    group
                    color="primary"
                    class="tw-w-full tw-border"
                    :class="{'tw-border-gray-100': $vuetify.theme.name === 'light', 'tw-border-neutral-600': $vuetify.theme.name === 'dark'}"
                >
                    <v-btn class="tw-w-1/3" value="third">1/3 width</v-btn>
                    <v-btn class="tw-w-1/3" value="half">1/2 width</v-btn>
                    <v-btn class="tw-w-1/3" value="full">Full width</v-btn>
                </v-btn-toggle>
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <div>
                    <v-btn
                        @click.prevent="$emit('close')"
                        variant="flat"
                    >{{ $t("system.cancel") }}</v-btn>
                    <v-btn
                        type="primary"
                        variant="flat"
                        color="primary"
                        @click.prevent="$emit('change', selectedWidth)"
                    >{{ $t("system.save") }}</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    field: {
        type: Object,
        default: null
    }
});

const emitter = defineEmits(['change', 'close']);
const selectedWidth = ref(props.field.width || 'full');

watch(selectedWidth, v =>
{
    // Require a value
    if (v === '' || v === null || v === undefined) {
        selectedWidth.value = 'full';
    }
});

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required')
};
</script>
