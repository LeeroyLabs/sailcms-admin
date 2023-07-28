<template>
    <div>
        <v-textarea
            variant="outlined"
            color="primary"
            density="comfortable"
            :label="config.label[$i18n.locale] + ((config.required) ? ' *' : '')"
            :type="fieldType"
            validate-on="blur"
            :rules="validationRules"
            :hide-details="true"
            :model-value="value"
            @input="updateField"
            :max-rows="config.rows"
            no-resize
            autocomplete="new-password"
            @keydown="isAllowedMoreText"
        />

        <template v-if="config.explain[$i18n.locale] !== '' && !multi && config.config.max_chars <= 0">
            <div class="tw-mt-0.5 tw-text-right tw-text-gray-400">
                {{ config.explain[$i18n.locale] }}
            </div>
        </template>

        <template v-if="config.explain[$i18n.locale] !== '' && !multi && config.config.max_chars > 0">
            <div class="tw-mt-0.5 tw-flex tw-flex-row tw-justify-between">
                <div class="tw-text-sm">{{ textLength }} / {{ config.config.max_chars }}</div>
                <div class="tw-text-right tw-text-gray-400">
                    {{ config.explain[$i18n.locale] }}
                </div>
            </div>
        </template>

        <template v-if="config.explain[$i18n.locale] === '' && config.config.max_chars > 0">
            <div class="tw-mt-0.5 tw-flex tw-flex-row tw-justify-between">
                <div class="tw-text-sm">{{ textLength }} / {{ config.config.max_chars }}</div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import phone from 'phone';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';
import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';

const i18n = useI18n();

const props = defineProps({
    value: {
        default: null
    },
    multi: {
        type: Boolean,
        default: false
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

const emitter = defineEmits(['change']);

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required'),
};

const textLength = computed(() => [...props.value].length);

const validationRules = computed(() =>
{
    const activeRules = [];

    if (props.config.required) activeRules.push(rules.required);

    return activeRules;
});

const isAllowedMoreText = (e) =>
{
    const length = [...e.target.value].length;

    if (length < props.config.config.max_chars) {
        return true;
    }

    emitter('change', e.target.value.substring(0, props.config.config.max_chars - 1));
    return false;
}

const updateField = (e) => emitter('change', e.target.value);
</script>
