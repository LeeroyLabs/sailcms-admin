<template>
    <BackButton :url="{name: 'Settings'}"/>
    <p class="tw-text-sm tw-w-full md:tw-w-8/12 lg:tw-w-5/12 tw-mb-6">
        {{ $t('emails.test_explain') }}
    </p>

    <v-form ref="form" @submit.prevent="sendTest">
        <v-text-field
            variant="outlined"
            color="primary"
            density="comfortable"
            :label="$t('emails.email_address')"
            :rules="[rules.required, rules.email]"
            v-model="email"
            validate-on="blur"
            class="tw-w-12/12 md:tw-w-6/12 lg:tw-w-4/12"
        />

        <div class="tw-mt-4">
            <v-btn @click.prevent="sendTest" :loading="isLoading" variant="flat" color="primary">SEND</v-btn>
        </div>
    </v-form>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Misc } from '@/libs/graphql';
import BackButton from '@/components/globals/BackButton.vue';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const page = usePage();
page.setPageTitle('emails.test_title');

const i18n = useI18n();

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
    email: value => {
        const schema = Joi.object({
            email: Joi.string().email({minDomainSegments: 2, tlds: {allow: tlds}}),
        });

        const result = schema.validate({email: value});
        return !result.error || i18n.t('login.errors.invalid_email');
    }
};

const form = ref(null);
const email = ref('');
const isLoading = ref(false);

const sendTest = async () =>
{
    if (isLoading.value) return;

    const status = await form.value.validate();
    if (!status.valid) return;

    isLoading.value = true;
    await Misc.testEmail(email.value);
    isLoading.value = false;
}

</script>
