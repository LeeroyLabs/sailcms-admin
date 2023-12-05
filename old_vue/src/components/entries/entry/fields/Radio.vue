<template>
    <div class="tw-flex tw-flex-col">
        <h2 class="tw-font-medium tw-mb-0.5">{{ config.label[$i18n.locale] }}</h2>
        <v-radio-group inline density="comfortable" v-model="value">
            <template v-for="(choice, idx) in config.config.choices">
                <v-radio
                    :label="choice.title"
                    color="primary"
                    :value="choice.value"
                ></v-radio>
            </template>
        </v-radio-group>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import Multiselect from '@/components/entries/entry/fields/singles/Multiselect.vue';
import { Countries } from '@/libs/countries';

const i18n = useI18n();

const props = defineProps({
    modelValue: {
        default: ''
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null}
    },
    index: {
        type: Number,
        default: 0
    }
});

const value = ref(props.modelValue || props.config.config.choices[0].value);
const emitter = defineEmits(['update:modelValue']);

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>

<style>
.v-selection-control-group--inline {
    @apply tw-gap-x-4;
}
</style>
