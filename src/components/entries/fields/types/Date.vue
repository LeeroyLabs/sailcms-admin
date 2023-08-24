<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <v-text-field
            v-if="showDate.includes(type.value)"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.date_format') + ' *'"
            v-model="internalValue.date_format"
        />

        <v-text-field
            v-if="showTime.includes(type.value)"
            variant="outlined"
            color="primary"
            density="comfortable"
            :rules="[rules.required]"
            :label="$t('fields.options.time_format') + ' *'"
            v-model="internalValue.time_format"
        />

        <small class="tw-col-span-2 tw-mt-[-15px]">
<!--            // TODO: FIX THIS-->
            TODO: SET TO POINT TO DOCUMENTATION + TRANSLATE
            for compatible formats please visit:
            <a class="tw-text-primary hover:tw-underline" target="_blank" href="https://date-fns.org/v2.30.0/docs/format">
                https://date-fns.org/v2.30.0/docs/format
            </a>
        </small>

        <div class="tw-col-span-2 tw-mt-[-10px]">
            <div class="tw-flex tw-flex-row tw-gap-x-6">
                <v-switch
                    v-model="internalValue.range"
                    :label="$t('fields.options.range')"
                    color="primary"
                    :value="true"
                    hide-details
                    class="tw-flex-grow"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onBeforeMount } from 'vue';
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

const showTime = ref(['datetime', 'time', 'datetimerange', 'timerange']);
const showDate = ref(['date', 'datetime', 'daterange', 'datetimerange']);
const emitter = defineEmits(['change']);
const internalValue = ref(null);

const handleValueSetting = (v) =>
{
    const config = cloneDeep(props.field.config);

    switch (props.type.value)
    {
        case 'date':
            config.date_format = internalValue.value.date_format;
            config.range = internalValue.value.range;
            break;

        case 'datetime':
            config.date_format = internalValue.value.date_format;
            config.time_format = internalValue.value.time_format;
            config.range = internalValue.value.range;
            break;

        case 'time':
            config.time_format = internalValue.value.time_format;
            config.range = internalValue.value.range;
            break;
    }

    emitter('change', config);
}

onBeforeMount(() =>
{
    switch (props.type.value)
    {
        case 'date':
            internalValue.value = {
                date_format: props.field.config.date_format || 'd-M-Y',
                range: props.field.config.range || false
            }

            handleValueSetting('');
            break;

        case 'datetime':
            internalValue.value = {
                date_format: props.field.config.date_format || 'd-M-Y',
                time_format: props.field.config.time_format || 'H:m:s',
                range: props.field.config.range || false
            }

            handleValueSetting('');
            break;

        case 'time':
            internalValue.value = {
                time_format: props.field.config.time_format || 'H:m:s',
                range: props.field.config.range || false
            }

            handleValueSetting('');
            break;
    }

    watch(internalValue.value, handleValueSetting);
    watch(internalValue.value.range, handleValueSetting);
});
</script>
