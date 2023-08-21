<template>
    <div class="tw-fixed tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]">
        <v-card rounded class="tw-p-6">
            <div class="tw-flex tw-flex-row tw-items-center tw-justify-between">
                <v-card-title>{{ $t('layout.tab_settings') }}</v-card-title>
                <v-btn @click.prevent="$emit('close')" variant="flat" icon="mdi-close"></v-btn>
            </div>

            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-my-4">
                <v-text-field
                    v-model="tabName"
                    variant="outlined"
                    color="primary"
                    density="comfortable"
                    :label="$t('layout.tab_name')"
                    validate-on="blur"
                    :hide-details="true"
                    :rules="[rules.required]"
                />
            </v-card-text>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-between">
                <div>
                    <button @click.prevent="$emit('delete')" class="hover:tw-text-red-500"><v-icon icon="mdi-trash-can-outline"/></button>
                </div>
                <div>
                    <v-btn
                        @click.prevent="$emit('close')"
                        flat
                    >{{ $t("system.cancel") }}</v-btn>
                    <v-btn
                        type="primary"
                        variant="flat"
                        color="primary"
                        @click.prevent="$emit('update', tabName)"
                    >{{ $t("system.save") }}</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    tab: {
        type: Object,
        default: null
    }
});

const tabName = ref(props.tab.label);

defineEmits(['close', 'delete', 'update']);

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required')
};
</script>
