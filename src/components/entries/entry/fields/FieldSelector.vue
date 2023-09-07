<template>
    <div :id="tab.id" class="tw-relative">
        <div
            :id="'tab-' + tab.id"
            class="field-list tw-flex tw-flex-col tw-gap-3 sorting-parent tw-min-h-full tw-h-full tw-relative"
        >
            <div
                v-for="(element, index) in selectedFields"
                :id="element.key"
                :data-width="element.width"
                :data-fid="'field-' + element.key"
                class="sortable tw-border tw-py-2 tw-px-2 tw-flex tw-flex-row tw-items-center"
                :class="{
                    'tw-bg-white hover:tw-bg-gray-100 tw-border-zinc-400':
                        $vuetify.theme.name === 'light',
                    'tw-bg-neutral-900 tw-text-white hover:tw-bg-neutral-800 tw-border-neutral-500':
                        $vuetify.theme.name === 'dark',
                }"
                @end="handleSorting"
            >
                <v-icon
                    icon="mdi-menu"
                    class="list-dnd-handle tw-mr-2 tw-cursor-grab"
                    :class="{
                        'tw-text-zinc-400': $vuetify.theme.name === 'light',
                        'tw-text-neutral-500': $vuetify.theme.name === 'dark',
                    }"
                />
                <div class="tw-truncate tw-mr-1">
                    {{ fields.find((f) => f.key === element.key)?.name }}
                </div>
                <div
                    class="tw-flex-grow tw-flex tw-flex-row tw-justify-end tw-gap-x-2"
                >
                    <button @click.prevent="openFieldSettings(index)">
                        <v-icon
                            icon="mdi-cog"
                            size="small"
                            class="hover:tw-text-primary"
                        />
                    </button>

                    <button @click.prevent="removeField(element)">
                        <v-icon
                            icon="mdi-trash-can-outline"
                            size="small"
                            class="hover:tw-text-red-500"
                        />
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                            :open-delay="750"
                            >{{ $t("layout.delete_field") }}</v-tooltip
                        >
                    </button>

                    <Transition>
                        <FieldSettings
                            v-if="showFieldSettings"
                            :field="selectedFields[fieldSettingsCurrentField]"
                            @close="showFieldSettings = false"
                            @change="(e) => handleFieldChange(e)"
                        />
                    </Transition>
                </div>
            </div>
            <div class="tw-h-full">
                <!-- Small + button -->
                <template v-if="fields.length > 0">
                    <v-btn
                        :id="'add_btn_' + tab.id"
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
                            'tw-bg-gray-100': $vuetify.theme.name === 'light',
                            'tw-bg-darkbg': $vuetify.theme.name === 'dark',
                        }"
                    >
                        <div
                            :id="'add_btn_' + tab.id"
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
                            <v-icon icon="mdi-plus" class="tw-mx-auto" />
                        </div>
                    </div>
                </template>

                <!-- Field selector -->
                <Transition>
                    <ArrowUpBox
                        v-if="showAddBox"
                        ref="addbox"
                        :emptyAddButton="'add_btn_' + tab.id"
                        :offset="offsetBox"
                        class="!tw-absolute !tw-top-[80px] tw-left-2/4 tw--translate-x-2/4"
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
                                    v-for="element in fields.filter((f) =>
                                        deburr(
                                            lowerCase(f.name || '')
                                        ).includes(
                                            deburr(
                                                lowerCase(searchFilter || '')
                                            )
                                        )
                                    )"
                                >
                                    <div
                                        @click.prevent="addToTab(element)"
                                        class="tw-p-2 tw-border tw-border-neutral-300 tw-rounded-md tw-cursor-pointer"
                                        :class="{
                                            'tw-pointer-events-none tw-opacity-50 tw-select-none':
                                                isUsed(element.key),
                                            'hover:tw-bg-zinc-800 ':
                                                $vuetify.theme.name === 'dark',
                                            'hover:tw-bg-gray-200':
                                                $vuetify.theme.name === 'light',
                                        }"
                                    >
                                        {{ element.name }}
                                    </div>
                                </template>
                            </div>
                        </template>
                    </ArrowUpBox>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import Sortable from "sortablejs";
import { ref, watch, onMounted } from "vue";
import { deburr, lowerCase } from "lodash";
import ArrowUpBox from "@/components/globals/ArrowUpBox.vue";
import { onClickOutside } from "@vueuse/core";
import FieldSettings from "@/components/entries/layout/FieldSettings.vue";

const emitter = defineEmits(["update:usedFields"]);

const props = defineProps({
    tab: {
        type: Object,
        default: null,
    },
    fields: {
        type: Array,
        default: [],
    },
    usedFields: {
        type: Array,
        default: [],
    },
});

const selectedFields = ref(props.usedFields);
const searchFilter = ref("");
const showFieldSettings = ref(false);
const fieldSettingsCurrentField = ref(-1);

const showAddBox = ref(false);
const addbox = ref(null);
const offsetBox = ref(false);

onClickOutside(addbox, (e) => (showAddBox.value = false));

const addToTab = (element) => {
    offsetBox.value = false;
    const fields = [...selectedFields.value, element];
    emitter("update:usedFields", fields);
};

const removeField = (element) => {
    selectedFields.value = props.fields.filter((f) => f.key !== element.key);
    emitter("update:usedFields", selectedFields.value);
};

const isUsed = (key) => {
    let field = props.fields.find((f) => f.key === key);
    if (field) return field.used;
    return false;
};

const openFieldSettings = (index) => {
    showFieldSettings.value = true;
    fieldSettingsCurrentField.value = index;
};

const handleFieldChange = (value) => {
    showFieldSettings.value = false;
    selectedFields.value[fieldSettingsCurrentField.value].width = value;
    console.log("INDEX", fieldSettingsCurrentField.value, selectedFields.value);
};

watch(
    () => props.usedFields,
    (newValue) => {
        selectedFields.value = newValue;
    },
    {
        deep: true,
    }
);

watch(selectedFields, () => {
    const elements = document.getElementsByClassName("sortable");
    for (let i = 0; i < elements.length; i++) {
        new Sortable(elements[i], opts);
    }
});

const handleChange = (e) => {
    let tab = "tab-" + props.tab.id;

    let children = Array.from(document.getElementById(tab).children).map(
        (c) => {
            if (c.id !== "") {
                return { key: c.id, width: c.getAttribute("data-width") };
            }
        }
    );

    usedFields.value = children.filter((c) => c !== undefined);
    emitter("change", { tab: props.tab.id, used: usedFields.value });
};

const handleSorting = () => {
    console.log("SORTING");
};

const opts = {
    tag: "div",
    direction: "vertical",
    handle: ".list-dnd-handle",
    ghostClass: "ghost",
    animation: 0,
    swapTreshold: 0.45,
    dragoverBubble: false,
    onAdd: handleChange,
    onRemove: handleChange,
    onUpdate: handleChange,
};

// Lifecycle hooks
onMounted(() => {
    const elements = document.getElementsByClassName("sortable");

    for (let i = 0; i < elements.length; i++) {
        new Sortable(elements[i], opts);
    }
});
</script>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
