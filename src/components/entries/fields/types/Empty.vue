<template>
    <!-- no options -->
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

const runBasic = (v) =>
{
    const config = cloneDeep(props.field.config);
    config._v = 0;
    emitter('change', config);
}

runBasic(null);
</script>
