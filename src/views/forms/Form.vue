<template>
    <div v-if="isReady">
        <BackButton :url="{ name: 'Forms' }" />
        <Teleport to="#actions">
            <v-btn color="primary" @click="createForm">
                {{ $t("form.save") }}
            </v-btn>
        </Teleport>

        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="9">
                        <div class="tw-h-[80vh] tw-flex tw-flex-col">
                            <TabBar
                                :tabs="[
                                    $t('forms.tabs.structure'),
                                    $t('forms.tabs.data'),
                                ]"
                                :active="tab"
                                @change="(e) => (tab = e)"
                            />

                            <div
                                v-if="tab === 0"
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
                                            class="tw-mb-2"
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
                                            :rules="[rules.required]"
                                            class="tw-mb-2"
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
                                v-else
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
                                        v-for="i in 3"
                                        :key="i"
                                        title="Item"
                                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                                    />
                                </v-expansion-panels>
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="3">
                        <v-card class="tw-p-4">
                            <v-radio-group
                                label="Radio group label"
                                v-model="formData.action"
                            >
                                <v-radio label="Mail" value="1"></v-radio>
                                <v-radio label="DB" value="2"></v-radio>
                                <v-radio label="Both" value="3"></v-radio>
                            </v-radio-group>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { Forms } from "@/libs/graphql/lib/forms";
import { SailCMS } from "@/libs/graphql";
import { onClickOutside } from "@vueuse/core";
import { deburr, kebabCase } from "lodash";

import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";

const i18n = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

// Form + validations
const form = ref(null);
const formData = ref({
    title: "",
    fields: [],
    action: "",
    settings: null,
});
const formHandle = computed(() => kebabCase(deburr(formData.value.title)));
const formEntries = ref([]);
const rules = {
    required: (value) => !!value || i18n.t("user.errors.required"),
};

const actionMode = ref("");
const showAddBox = ref(false);
const addbox = ref(null);

const fields = ref([]);
const usedFields = ref([]);
const tab = ref(0);

// Constants
const CREATE = "create";
const UPDATE = "update";

const loadFields = async () => {
    fields.value = await Entries.fields(SailCMS.getLocales());

    fields.value = fields.value.map((f) => {
        return {
            ...f,
            used: false,
        };
    });

    isReady.value = true;
};

const createForm = async () => {
    const status = await form.value.validate();
    if (!status.valid) return;

    const fields = usedFields.value.map((field) => field.key);
    const response = await Forms.createForm(
        formHandle.value,
        formData.value.title,
        fields,
        formData.value.settings
    );
    if (response) {
        console.log("RESPONSE", response);
        router.push({ name: "Forms" });
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
        formEntries.value = response;
    }
};

onClickOutside(addbox, (e) => (showAddBox.value = false));

if (route.params.id === "add") {
    actionMode.value = CREATE;
    loadFields();
} else {
    actionMode.value = UPDATE;
    loadFields();
    getFormEntries();
}
</script>

<style lang="scss" scoped></style>
