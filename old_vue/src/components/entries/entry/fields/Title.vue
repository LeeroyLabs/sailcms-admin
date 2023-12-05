<template>
    <v-text-field
        variant="outlined"
        color="primary"
        density="comfortable"
        :label="$t('entry.title') + ' *'"
        validate-on="blur"
        :hide-details="true"
        :rules="[rules.required]"
        @input="$emit('update:modelValue', $event.target.value)"
    />
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

defineEmits(['update:modelValue']);

const rules = {
    required: value => !!value && value.trim() !== '' || i18n.t('user.errors.required')
};
</script>
