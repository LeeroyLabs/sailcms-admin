<template>
    <div v-if="isReady">
        <BackButton :url="{ name: 'Forms' }" />
        <Teleport to="#actions">
            <v-btn color="primary" @click="createFormLayout">
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
                                            v-model="formInput.title"
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
                                            v-model="formInput.slug"
                                            :label="`${$t('form.form_slug')} *`"
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
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="3">
                        <v-card class="tw-p-4 tw-overflow-auto">
                            ACTIONS
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { Forms } from "@/libs/graphql/lib/forms";
import { SailCMS } from "@/libs/graphql";
import { onClickOutside } from "@vueuse/core";

import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";

const i18n = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

// Form + validations
const form = ref(null);
const formInput = ref({
    title: "",
    fields: [],
    slug: "",
});
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
            width: "full",
        };
    });

    isReady.value = true;
};

const createFormLayout = async () => {
    const status = await form.value.validate();
    if (!status.valid) return;

    const fields = usedFields.value.map((field) => {
        return { id: field._id, width: field.width };
    });
    const response = await Forms.createFormLayout(
        formInput.value.title,
        [
            {
                label: formInput.value.slug,
                fields: fields,
            },
        ],
        formInput.value.slug
    );
    if (response) {
        console.log("RESPONSE", response);
    }
};

onClickOutside(addbox, (e) => (showAddBox.value = false));

watch(usedFields, (value) => {
    console.log("FIELDS", value);
});

if (route.params.id === "add") {
    actionMode.value = CREATE;
    loadFields();
} else {
    actionMode.value = UPDATE;
    loadFields();
}
</script>

<style lang="scss" scoped></style>
