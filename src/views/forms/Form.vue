<template>
    <div v-if="isReady">
        <BackButton :url="{ name: 'Forms' }" />
        <Teleport to="#actions">
            <v-btn color="primary" @click="() => console.log('SAVE')">
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
                                <v-form autocomplete="off">
                                    <v-text-field
                                        v-model="formInput.name"
                                        :label="$t('forms.form_title')"
                                        variant="outlined"
                                        color="primary"
                                        :hide-details="true"
                                        density="comfortable"
                                        :rules="[rules.required]"
                                        class="tw-mb-2"
                                        :class="{
                                            'tw-bg-white':
                                                $vuetify.theme.name === 'light',
                                            'tw-bg-darkbg':
                                                $vuetify.theme.name === 'dark',
                                        }"
                                    />
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
import { ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { SailCMS } from "@/libs/graphql";
import { v4 } from "uuid";
import { onClickOutside } from "@vueuse/core";

import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";

const i18n = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

// Form + validations
const formInput = ref({
    name: "",
});
const rules = {
    required: (value) => !!value || i18n.t("user.errors.required"),
};

const actionMode = ref("");
const showAddBox = ref(false);
const addbox = ref(null);
const offsetBox = ref(false);

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

    nextTick(() => {
        /*         window.addEventListener("resize", () => resizeWorkspace());
        resizeWorkspace(); */
        //sortableObj = new Sortable(document.querySelector("#tablist"), opts);
    });
};

onClickOutside(addbox, (e) => (showAddBox.value = false));

if (route.params.id === "add") {
    actionMode.value = CREATE;
    isReady.value = true;
    loadFields();
} else {
    actionMode.value = UPDATE;
    loadFields();
}
</script>

<style lang="scss" scoped></style>
