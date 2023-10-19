<template>
    <BackButton :url="{ name: 'Seo' }" />
    <div
        v-if="isReady"
        class="tw-p-6 tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12 tw-ml-0"
    >
        <div class="tw-mx-3 tw-flex tw-flex-col md:tw-flex-row">
            <v-form ref="redirectionForm" class="tw-flex-grow">
                <div class="md:tw-ml-6 tw-mt-6 md:tw-mt-0">
                    <div
                        class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0"
                    >
                        <v-text-field
                            v-model="newRedirection.url"
                            :label="$t('seoRedirection.url')"
                            type="text"
                            color="primary"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.required]"
                            validate-on="blur"
                        />
                        <v-text-field
                            v-model="newRedirection.redirectUrl"
                            :label="$t('seoRedirection.redirect_url')"
                            type="text"
                            color="primary"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.required]"
                            validate-on="blur"
                        />
                    </div>

                    <div
                        class="tw-flex tw-flex-col md:tw-flex-row tw-gap-x-4 tw-mb-4 tw-gap-y-4 md:tw-gap-y-0"
                    >
                        <v-select
                            v-model="newRedirection.redirectType"
                            :label="$t('seoRedirection.redirect_type')"
                            :placeholder="$t('user.roles')"
                            color="primary"
                            :items="[
                                {
                                    label: $t('seoRedirection.permanent'),
                                    value: RedirectType.PERMANENT,
                                },
                                {
                                    label: $t('seoRedirection.temporary'),
                                    value: RedirectType.TEMPORARY,
                                },
                            ]"
                            item-title="label"
                            item-value="value"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.atLeastOne]"
                            validate-on="blur"
                        />
                    </div>
                </div>
                <div class="tw-ml-6 tw-gap-x-3 tw-flex">
                    <v-btn
                        :loading="isLoading"
                        @click.prevent="applyAction"
                        color="primary"
                    >
                        <template v-if="isAdding">
                            {{ $t("user.add") }}
                        </template>
                        <template v-else>
                            {{ $t("user.save") }}
                        </template>
                    </v-btn>

                    <v-btn
                        flat
                        @click.prevent="$router.push({ name: 'Seo' })"
                        color="text"
                    >
                        {{ $t("user.cancel") }}
                    </v-btn>
                </div>
            </v-form>
        </div>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { Seo } from "@/libs/graphql/lib/seo.ts";
import { RedirectType } from "@/libs/graphql/types/seo";

import BackButton from "@/components/globals/BackButton.vue";
import Loader from "@/components/globals/Loader.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const isReady = ref(false);
const isLoading = ref(false);

const rules = {
    required: (value) => !!value || t("user.errors.required"),
    atLeastOne: (value) =>
        (value && value.length > 0) || t("user.errors.at_least_one"),
};

// template ref
const redirectionForm = ref(null);

// Constants
const CREATE = "create";
const UPDATE = "update";

const actionMode = ref(CREATE);
const newRedirection = ref({
    url: "",
    redirectUrl: "",
    redirectType: null,
});

const getRedirection = async (id) => {
    const response = await Seo.getRedirection(id);
    if (response) {
        newRedirection.value.url = response.url;
        newRedirection.value.redirectUrl = response.redirect_url;
        newRedirection.value.redirectType = response.redirect_type;
        isReady.value = true;
    }
};

const createRedirection = async () => {
    const status = await redirectionForm.value.validate();
    if (!status.valid) return;

    const response = await Seo.createRedirection(
        newRedirection.value.url,
        newRedirection.value.redirectUrl,
        newRedirection.value.redirectType
    );
    if (response) router.push({ name: "Seo" });
};

const updateRedirection = async (id) => {
    const response = await Seo.updateRedirection(
        id,
        newRedirection.value.url,
        newRedirection.value.redirectUrl,
        newRedirection.value.redirectType
    );
    if (response) {
        if (response) router.push({ name: "Seo" });
    }
};

const applyAction = () =>
    actionMode.value === CREATE
        ? createRedirection()
        : updateRedirection(route.params.id);

if (route.params.id === "add") {
    isReady.value = true;
    actionMode.value = CREATE;
} else {
    actionMode.value = UPDATE;
    getRedirection(route.params.id);
}
</script>

<style lang="scss" scoped></style>
