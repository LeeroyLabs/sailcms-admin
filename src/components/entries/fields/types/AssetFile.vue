<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-text-field
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.allowed_types') + ' *'"
            v-model="internalValue.allowed_types"
            class="tw-col-span-2"
        />

        <div>
            <h2>{{ $t('fields.options.select_many') }}</h2>
            <v-radio-group v-model="internalValue.multi" hide-details :inline="true" class="tw-flex tw-flex-row tw-col-span-2">
                <v-radio :label="$t('system.no')" :value="false" class="tw-mr-4"></v-radio>
                <v-radio :label="$t('system.yes')" :value="true" class="tw-mr-4"></v-radio>
            </v-radio-group>
        </div>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
};

const props = defineProps({
    field: {
        type: Object,
        default: {}
    },
    type: {
        type: Object,
        default: {}
    }
});

const emitter = defineEmits(['change']);

const internalValue = ref({
    allowed_types: props.field.config.allowed_types || '.docx,.doc,.xlsx,.xls,.pdf,.pptx,.ppt',
    multi: false,
});

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);
    config.allowed_types = v.allowed_types.replace(/\s/g, '');
    config.multi = v.multi;
    emitter('change', config);
});
</script>
