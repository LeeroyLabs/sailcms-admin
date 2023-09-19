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
                            class="md:tw-h-[80vh] md:tw-max-h-[80vh] tw-overflow-auto tw-flex tw-flex-col"
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
                                <div
                                    class="tw-flex tw-gap-4 tw-justify-center tw-mb-4"
                                >
                                    <span
                                        class="tw-cursor-pointer"
                                        :class="
                                            tabEntries === 0
                                                ? 'tw-opacity-100'
                                                : 'tw-opacity-50'
                                        "
                                        @click="tabEntries = 0"
                                    >
                                        {{ $t("form.new_entries") }}
                                    </span>
                                    <span
                                        class="tw-cursor-pointer"
                                        :class="
                                            tabEntries === 1
                                                ? 'tw-opacity-100'
                                                : 'tw-opacity-50'
                                        "
                                        @click="tabEntries = 1"
                                    >
                                        {{ $t("form.archives") }}
                                    </span>
                                </div>

                                <v-expansion-panels>
                                    <v-expansion-panel
                                        v-for="entry in filteredFormEntries"
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
                                    >
                                        <v-expansion-panel-text
                                            class="tw-relative tw-pr-[75px]"
                                        >
                                            <div
                                                class="tw-flex tw-gap-x-4 tw-gap-y-2 tw-justify-between tw-flex-wrap"
                                            >
                                                <template
                                                    v-for="content in entry.content"
                                                    :key="content.key"
                                                >
                                                    <span
                                                        class="tw-basis-2/5 md:tw-whitespace-nowrap"
                                                    >
                                                        {{ content.key }}:
                                                        {{ content.value }}
                                                    </span>
                                                </template>
                                            </div>

                                            <div
                                                class="tw-flex tw-gap-2 tw-absolute tw-top-[10px] tw-right-6"
                                            >
                                                <v-icon
                                                    v-if="!entry.viewed"
                                                    icon="mdi-eye-plus-outline"
                                                    size="small"
                                                    class="tw-cursor-pointer"
                                                    @click="
                                                        selectAction(
                                                            entry,
                                                            ARCHIVE
                                                        )
                                                    "
                                                />
                                                <v-icon
                                                    icon="mdi-trash-can-outline"
                                                    size="small"
                                                    class="tw-cursor-pointer hover:tw-text-red-500"
                                                    @click="
                                                        selectAction(
                                                            entry,
                                                            DELETE
                                                        )
                                                    "
                                                />
                                            </div>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>

                                    <span v-if="!filteredFormEntries.length">
                                        {{ $t("form.no_forms") }}
                                    </span>
                                </v-expansion-panels>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="3">
                        <v-card
                            class="md:tw-max-h-[80vh] tw-overflow-auto tw-p-4"
                        >
                            <v-radio-group
                                v-model="formData.action"
                                label="ACTIONS"
                                class="tw-pl-0"
                            >
                                <v-radio
                                    :label="$t('form.actions.mail')"
                                    :value="MAIL"
                                />
                                <v-radio
                                    :label="$t('form.actions.database')"
                                    :value="DATABASE"
                                />
                                <v-radio
                                    :label="$t('form.actions.both')"
                                    :value="BOTH"
                                />
                            </v-radio-group>

                            <v-form
                                ref="formActions"
                                autocomplete="off"
                                v-if="
                                    formData.action &&
                                    formData.action !== DATABASE
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

    <Transition>
        <DeleteConfirmation
            v-if="showDeleteConfirm"
            :show="true"
            :overall="true"
            :title="$t('users.confirm')"
            :loading="isProcessing"
            :message="modalMessage"
            @cancel="showDeleteConfirm = false"
            @accept="applyAction"
        />
    </Transition>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { Forms } from "@/libs/graphql/lib/forms";
import { SailCMS } from "@/libs/graphql";
import { deburr, kebabCase, capitalize } from "lodash";
import Joi from "joi";
import { tlds } from "@hapi/tlds";

import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";
import Loader from "@/components/globals/Loader.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const { t } = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

// Constants
const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";
const ARCHIVE = "archive";
const MAIL = "Mail";
const DATABASE = "Database";
const BOTH = "Both";

// Form + validations
const form = ref(null);
const formActions = ref(null);
const formData = ref({
    id: "",
    title: "",
    fields: [],
    action: MAIL,
});
const formHandle = computed(() => kebabCase(deburr(formData.value.title)));
const formEntries = ref([]);
const filteredFormEntries = computed(() =>
    formEntries.value.filter((f) =>
        tabEntries.value === 0 ? !f.viewed : f.viewed
    )
);
const selectedFormEntries = ref(null);

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
        value: "",
        validations: [rules.isEmail],
        hint: t("form.settings.cc_hint"),
    },
    bcc: {
        label: `${t("form.settings.bcc")} *`,
        value: "",
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
const tabEntries = ref(0);
const actionMode = ref("");
const pagination = ref();
const showDeleteConfirm = ref(false);
const isProcessing = ref(false);
const modalMessage = ref();

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

        formData.value.action = capitalize(responseGetForm.settings.action);
        Object.entries(formActionInputs.value).forEach((entry) => {
            if (entry[0] === "cc" || entry[0] === "bcc") {
                formActionInputs.value[entry[0]].value =
                    responseGetForm.settings[entry[0]].join(", ");
            } else {
                formActionInputs.value[entry[0]].value =
                    responseGetForm.settings[entry[0]];
            }
        });
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
        pagination.value = response.pagination;
    }
};

const createSettingsObject = () => {
    const settingsObject = {};
    Object.entries(formActionInputs.value).forEach((entry) => {
        if (entry[0] === "cc" || entry[0] === "bcc") {
            settingsObject[entry[0]] =
                formData.value.action !== DATABASE && entry[1].value.length
                    ? entry[1].value.split(",").map((email) => email.trim())
                    : [];
        } else {
            settingsObject[entry[0]] =
                formData.value.action !== DATABASE ? entry[1].value : "";
        }
    });
    settingsObject.action = formData.value.action.toUpperCase();
    return settingsObject;
};

const createForm = async () => {
    const status = await form.value.validate();
    if (formActions.value) {
        const statusActions = await formActions.value.validate();
        if (!statusActions.valid) return;
    }

    if (!status.valid) return;

    const fields = usedFields.value.map((field) => field.key);
    const settings = createSettingsObject();

    const response = await Forms.createForm(
        formHandle.value,
        formData.value.title,
        fields,
        settings
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
    const settings = createSettingsObject();

    const response = await Forms.updateForm(
        formData.value.id,
        formHandle.value,
        formData.value.title,
        fields,
        settings
    );
    if (response) {
        router.push({ name: "Forms" });
    }
};

const selectAction = (entry, action) => {
    selectedFormEntries.value = entry;
    actionMode.value = action;
    modalMessage.value =
        actionMode.value === ARCHIVE
            ? t("form.modal.archive_message")
            : t("form.modal.delete_message");
    showDeleteConfirm.value = true;
};

const applyAction = () => {
    switch (actionMode.value) {
        case CREATE:
            createForm();
            break;
        case UPDATE:
            updateForm();
            break;
        case ARCHIVE:
            viewedFormEntry();
            break;
        case DELETE:
            deleteFormEntry();
            break;
        default:
            return;
    }
};

const viewedFormEntry = async () => {
    const response = await Forms.viewedFormEntry(
        selectedFormEntries.value._id,
        formHandle.value
    );
    if (response) {
        getFormEntries();
        selectedFormEntries.value = null;
        actionMode.value = "";
        modalMessage.value = "";
        showDeleteConfirm.value = false;
    }
};

const deleteFormEntry = async () => {
    const response = await Forms.deleteFormEntry(
        [selectedFormEntries.value._id],
        formHandle.value
    );
    if (response) {
        getFormEntries();
        selectedFormEntries.value = null;
        actionMode.value = "";
        modalMessage.value = "";
        showDeleteConfirm.value = false;
    }
};

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
