<template>
    <div>
        <template v-if="config.config.multi">
            <div>
                <Multiselect
                    :value="value"
                    :config="config"
                    :choices="choices"
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
                    :items="choices"
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
import { computed, onMounted, ref, watch } from 'vue';
import Multiselect from '@/components/entries/entry/fields/singles/Multiselect.vue';
import { useAppStore } from '@/store/app';
import { Entries } from '@/libs/graphql/lib/entries';

const i18n = useI18n();
const store = useAppStore();

const choices = ref([]);

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', explain: '', required: false, repeatable: false, config: {choices: []}, width: 'full'}
    },
    index: {
        type: Number,
        default: 0
    },
    locale: {
        type: String,
        default: 'en'
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

onMounted(async () =>
{
    const entryList = await Entries.entriesForListing(props.locale, props.config.config.type);
    choices.value = entryList.map(e => {
        return {value: e._id, title: e.title};
    });
});

// Report back any changes to the array
watch(value, (v) => emitter('update:modelValue', value), {deep: true});
</script>
