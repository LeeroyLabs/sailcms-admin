<template>
    <div>
        <v-switch
            :hide-details="true"
            :true-value="true"
            :false-value="false"
            v-model="value"
            :label="config.label[$i18n.locale]"
            class="tw-float-left tw-clear-both"
        />
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
        default: null
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

const value = ref(props.modelValue);
if (value.value === '')value.value = false;

const emitter = defineEmits(['update:modelValue']);

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>
