<template>
    <div>
        <template v-if="config.repeatable">
            <Multiselect
                :value="value"
                :config="config"
                :isCountry="true"
                :countries="countryList"
                @change="(e) => value = e"
            />
        </template>
        <template v-else>
            <div>
                <v-select
                    :hide-details="true"
                    :label="config.label[$i18n.locale]"
                    v-model="value"
                    color="primary"
                    :items="countryList"
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
import { Countries } from '@/libs/countries';

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


const countryList = computed(() =>
{
    let list = [];

    for (let country of Countries) {
        list.push({value: country, title: i18n.t('countries.' + country)});
    }

    return list;
});

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>
