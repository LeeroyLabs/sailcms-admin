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
            <v-form @keydown.enter="validateAndSubmit" ref="form" lazy-validation>
                <v-text-field
                    color="primary"
                    :label="$t('login.email')"
                    variant="outlined"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    validate-on="blur"
                    v-model="email"
                    density="comfortable"
                />

                <v-text-field
                    color="primary"
                    class="tw-mt-2.5"
                    :append-inner-icon="showPassword ? 'mdi-eye' : (showIcon) ? 'mdi-eye-off' : ''"
                    :type="showPassword ? 'text' : 'password'"
                    :label="$t('login.password')"
                    variant="outlined"
                    type="password"
                    :rules="[rules.required]"
                    validate-on="blur"
                    density="comfortable"
                    @focus="showIcon = true"
                    @blur="showIcon = false"
                    @click:append-inner="showPassword = !showPassword"
                    v-model="password"
                />
            </v-form>
        </div>
        <div class="tw-mt-4 tw-flex tw-flex-col tw-gap-y-3 tw-text-right">
            <v-btn :loading="isLoading" @click.prevent="validateAndSubmit" color="primary" size="x-large" block>
                <template v-slot:loader>
                    <v-progress-circular indeterminate/>
                </template>
                {{ $t('login.sign_in') }}
            </v-btn>
            <div>
                <router-link to="/forgot-password" class="tw-text-sm tw-text-secondary hover:tw-underline tw-inline">
                    {{ $t('login.forgot') }}
                </router-link>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { EmailRule } from "@/libs/validation";
import { ref } from "vue";
import { SailCMS, Users } from "@/libs/graphql";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";

const i18n = useI18n();

const showPassword = ref(false);
const showIcon = ref(false);
const form = ref(null);
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const appStore = useAppStore();
const router = useRouter();

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
    email: value => {
        return EmailRule.test(value) || i18n.t('login.errors.invalid_email')
    }
};

const validateAndSubmit = async () =>
{
    if (isLoading.value) return;

    const status = await form.value.validate();

    // Validation failed
    if (!status) return;

    isLoading.value = true;

    // Submit form
    let login = await Users.authenticate(email.value, password.value);

    if (login.message !== 'error') {
        let user = await Users.getFromAuthentication(login.message);

        if (user) {
            appStore.setCurrentUser(user);
            appStore.setLoginState(true);
            localStorage.setItem(import.meta.env.VITE_SAILCMS_TOKEN, user.auth_token);
            isLoading.value = false;

            window.location.href = appStore.baseURL + '/dashboard';
            return;
        }
    } else {
        appStore.displayToast('error', i18n.t('login.errors.bad_credentials'));
    }

    isLoading.value = false;
}
</script>
