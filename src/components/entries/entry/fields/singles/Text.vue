<template>
    <v-text-field
        variant="outlined"
        color="primary"
        density="comfortable"
        :label="config.label[$i18n.locale] + ((config.required) ? ' *' : '')"
        validate-on="blur"
        :rules="validationRules"
        :hide-details="true"
        :model-value="value"
        @input="updateField"
    >
        <template v-if="showError">
            <div class="tw-absolute tw-right-3 tw-text-sm tw-text-red-500 tw-mt-0.5">
                {{ $t(errorMessage, errorData) }}
            </div>
        </template>
    </v-text-field>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';
import phone from 'phone';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const i18n = useI18n();

const props = defineProps({
    value: {
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

const emitter = defineEmits(['change']);

const showError = ref(false);
const errorMessage = ref('');
const errorData = ref({});

const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: tlds}}),
    id: Joi.string().min(24).max(24).pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    url: Joi.string().uri({scheme: ['http', 'https', 'git', 'git+https?', 'ssh', 'sftp', 'ftp'], allowQuerySquareBrackets: true, domain: {tlds: {allow: tlds}}}),
    domain: Joi.string().domain({tlds: {allow: tlds}}),
});

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required'),
    email: v =>
    {
        const result = schema.validate({email: v});
        return !result.error || i18n.t('entry.validation.email');
    },
    phone: v =>
    {
        const validated = phone(v, {
            country: props.config.config.country,
            validateMobilePrefix: false
        });

        // Valid, format it now
        if (props.type === 'phone' && validated.isValid) emitter('update:modelValue', validated.phoneNumber);
        return !!v && validated.isValid || i18n.t('entry.validation.phone');
    },
    id: v =>
    {
        const result = schema.validate({id: v});
        return !result.error || i18n.t('entry.validation.id');
    },
    url: v =>
    {
        const result = schema.validate({url: v});
        return !result.error || i18n.t('entry.validation.url');
    },
    domain: v =>
    {
        const result = schema.validate({domain: v});
        return !result.error || i18n.t('entry.validation.domain');
    },
    numeric: v =>
    {
        // Dynamic
        const schema = Joi.object({
            numeric: Joi.number().min(props.config.config.min).max(props.config.config.max)
        });

        const result = schema.validate({numeric: v});
        return handleNumericalErrors(result);
    },
    integer: v =>
    {
        // Dynamic
        const schema = Joi.object({
            numeric: Joi.number().integer().min(props.config.config.min).max(props.config.config.max)
        });

        const result = schema.validate({numeric: v});
        return handleNumericalErrors(result);
    },
    float: v =>
    {
        // Dynamic
        const schema = Joi.object({
            float: Joi.number().precision(2).min(props.config.config.min).max(props.config.config.max)
        });

        const result = schema.validate({float: v});

        if (!result.error) {
            const typedV = Number(v);
            const isFloat = typedV % 1 !== 0;

            if (props.config.repeatable) {

            } else {
                if (!isFloat) {
                    showError.value = true;
                    errorMessage.value = 'entry.validation.float';
                    errorData.value = {};
                    return i18n.t('entry.validation.float');
                }

                emitter('update:modelValue', result.value.float)
            }
        }

        return handleNumericalErrors(result);
    }
};

const handleNumericalErrors = (result) =>
{
    if (result.error) {
        console.log(result.error);

        switch (result.error.details[0].type)
        {
            case 'number.base':
                showError.value = false;
                errorMessage.value = 'entry.validation.type';
                errorData.value = {};
                return i18n.t('entry.validation.numeric');

            case 'number.min':
                showError.value = true;
                errorMessage.value = 'entry.validation.min';
                errorData.value = {min: props.config.config.min};
                return i18n.t('entry.validation.min');

            case 'number.max':
                showError.value = true;
                errorMessage.value = 'entry.validation.max';
                errorData.value = {max: props.config.config.max};
                return i18n.t('entry.validation.max');
        }
    } else {
        showError.value = false;
        return true;
    }
}

const validationRules = computed(() =>
{
    const activeRules = [];

    if (props.config.type === 'email') activeRules.push(rules.email);
    if (props.config.type === 'phone') activeRules.push(rules.phone);
    if (props.config.type === 'id') activeRules.push(rules.id);
    if (props.config.type === 'url') activeRules.push(rules.url);
    if (props.config.type === 'domain') activeRules.push(rules.domain);
    if (props.config.type === 'numeric') activeRules.push(rules.numeric);
    if (props.config.type === 'integer') activeRules.push(rules.integer);
    if (props.config.type === 'float') activeRules.push(rules.float);
    if (props.config.type === 'password') activeRules.push(rules.password);
    if (props.config.type === 'directory') activeRules.push(rules.directory);
    if (props.config.type === 'file') activeRules.push(rules.file);
    if (props.config.type === 'ip') activeRules.push(rules.ip);
    if (props.config.required) activeRules.push(rules.required);

    return activeRules;
});

const updateField = (e) => emitter('change', e.target.value);
</script>
