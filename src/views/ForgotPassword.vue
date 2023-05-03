<template>
    <v-card class="tw-w-11/12 sm:tw-w-8/12 lg:tw-w-6/12 xl:tw-w-4/12 tw-mx-auto !tw-p-8 tw-relative">
        <button
            @click.prevent="$i18n.locale=($i18n.locale === 'fr') ? 'en' : 'fr'"
            class="tw-absolute tw-text-gray-500 hover:tw-text-gray-800 tw-top-6 tw-right-8"
            v-html="($i18n.locale === 'en') ? 'FR' : 'EN'"
        >
        </button>

        <img
            class="tw-w-28 tw-max-w-28 tw-mb-6 tw-rounded-md tw-mx-auto"
            src="https://mir-s3-cdn-cf.behance.net/user/276/7530587.53f253b5e501a.jpg"
            alt=""
        />

        <div class="tw-flex tw-flex-col tw-gap-y-[10px]">
            <v-alert
                v-if="showBanner"
                icon="mdi-party-popper"
                :text="$t('forgot.success')"
                type="success"
                variant="tonal"
                class="tw-mb-4"
            ></v-alert>
            <v-form @keydown.enter="validateAndSubmit" ref="form" lazy-validation>
                <v-text-field
                    color="primary"
                    :label="$t('login.email')"
                    variant="outlined"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    validate-on="blur"
                    v-model="email"
                />
            </v-form>
        </div>
        <div class="tw-mt-4 tw-flex tw-flex-col tw-gap-y-3 tw-text-right">
            <v-btn :loading="isLoading" @click.prevent="validateAndSubmit" color="primary" size="x-large" block>
                <template v-slot:loader>
                    <v-progress-circular indeterminate/>
                </template>
                {{ $t('forgot.reset') }}
            </v-btn>
        </div>
    </v-card>
</template>

<script lang="ts" setup>

import { useI18n } from "vue-i18n";
import { EmailRule } from "@/libs/validation";
import { ref } from "vue";
import { Users } from "@/libs/graphql";

const i18n = useI18n();

const form = ref(null);
const email = ref('');
const showBanner = ref(false);
const isLoading = ref(false);

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
    email: value => {
        return EmailRule.test(value) || i18n.t('login.errors.invalid_email')
    }
};

const validateAndSubmit = async () =>
{
    if (isLoading.value) return;
    isLoading.value = true;

    const status = await form.value.validate();

    // Validation failed
    isLoading.value = false;
    if (!status) return;

    // Submit form
    await Users.forgotPassword(email.value);
    showBanner.value = true;
    email.value = '';
}
</script>
