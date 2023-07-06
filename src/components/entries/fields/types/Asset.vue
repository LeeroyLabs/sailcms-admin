<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-text-field
            variant="outlined"
            color="primary"
            density="comfortable"
            :label="$t('fields.options.crop_name')"
            v-model="internalValue.name"
        >
            <template v-slot:details>
                <span class="tw-mr-[-12px]" :class="{'tw-text-white/40': $vuetify.theme.name === 'dark', 'tw-text-black/60': $vuetify.theme.name === 'light'}">
                    {{ $t('fields.crop_key_explain') }}
                </span>
            </template>
        </v-text-field>

        <v-text-field
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.ratio') + ' *'"
            v-model="internalValue.ratio"
        >
            <template v-slot:details>
                <span class="tw-mr-[-12px]" :class="{'tw-text-white/40': $vuetify.theme.name === 'dark', 'tw-text-black/60': $vuetify.theme.name === 'light'}">
                    {{ $t('fields.ratio_explain') }}
                </span>
            </template>
        </v-text-field>

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.notzero]"
            :label="$t('fields.options.min_width') + ' *'"
            v-model="internalValue.min.width"
        />

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.notzero]"
            :label="$t('fields.options.min_height') + ' *'"
            v-model="internalValue.min.height"
        />

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.notzero]"
            :label="$t('fields.options.max_width') + ' *'"
            v-model="internalValue.max.width"
        />

        <v-text-field
            type="number"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.notzero]"
            :label="$t('fields.options.max_height') + ' *'"
            v-model="internalValue.max.height"
        />

        <div class="tw-w-full tw-flex tw-flex-row tw-items-start">
            <div class="tw-mr-20">
                <h2>{{ $t('fields.options.crop_format') }}</h2>
                <v-radio-group v-model="internalValue.lockedType" hide-details :inline="true" class="tw-flex tw-flex-row tw-col-span-2">
                    <v-radio :label="$t('fields.options.user_choice')" value="" class="tw-mr-4"></v-radio>
                    <v-radio :label="$t('fields.options.square')" value="square" class="tw-mr-4"></v-radio>
                    <v-radio :label="$t('fields.options.round')" value="round"></v-radio>
                </v-radio-group>
            </div>
            <div>
                <h2>{{ $t('fields.options.select_many') }}</h2>
                <v-radio-group v-model="internalValue.multi" hide-details :inline="true" class="tw-flex tw-flex-row tw-col-span-2">
                    <v-radio :label="$t('system.no')" :value="false" class="tw-mr-4"></v-radio>
                    <v-radio :label="$t('system.yes')" :value="true" class="tw-mr-4"></v-radio>
                </v-radio-group>
            </div>
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
    notzero: value => parseInt(value) > 0 || i18n.t('fields.errors.cannot_be_zero')
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
    name: props.field.config.name || '',
    min: {width: props.field.config.min?.width || 0, height: props.field.config.min?.width || 0},
    max: {width: props.field.config.max?.width || 0, height: props.field.config.max?.width || 0},
    ratio: props.field.config.ratio || 1.778, // default to 16:9
    lockedType: props.field.config.lockedType || '',
    multi: props.field.config.multi || false,
});

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);

    config.name = (v.name.trim() === '') ? props.field.key : v.name.trim();

    let minW = parseInt(v.min.width);
    let maxW = parseInt(v.max.width);
    let minH = parseInt(v.min.height);
    let maxH = parseInt(v.max.height);

    // Make sure max values are not lower than min values
    config.min = {width: parseInt(v.min.width), height: minH};
    config.max = {width: (maxW < minW) ? minW : maxW, height: (maxH < minH) ? minH : maxH};

    config.ratio = parseFloat(v.ratio);
    config.lockedType = v.lockedType;
    config.multi = v.multi;

    emitter('change', config);
});
</script>
