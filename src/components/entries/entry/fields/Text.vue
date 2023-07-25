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
                        <v-text-field
                            :bind="item"
                            :index="idx"
                            :id="index + '_' + idx"
                            variant="outlined"
                            color="primary"
                            density="comfortable"
                            :label="config.label[$i18n.locale] + ((config.required) ? ' *' : '')"
                            validate-on="blur"
                            :hide-details="true"
                            :rules="validationRules"
                            @keyup="updateInternalValue"
                        />
                    </template>
                </div>
                <v-btn @click.prevent="addElement" variant="flat" color="primary" class="tw-mt-4">{{ $t('system.add') }}</v-btn>
            </template>
        </div>
    </template>
    <template v-else>
        <v-text-field
            variant="outlined"
            color="primary"
            density="comfortable"
            :label="config.label[$i18n.locale] + ((config.required) ? ' *' : '')"
            validate-on="blur"
            :rules="validationRules"
            :hide-details="true"
            @input="$emit('update:modelValue', $event.target.value)"
        />
    </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, nextTick, ref, watch } from 'vue';
import phone from 'phone';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

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

const schema = Joi.object({
    email: Joi.string().email({minDomainSegments: 2, tlds: tlds}),
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
        return !result.error || i18n.t('entry.validation.id')
    },
    url: v =>
    {
        const result = schema.validate({url: v});
        return !result.error || i18n.t('entry.validation.url')
    },
    domain: v =>
    {
        const result = schema.validate({domain: v});
        console.log(result);
        return !result.error || i18n.t('entry.validation.domain')
    }
};

const validationRules = computed(() =>
{
    const activeRules = [];

    if (props.config.type === 'email') activeRules.push(rules.email);
    if (props.config.type === 'phone') activeRules.push(rules.phone);
    if (props.config.type === 'id') activeRules.push(rules.id);
    if (props.config.type === 'url') activeRules.push(rules.url);
    if (props.config.type === 'domain') activeRules.push(rules.domain);
    if (props.config.required) activeRules.push(rules.required);

    return activeRules;
});

// Add element to array
const addElement = () =>
{
    arrayValue.value.push('');

    nextTick(() =>
    {
        let id = props.index + '_' + (arrayValue.value.length - 1);
        document.getElementById(id).focus();
    });
}

// Update the array with the current value (vue3 does not allow v-model within a loop)
const updateInternalValue = (v) =>
{
    let [_, fieldIndex] = v.target.id.split('_');
    arrayValue.value[fieldIndex] = v.target.value;
}

// Report back any changes to the array
watch(arrayValue, (v) => emitter('update:modelValue', arrayValue), {deep: true});

</script>
