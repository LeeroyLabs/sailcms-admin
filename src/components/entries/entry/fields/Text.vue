<template>
    <template v-if="config.repeatable">
        <div
            class="tw-border tw-rounded-md tw-p-4 t-pt-2"
            :class="{
                'tw-border-neutral-400': $vuetify.theme.name === 'light',
                'tw-border-neutral-500': $vuetify.theme.name === 'dark'
            }"
        >
            <h2 class="tw-text-lg tw-mb-4">{{ config.config.repeatable_title[$i18n.locale]}}</h2>

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
                        <Text
                            :value="item"
                            :id="'text_' + index + '_' + idx"
                            :config="config"
                            :multi="true"
                            :type="type"
                            :index="index"
                            @change="(e) => arrayValue[idx] = e"
                        />
                    </template>
                </div>
                <v-btn @click.prevent="addElement" variant="flat" color="primary" class="tw-mt-4">{{ $t('system.add') }}</v-btn>
            </template>
        </div>
    </template>
    <template v-else>
        <Text
            :value="modelValue"
            :config="config"
            :type="type"
            :index="index"
            :key="'text_' + type + '_' + index"
            @change="(e) => $emit('update:modelValue', e)"
            :class="{'tw-mb-4': config.explain[$i18n.locale] !== ''}"
        />
    </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { nextTick, ref, watch } from 'vue';
import Text from "./singles/Text.vue";

const i18n = useI18n();

const arrayValue = ref([]);

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null}
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
</script>
