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
                                    @removed="handleRemoveField"
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
import { ref, nextTick, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { SailCMS } from "@/libs/graphql";
import Sortable from "sortablejs";
import { v4 } from "uuid";
import { deburr, lowerCase } from "lodash";
import { onClickOutside } from "@vueuse/core";

import ArrowUpBox from "@/components/globals/ArrowUpBox.vue";
import Tab from "@/components/entries/layout/Tab.vue";
import TabBar from "@/components/globals/Tab.vue";
import BackButton from "@/components/globals/BackButton.vue";
import FieldSelector from "@/components/entries/entry/fields/FieldSelector.vue";

const i18n = useI18n();
const isReady = ref(false);
const router = useRouter();
const route = useRoute();

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

let sortableObj;
const searchFilter = ref("");
const tab = ref(0);

// Constants
const CREATE = "create";
const UPDATE = "update";

const opts = {
    handle: ".drag-handle",
    tag: "div",
    direction: "horizontal",
    ghostClass: "ghost",
    animation: 300,
    swapTreshold: 0.05,
    dragoverBubble: false,
    //onEnd: handleTabChanges,
};

let schemaStruct = [
    {
        label: "Main",
        id: v4(),
        key: v4(),
        fields: [],
    },
];

const schema = ref(schemaStruct);
let virtualSchema = schemaStruct;

const loadFields = async () => {
    fields.value = await Entries.fields(SailCMS.getLocales());

    fields.value = fields.value.map((f) => {
        return {
            ...f,
            used: false,
        };
    });

    /*     if (route.params.id !== "add") {
        const layout = await Entries.entryLayout(route.params.id);
        layoutName.value = layout.title;
        schemaStruct = [];

        for (let tab of layout.schema) {
            let _fields = [];

            for (let _field of tab.fields) {
                _fields.push({ key: _field.key, width: _field.width });

                let field = fields.value.find((f) => f.key === _field.key);
                if (field) field.used = true;
            }

            schemaStruct.push({
                label: tab.label,
                id: v4(),
                key: v4(),
                fields: _fields,
            });
        }

        schema.value = schemaStruct;
        virtualSchema = schemaStruct;
    } */

    isReady.value = true;

    nextTick(() => {
        /*         window.addEventListener("resize", () => resizeWorkspace());
        resizeWorkspace(); */
        //sortableObj = new Sortable(document.querySelector("#tablist"), opts);
    });
};

const isUsed = (key) => {
    let field = fields.value.find((f) => f.key === key);
    if (field) return field.used;
    return false;
};

const addToTab = (element, tab) => {
    offsetBox.value = false;
    usedFields.value.push({ key: element.key, width: "full" });
    /*     emitter("added", {
        element: element,
        key: element.key,
        tab: tab,
        used: usedFields.value,
    });

    nextTick(() => addbox.value.reposition()); */
};

const handleRemoveField = (useFields) => {
    console.log("FIELDS", usedFields);
    usedFields.value = useFields.value;
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
