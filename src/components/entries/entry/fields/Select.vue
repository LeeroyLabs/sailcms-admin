<template>
    <div>
        <template v-if="config.config.multi">
            <div>
                <Multiselect
                    :value="value"
                    :config="config"
                    @change="(e) => value = e"
                />
            </div>
        </template>
        <template v-else>
            <div>
                <v-select
                    :label="config.label[$i18n.locale]"
                    :hide-details="true"
                    v-model="value"
                    color="primary"
                    :items="config.config.choices"
                    variant="outlined"
                    density="comfortable"
                    :persistent-hint="false"
                    class="tw-w-full"
                />
                <small
                    v-if="config.explain[$i18n.locale] !== ''"
                    class="tw-w-full tw-mt-0.5 tw-flex tw-justify-end"
                    :class="{'tw-text-neutral-400': $vuetify.theme.name === 'dark', 'tw-text-gray-500': $vuetify.theme.name === 'light'}"
                >
                    {{ config.explain[$i18n.locale] }}
                </small>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref, watch } from 'vue';
import Multiselect from '@/components/entries/entry/fields/singles/Multiselect.vue';

const i18n = useI18n();

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null, width: 'full'}
    },
    index: {
        type: Number,
        default: 0
    }
});

const value = ref(props.modelValue);

if (value.value === '' || value.value.length === 0) {
    if (props.config.config.multi) {
        value.value = [];
    } else {
        value.value = null;
    }
}

const emitter = defineEmits(['update:modelValue']);

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>
