<template>
    <div class="tw-flex tw-flex-col">
        <h2 class="tw-font-medium tw-mb-0.5">{{ config.label[$i18n.locale] }}</h2>
        <div class="tw-grid tw-grid-cols-5 tw-gap-2">
            <template v-for="(choice, idx) in config.config.choices">
                <v-checkbox
                    v-model="value"
                    :label="choice.title"
                    color="primary"
                    :value="choice.value"
                    hide-details
                    :rules="[rules.required]"
                ></v-checkbox>
            </template>
        </div>
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
        default: []
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

const value = ref(props.modelValue || []);

const emitter = defineEmits(['update:modelValue']);
const rules = {
    required: value => value.length > 0 || i18n.t('user.errors.required'),
};

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>
