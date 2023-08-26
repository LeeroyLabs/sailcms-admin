<template>
    <div>
        <div
            class="tw-border tw-rounded-md tw-p-4 t-pt-2"
            :class="{
                'tw-border-neutral-400': $vuetify.theme.name === 'light',
                'tw-border-neutral-500': $vuetify.theme.name === 'dark'
            }"
        >
            <h2 class="tw-text-lg tw-mb-4">{{ config.label[$i18n.locale]}}</h2>

            <template v-if="isReady">
                <template v-if="arrayValue.length === 0">
                    <div class="tw-flex tw-flex-col tw-items-center tw-gap-y-4">
                        <h3
                            class="tw-text-center tw-text-xl"
                            :class="{
                            'tw-text-neutral-400': $vuetify.theme.name === 'light',
                            'tw-text-neutral-500': $vuetify.theme.name === 'dark'
                        }"
                        >
                            {{ $t('system.no_items_now') }}
                        </h3>
                        <v-btn @click.prevent="addElement" variant="text" color="primary">{{ $t('system.add_item') }}</v-btn>
                    </div>
                </template>

                <template v-else>
                    <div class="tw-flex tw-flex-col tw-gap-y-4">
                        <template v-for="(item, idx) in arrayValue" :key="'text_' + type + '_' + idx">
                            <div class="tw-flex tw-flex-row tw-gap-x-4">
                                <Text
                                    :value="item"
                                    :id="'text_' + index + '_' + idx"
                                    :config="config"
                                    :multi="true"
                                    :type="type"
                                    :index="index"
                                    @change="(e) => arrayValue[idx] = e"
                                />
                                <v-btn @click.prevent="(e) => arrayValue.splice(idx, 1)" class="!tw-h-[48px]" variant="tonal" color="red"><v-icon icon="mdi-trash-can-outline" /></v-btn>
                            </div>
                        </template>
                    </div>
                    <v-btn @click.prevent="addElement" variant="flat" color="primary" class="tw-mt-4">{{ $t('system.add') }}</v-btn>
                </template>
            </template>
            <template v-else>
                <div class="tw-h-[140px] tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <v-progress-circular :size="60" :width="4" indeterminate/>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, nextTick, ref, watch } from 'vue';
import Text from "./singles/Text.vue";
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';

const i18n = useI18n();

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null, width: 'full'}
    },
    type: {
        type: String,
        default: 'text'
    },
    index: {
        type: Number,
        default: 0
    }
});

const emitter = defineEmits(['update:modelValue']);
const arrayValue = ref(props.modelValue || []);
const isReady = ref(false);
const fieldInfo = ref(null);

// Add element to array
const addElement = () =>
{
    arrayValue.value.push('');

    nextTick(() =>
    {
        let id = 'text_' + props.index + '_' + (arrayValue.value.length - 1);
        document.getElementById(id).focus();
    });
}

// Report back any changes to the array
watch(arrayValue, (v) => emitter('update:modelValue', arrayValue), {deep: true});

const loadInfo = async () =>
{
    console.log(props.config);
    fieldInfo.value = await Entries.fieldsForMatrix(props.config._id, SailCMS.getLocales());
}

// Fetch Field Info for matrix
loadInfo();
</script>
