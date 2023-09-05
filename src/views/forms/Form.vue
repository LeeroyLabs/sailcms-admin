<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                color="primary"
                @click="$router.push({ name: 'Form', params: { id: 'add' } })"
            >
                {{ $t("form.save") }}
            </v-btn>
        </Teleport>
        FORM
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <!-- Small + button -->
                        <template v-if="fields.length > 0">
                            <v-btn
                                :id="'add_btn_'"
                                @click.prevent="
                                    () => {
                                        offsetBox = false;
                                        showAddBox = true;
                                    }
                                "
                                variant="flat"
                                color="primary"
                                class="tw-w-full"
                                >{{ $t("layout.add_field") }}</v-btn
                            >
                        </template>

                        <!-- Big + button -->
                        <template v-if="fields.length === 0">
                            <div
                                class="tw-h-full tw-min-h-[75px] tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-center tw-rounded-md"
                                :class="{
                                    'tw-bg-gray-100':
                                        $vuetify.theme.name === 'light',
                                    'tw-bg-darkbg':
                                        $vuetify.theme.name === 'dark',
                                }"
                            >
                                <div
                                    :id="'add_btn_'"
                                    @click.prevent="
                                        () => {
                                            offsetBox = true;
                                            showAddBox = true;
                                        }
                                    "
                                    class="tw-rounded-full tw-w-[40px] tw-h-[40px] tw-cursor-pointer hover:tw-bg-primary tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-white tw-transition tw-duration-250"
                                    :class="{
                                        'tw-bg-gray-400':
                                            $vuetify.theme.name === 'light',
                                        'tw-bg-neutral-700':
                                            $vuetify.theme.name === 'dark',
                                    }"
                                >
                                    <v-icon
                                        icon="mdi-plus"
                                        class="tw-mx-auto"
                                    />
                                </div>
                            </div>
                        </template>

                        <Transition>
                            <ArrowUpBox
                                v-if="showAddBox"
                                ref="addbox"
                                :emptyAddButton="'add_btn_'"
                                :offset="offsetBox"
                            >
                                <template v-slot:extra>
                                    <v-text-field
                                        variant="outlined"
                                        color="primary"
                                        :clearable="true"
                                        :hide-details="true"
                                        :single-line="true"
                                        v-model="searchFilter"
                                        append-inner-icon="mdi-magnify"
                                        density="comfortable"
                                        :label="$t('system.search')"
                                        class="tw-mb-2"
                                    />
                                </template>
                                <template v-slot:default>
                                    <div class="tw-flex tw-flex-col tw-gap-y-2">
                                        <template
                                            v-for="(
                                                element, index
                                            ) in fields.filter((f) =>
                                                deburr(
                                                    lowerCase(f.name || '')
                                                ).includes(
                                                    deburr(
                                                        lowerCase(
                                                            searchFilter || ''
                                                        )
                                                    )
                                                )
                                            )"
                                        >
                                            <div
                                                @click.prevent="
                                                    addToTab(element, tab.id)
                                                "
                                                class="tw-p-2 tw-border tw-border-neutral-300 tw-rounded-md tw-cursor-pointer"
                                                :class="{
                                                    'tw-pointer-events-none tw-opacity-50 tw-select-none':
                                                        isUsed(element.key),
                                                    'hover:tw-bg-zinc-800 ':
                                                        $vuetify.theme.name ===
                                                        'dark',
                                                    'hover:tw-bg-gray-200':
                                                        $vuetify.theme.name ===
                                                        'light',
                                                }"
                                            >
                                                {{ element.name }}
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </ArrowUpBox>
                        </Transition>
                    </v-col>

                    <v-col cols="12" xs="12" md="9">
                        <v-card class="tw-p-4 tw-h-[80vh] tw-overflow-auto">
                            RIGHT
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

import { Entries } from "@/libs/graphql/lib/entries";
import { SailCMS } from "@/libs/graphql";
import Sortable from "sortablejs";
import { v4 } from "uuid";

import ArrowUpBox from "@/components/globals/ArrowUpBox.vue";
import Tab from "@/components/entries/layout/Tab.vue";

const isReady = ref(false);
const router = useRouter();
const route = useRoute();

const actionMode = ref("");
const showAddBox = ref(false);
const fields = ref([]);
let sortableObj;

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

const loadFields = async () => {
    fields.value = await Entries.fields(SailCMS.getLocales());

    fields.value = fields.value.map((f) => {
        return {
            ...f,
            used: false,
        };
    });

    if (route.params.id !== "add") {
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
    }
    console.log("FIELDS", fields.value);

    isReady.value = true;

    nextTick(() => {
        /*         window.addEventListener("resize", () => resizeWorkspace());
        resizeWorkspace(); */

        sortableObj = new Sortable(document.querySelector("#tablist"), opts);
    });
};

loadFields();

if (route.params.id === "add") {
    actionMode.value = CREATE;
    isReady.value = true;
} else {
    actionMode.value = UPDATE;
    //loadTask();
}
</script>

<style lang="scss" scoped></style>
