<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="(type.value === 'text' || type.value === 'password') ? $t('fields.options.min_length') + ' *' : $t('fields.options.min_num') + ' *'"
            v-model="internalValue.min"
        />

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="(type.value === 'text' || type.value === 'password') ? $t('fields.options.max_length') + ' *' : $t('fields.options.max_num') + ' *'"
            v-model="internalValue.max"
        >
            <div class="tw-absolute tw-bottom-[-26px] tw-right-0 tw-text-sm" :class="{'tw-text-white/40': $vuetify.theme.name === 'dark', 'tw-text-black/60': $vuetify.theme.name === 'light'}">
                {{ $t('fields.minus_one_for_max_limit') }}
            </div>
        </v-text-field>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { devuetify } from '@/libs/tools';

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
const internalValue = ref({min: props.field.config.min || 1, max: props.field.config.max || 255});

watch(internalValue.value, (v) =>
{
    runBasic(v);
});

const runBasic = (v) =>
{
    const config = cloneDeep(props.field.config);
    const val = (v) ? v : internalValue.value;
    config.min = parseInt(val.min);

    // if (parseInt(val.min) > parseInt(val.max)) val.max = val.min;
    config.max = parseInt(val.max);

    emitter('change', config);
}

runBasic(null);
</script>
