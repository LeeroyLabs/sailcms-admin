<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.rows') + ' *'"
            v-model="internalValue.rows"
        />

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.max_chars') + ' *'"
            v-model="internalValue.max"
        >
            <template v-slot:details><span class="tw-mr-[-12px]" :class="{'tw-text-white/40': $vuetify.theme.name === 'dark', 'tw-text-black/60': $vuetify.theme.name === 'light'}">{{ $t('fields.options.max_chars_explain') }}</span></template>
        </v-text-field>
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

const internalValue = ref({rows: props.field.config.rows || 8, max: props.field.config.max_chars || -1});

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);
    config.rows = parseInt(v.rows);
    config.max_chars = parseInt(v.max);
    emitter('change', config);
});
</script>
