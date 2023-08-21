<template>
    <v-text-field
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
        autocomplete="new-password"
    >
        <template v-if="showError">
            <div class="tw-absolute tw-right-3 tw-text-sm tw-text-red-500 tw-mt-0.5">
                {{ $t(errorMessage, errorData) }}
            </div>
        </template>
        <template v-if="config.explain[$i18n.locale] !== '' && !multi">
            <div class="tw-absolute tw-right-0 tw-text-sm tw-top-[48px] tw-text-gray-400">
                {{ config.explain[$i18n.locale] }}
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

const showError = ref(false);
const errorMessage = ref('');
const errorData = ref({});

const fieldType = computed(() =>
{
    switch (props.config.type)
    {
        case 'password':
            return 'password';

        default:
            return 'text';
    }
});

const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: tlds}}),
    id: Joi.string().min(24).max(24).pattern(new RegExp('^[0-9a-fA-F]{24}$')),
    url: Joi.string().uri({scheme: ['http', 'https', 'git', 'git+https?', 'ssh', 'sftp', 'ftp'], allowQuerySquareBrackets: true, domain: {tlds: {allow: tlds}}}),
    domain: Joi.string().domain({tlds: {allow: tlds}}),
    ip: Joi.string().ip({version: ['ipv4', 'ipv6']}),
    year: Joi.number().min(1900).max(2500)
});

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required'),
    email: v =>
    {
        const result = schema.validate({email: v});

        if (result.error) {
            showError.value = true;
            errorMessage.value = 'entry.validation.email';
            errorData.value = {};
            return i18n.t('entry.validation.email');
        }

        showError.value = false;
        return true;
    },
    phone: v =>
    {
        const validated = phone(v, {
            country: props.config.config.country,
            validateMobilePrefix: false
        });

        // Valid, format it now
        if (props.type === 'phone' && validated.isValid) emitter('update:modelValue', validated.phoneNumber);

        if (!validated.isValid) {
            let msg = (props.config.config.country === 'all') ? 'entry.validation.phone' : 'entry.validation.phone_country';

            showError.value = true;
            errorMessage.value = msg;
            errorData.value = {country: i18n.t('countries.' + props.config.config.country)};
            return i18n.t(msg);
        }

        showError.value = false;
        return true;
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
    ip: v =>
    {
        const result = schema.validate({ip: v});
        return !result.error || i18n.t('entry.validation.ip');
    },
    domain: v =>
    {
        const result = schema.validate({domain: v});
        return !result.error || i18n.t('entry.validation.domain');
    },
    text: v =>
    {
        let max = (props.config.config.max === -1) ? 2_147_483_647 : props.config.config.max;

        const schema = Joi.object({
            text: Joi.string().min(props.config.config.min).max(max)
        });

        const result = schema.validate({text: v});
        return handleNumericalErrors(result, max);
    },
    password: v =>
    {
        let max = (props.config.config.max === -1) ? 50 : props.config.config.max;

        const schema = Joi.object({
            text: Joi.string().min(props.config.config.min).max(max)
        });

        const result = schema.validate({text: v});
        return handleNumericalErrors(result, max);
    },
    numeric: v =>
    {
        let max = (props.config.config.max === -1) ? 2_147_483_647 : props.config.config.max;

        const schema = Joi.object({
            numeric: Joi.number().min(props.config.config.min).max(max)
        });

        const result = schema.validate({numeric: v});
        return handleNumericalErrors(result, max);
    },
    integer: v =>
    {
        let max = (props.config.config.max === -1) ? 2_147_483_647 : props.config.config.max;

        const schema = Joi.object({
            numeric: Joi.number().integer().min(props.config.config.min).max(max)
        });

        const result = schema.validate({numeric: v});
        return handleNumericalErrors(result, max);
    },
    float: v =>
    {
        let max = (props.config.config.max === -1) ? 2_147_483_647 : props.config.config.max;

        const schema = Joi.object({
            float: Joi.number().precision(2).min(props.config.config.min).max(max)
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

                emitter('update:modelValue', result.value.float);
            }
        }

        return handleNumericalErrors(result, max);
    },
    year: v =>
    {
        const result = schema.validate({year: v});
        return handleNumericalErrors(result, 2500);
    },
    postal: v =>
    {
        showError.value = false;

        let isAvailable = postcodeValidatorExistsForCountry(props.config.config.country);
        let countryCode = (isAvailable) ? props.config.config.country : 'INTL';
        let valid = postcodeValidator(v, countryCode);

        if (valid) return true;

        showError.value = true;
        errorMessage.value = 'entry.validation.postal';
        errorData.value = {country: countryCode};
        return i18n.t('entry.validation.postal');
    }
};

const handleNumericalErrors = (result, max) =>
{
    if (result.error) {
        let locale = 'en-US';

        showError.value = true;

        switch (result.error.details[0].type)
        {
            case 'number.base':
                errorMessage.value = 'entry.validation.type';
                errorData.value = {};
                return i18n.t('entry.validation.numeric');

            case 'number.integer':
                errorMessage.value = 'entry.validation.integer';
                errorData.value = {};
                return i18n.t('entry.validation.integer');

            case 'string.min':
                errorMessage.value = 'entry.validation.str_min';
                errorData.value = {min: props.config.config.min};
                return i18n.t('entry.validation.str_min');

            case 'string.max':
                locale = (i18n.locale.value === 'fr') ? 'fr-CA' : 'en-US';
                errorMessage.value = 'entry.validation.str_max';
                errorData.value = {max: max.toLocaleString(locale)};
                return i18n.t('entry.validation.str_max');

            case 'number.min':
                errorMessage.value = 'entry.validation.min';
                errorData.value = {min: props.config.config.min};
                return i18n.t('entry.validation.min');

            case 'number.max':
                locale = (i18n.locale.value === 'fr') ? 'fr-CA' : 'en-US';
                errorMessage.value = 'entry.validation.max';
                errorData.value = {max: max.toLocaleString(locale)};
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
    if (props.config.type === 'ip') activeRules.push(rules.ip);
    if (props.config.type === 'text') activeRules.push(rules.text);
    if (props.config.type === 'postal') activeRules.push(rules.postal);
    if (props.config.type === 'year') activeRules.push(rules.year);
    if (props.config.required) activeRules.push(rules.required);

    return activeRules;
});

const updateField = (e) => emitter('change', e.target.value);
</script>
