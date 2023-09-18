<template>
    <div v-if="isReady">
        <BackButton :url="{ name: 'Forms' }" />
        <Teleport to="#actions">
            <v-btn color="primary" @click="applyAction">
                {{
                    actionMode === CREATE ? $t("form.save") : $t("form.update")
                }}
            </v-btn>
        </Teleport>

        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="9">
                        <div
                            class="tw-h-[80vh] tw-max-h-[80vh] tw-overflow-auto tw-flex tw-flex-col"
                        >
                            <TabBar
                                :tabs="[
                                    $t('forms.tabs.structure'),
                                    $t('forms.tabs.data'),
                                ]"
                                :active="tab"
                                @change="(e) => (tab = e)"
                            />

                            <div
                                v-show="tab === 0"
                                class="tw-flex-grow tw-p-6 tw-rounded-b"
                                :class="{
                                    'tw-bg-white':
                                        $vuetify.theme.name === 'light',
                                    'tw-bg-darkbg':
                                        $vuetify.theme.name === 'dark',
                                }"
                            >
                                <v-form ref="form" autocomplete="off">
                                    <div class="tw-flex tw-gap-x-6 tw-gap-y-2">
                                        <v-text-field
                                            v-model="formData.title"
                                            :label="`${$t(
                                                'form.form_title'
                                            )} *`"
                                            variant="outlined"
                                            color="primary"
                                            density="comfortable"
                                            :rules="[rules.required]"
                                            class="tw-mb-2 tw-w-2/4"
                                            :class="{
                                                'tw-bg-white':
                                                    $vuetify.theme.name ===
                                                    'light',
                                                'tw-bg-darkbg':
                                                    $vuetify.theme.name ===
                                                    'dark',
                                            }"
                                        />
                                        <v-text-field
                                            v-model="formHandle"
                                            :label="`${$t(
                                                'form.form_handle'
                                            )} *`"
                                            disabled
                                            variant="outlined"
                                            color="primary"
                                            density="comfortable"
                                            class="tw-mb-2 tw-w-2/4"
                                            :class="{
                                                'tw-bg-white':
                                                    $vuetify.theme.name ===
                                                    'light',
                                                'tw-bg-darkbg':
                                                    $vuetify.theme.name ===
                                                    'dark',
                                            }"
                                        />
                                    </div>
                                </v-form>

                                <FieldSelector
                                    v-model:usedFields="usedFields"
                                    :tab="tab"
                                    :fields="fields"
                                />
                            </div>

                            <div
                                v-show="tab === 1"
                                class="tw-flex-grow tw-p-6 tw-rounded-b"
                                :class="{
                                    'tw-bg-white':
                                        $vuetify.theme.name === 'light',
                                    'tw-bg-darkbg':
                                        $vuetify.theme.name === 'dark',
                                }"
                            >
                                <v-expansion-panels>
                                    <v-expansion-panel
                                        v-for="entry in formEntries"
                                        :key="entry"
                                        :title="
                                            new Date(
                                                entry.dates.created * 1000
                                            ).toLocaleString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                            })
                                        "
                                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                                    >
                                    </v-expansion-panel>
                                    <span v-if="!formEntries.length">
                                        {{ $t("form.no_forms") }}
                                    </span>
                                </v-expansion-panels>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="3">
                        <v-card class="tw-max-h-[80vh] tw-overflow-auto tw-p-4">
                            <v-radio-group
                                v-model="formData.action"
                                label="ACTIONS"
                                class="tw-pl-0"
                            >
                                <v-radio label="Mail" value="1"></v-radio>
                                <v-radio label="DB" value="2"></v-radio>
                                <v-radio label="Both" value="3"></v-radio>
                            </v-radio-group>

                            <v-form
                                ref="formActions"
                                autocomplete="off"
                                v-if="
                                    formData.action && formData.action !== '2'
                                "
                            >
                                <v-text-field
                                    v-for="action in formActionInputs"
                                    v-model="action.value"
                                    :label="action.label"
                                    variant="outlined"
                                    color="primary"
                                    density="comfortable"
                                    :hint="action.hint"
                                    :rules="action.validations"
                                    class="tw-mb-2"
                                    :class="{
                                        'tw-bg-white':
                                            $vuetify.theme.name === 'light',
                                        'tw-bg-darkbg':
                                            $vuetify.theme.name === 'dark',
                                    }"
                                />
                            </v-form>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { Forms } from "@/libs/graphql/lib/forms";
import { SailCMS } from "@/libs/graphql";
import { onClickOutside } from "@vueuse/core";
import { deburr, kebabCase } from "lodash";
import Joi from "joi";
import { tlds } from "@hapi/tlds";

import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";
import Loader from "@/components/globals/Loader.vue";

const i18n = useI18n();
const { t } = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

// Form + validations
const form = ref(null);
const formActions = ref(null);
const formData = ref({
    id: "",
    title: "",
    fields: [],
    action: "",
    settings: null,
});
const formHandle = computed(() => kebabCase(deburr(formData.value.title)));
const formEntries = ref([]);

const schema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: tlds } }),
});
const rules = {
    required: (value) =>
        (!!value && !!value.length) || t("user.errors.required"),
    isEmail: (value) => {
        if (!value || !value.length) return;
        const emails = value.split(",").map((email) => email.trim());
        const validatedEmails = emails.map((email) => {
            const result = schema.validate({ email: email });
            return !result.error ? true : false;
        });
        return !validatedEmails.includes(false) || t("user.errors.email");
    },
};
const formActionInputs = ref({
    to: {
        label: `${t("form.settings.to")} *`,
        value: "",
        validations: [rules.required, rules.isEmail],
        hint: "",
    },
    cc: {
        label: `${t("form.settings.cc")} *`,
        value: [],
        validations: [rules.isEmail],
        hint: t("form.settings.cc_hint"),
    },
    bcc: {
        label: `${t("form.settings.bcc")} *`,
        value: [],
        validations: [rules.isEmail],
        hint: t("form.settings.cc_hint"),
    },
    success_email_handle: {
        label: t("form.settings.success_email_handle"),
        value: "",
        validations: [],
        hint: "",
    },
    entry_title: {
        label: t("form.settings.entry_title"),
        value: "",
        validations: [],
        hint: "",
    },
});

const fields = ref([]);
const usedFields = ref([]);

const tab = ref(0);
const actionMode = ref("");
const showAddBox = ref(false);
const addbox = ref(null);
const pagination = ref();

// Constants
const CREATE = "create";
const UPDATE = "update";

const loadFields = async () => {
    fields.value = await Entries.fields(SailCMS.getLocales());
};

const getForm = async (handle) => {
    const responseGetForm = await Forms.getForm(handle);
    if (responseGetForm) {
        formData.value.title = responseGetForm.title;
        formData.value.id = responseGetForm._id;
        usedFields.value = fields.value.filter((field) =>
            responseGetForm.fields.includes(field.key)
        );
        getFormEntries();
        isReady.value = true;
    }
};

const currentPage = ref(1);
const currentLimit = ref(100);
const currentSearch = ref("");
const currentSorting = ref("");
const currentOrder = ref("ASC");

const getFormEntries = async () => {
    const response = await Forms.getFormEntries(
        formHandle.value,
        currentPage.value,
        currentLimit.value,
        { date: Math.round(Date.now() / 1000), operator: "BEFORE" },
        currentSearch.value,
        currentSorting.value,
        currentOrder.value
    );
    if (response) {
        formEntries.value = response.list;
        formEntries.value = formEntries.value.map((entry) => {
            return {
                ...entry,
                content: entry.content.reduce((accumulator, currentItem) => {
                    const groupKey = currentItem.key;
                    accumulator[groupKey] = !accumulator[groupKey]
                        ? {}
                        : accumulator[groupKey];
                    accumulator[groupKey] = currentItem.value;
                    return accumulator;
                }, {}),
            };
        });
        pagination.value = response.pagination;
        console.log("ENTRIES", formEntries.value);
    }
};

const createForm = async () => {
    const status = await form.value.validate();
    if (formActions.value) {
        const statusActions = await formActions.value.validate();
        if (!statusActions.valid) return;
    }

    if (!status.valid) return;

    const fields = usedFields.value.map((field) => field.key);

    const settingsObject = {};
    if (formData.value.action && formData.value.action !== "2") {
        Object.entries(formActionInputs.value).forEach((entry) => {
            if (entry[0] === "cc" || entry[0] === "bcc") {
                settingsObject[entry[0]] = entry[1].value.length
                    ? entry[1].value.split(",").map((email) => email.trim())
                    : [];
            } else {
                settingsObject[entry[0]] = entry[1].value;
            }
        });
    }

    const response = await Forms.createForm(
        formHandle.value,
        formData.value.title,
        fields,
        formData.value.action && formData.value.action !== "2"
            ? settingsObject
            : null
    );
    if (response) {
        router.push({ name: "Forms" });
    }
};

const updateForm = async () => {
    const status = await form.value.validate();
    if (formActions.value) {
        const statusActions = await formActions.value.validate();
        if (!statusActions.valid) return;
    }

    if (!status.valid) return;

    const fields = usedFields.value.map((field) => field.key);
    const response = await Forms.updateForm(
        formData.value.id,
        formHandle.value,
        formData.value.title,
        fields,
        formData.value.settings
    );
    if (response) {
        router.push({ name: "Forms" });
    }
};

const applyAction = () => {
    return actionMode.value === CREATE ? createForm() : updateForm();
};

onClickOutside(addbox, (e) => (showAddBox.value = false));

if (route.params.id === "add") {
    actionMode.value = CREATE;
    try {
        loadFields().then((result) => {
            isReady.value = true;
        });
    } catch (error) {
        console.log(error);
    }
} else {
    actionMode.value = UPDATE;
    try {
        loadFields().then((result) => {
            getForm(route.params.id);
        });
    } catch (error) {
        console.log(error);
    }
}
</script>

<style lang="scss" scoped></style>
