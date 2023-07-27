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
                    <template v-for="(item, idx) in arrayValue">
                        <div class="">
                            <v-text-field
                                v-model="arrayValue[idx]"
                                :id="index + '_' + idx"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                :readonly="true"
                                :hide-details="true"
                                validate-on="blur"
                                :rules="validationRules"
                            >
                                <ColorPicker
                                    v-model="arrayValue[idx]"
                                    :bind="item"
                                    :key="index + '_' + idx"
                                    format="hex8"
                                    shape="square"
                                    picker-type="fk"
                                    round-history
                                    lang="En"
                                    @pureColorChange="(e) => arrayValue[idx] = e"
                                />
                            </v-text-field>
                        </div>
                    </template>
                </div>
                <v-btn @click.prevent="addElement" variant="flat" color="primary" class="tw-mt-4">{{ $t('system.add') }}</v-btn>
            </template>
        </div>
    </template>
    <template v-else>
        <v-text-field
            v-model="pureColor"
            :id="index + '_0'"
            variant="outlined"
            color="primary"
            density="comfortable"
            :readonly="true"
            :hide-details="true"
            validate-on="blur"
            :rules="validationRules"
        >
            <ColorPicker
                v-model:pure-color="pureColor"
                :key="index + '_0'"
                format="hex8"
                shape="square"
                picker-type="fk"
                round-history
                lang="En"
            />
            <template v-if="config.explain[$i18n.locale] !== '' && !multi">
                <div class="tw-absolute tw-right-0 tw-text-sm tw-top-[48px]">
                    {{ config.explain[$i18n.locale] }}
                </div>
            </template>
        </v-text-field>
    </template>
</template>

<script setup>
import { ColorPicker } from 'vue3-colorpicker';
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

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
const pureColor = ref(props.modelValue);
const arrayValue = ref([]);

watch(arrayValue.value, (v) => emitter('update:modelValue', arrayValue.value));
watch(pureColor, (v) => emitter('update:modelValue', pureColor.value));
watch(props.modelValue, (v) => pureColor.value = v);

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required')
}

const validationRules = computed(() =>
{
    if (props.config.required) return [rules.required];
    return [];
});

// Add element to array
const addElement = () => arrayValue.value.push('');

</script>
