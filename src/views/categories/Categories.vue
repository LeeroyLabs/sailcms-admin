<template>
    <div v-if="isLoading">
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" fluid>
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-text-field
                                color="primary"
                                :label="$t('categories.add.name')"
                                variant="outlined"
                                :hide-details="true"
                                type="text"
                                clearable
                                density="comfortable"
                                v-model="newCategoryName"
                                @keydown.enter="runSearch"
                                @click:clear="clearSearch"
                            >
                                <template v-slot:append-inner>
                                    <div class="tw-opacity-[0.20]">
                                        <v-icon icon="mdi-keyboard-return" />
                                    </div>
                                </template>
                            </v-text-field>

                            <v-text-field
                                color="primary"
                                :label="$t('categories.add.handle')"
                                variant="outlined"
                                :hide-details="true"
                                type="text"
                                clearable
                                density="comfortable"
                                v-model="newCategoryName"
                                @keydown.enter="runSearch"
                                @click:clear="clearSearch"
                            >
                                <template v-slot:append-inner>
                                    <div class="tw-opacity-[0.20]">
                                        <v-icon icon="mdi-keyboard-return" />
                                    </div>
                                </template>
                            </v-text-field>

                            <v-btn
                                @click="handleAddCategory"
                                color="primary"
                                prepend-icon="mdi-account-plus"
                                :disabled="!newCategoryName"
                            >
                                {{ $t("categories.add.add_category") }}
                            </v-btn>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="9">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-text-field
                                color="primary"
                                :label="$t('categories.search')"
                                variant="outlined"
                                :hide-details="true"
                                type="text"
                                clearable
                                density="comfortable"
                                v-model="currentSearch"
                                @keydown.enter="runSearch"
                                @click:clear="clearSearch"
                            >
                                <template v-slot:append-inner>
                                    <div class="tw-opacity-[0.20]">
                                        <v-icon icon="mdi-keyboard-return" />
                                    </div>
                                </template>
                            </v-text-field>

                            <v-card
                                class="tw-p-4 tw-h-[calc(100vh-300px)] tw-overflow-auto"
                            >
                                <NestedList :items="categories" />
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>

    <Loader v-else />
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import Loader from "@/components/globals/Loader.vue";
import NestedList from "@/components/globals/categories/NestedList.vue";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref<boolean>(true);

interface Item {
    name: string;
    items: Item[] | [];
}

const categories = ref<Item[]>([
    {
        name: "Music",
        items: [
            {
                name: "Metal",
                items: [
                    {
                        name: "Trash",
                        items: [
                            {
                                name: "Sub Trash 1",
                                items: [],
                            },
                            {
                                name: "Sub Trash 2",
                                items: [],
                            },
                        ],
                    },
                    {
                        name: "Progressive",
                        items: [],
                    },
                ],
            },
            {
                name: "Rap",
                items: [],
            },
            {
                name: "Pop",
                items: [
                    {
                        name: "Sub Pop 1",
                        items: [],
                    },
                    {
                        name: "Sub Pop 2",
                        items: [],
                    },
                ],
            },
        ],
    },
    {
        name: "Sport",
        items: [
            {
                name: "Basketball",
                items: [],
            },
            {
                name: "Hockey",
                items: [],
            },
        ],
    },
]);

// Emits
const emitter = inject("emitter");
emitter.on("delete-item", (item: Item) => handleDeleteCategory(item));
emitter.on("edit-item", (item: Item) => handleEditCategory(item));

// Add a category
const handleAddCategory = () => {
    categories.value.push({ name: newCategoryName.value, items: [] });
};

// Edit a category
const handleEditCategory = (item: Item) => {
    console.log("EDIT");
};

const removeCategory = (categories: Item[], category: Item): Item[] => {
    const filteredCategories = categories.filter((el) => {
        if (el.name === category.name) return;

        if (el.items.length) {
            el.items = removeCategory(el.items, category);
            return el;
        }
        return el.name !== category.name;
    });

    return filteredCategories;
};

// Delete a category
const handleDeleteCategory = (item: Item) => {
    categories.value = removeCategory(categories.value, item);
};

// Search
const newCategoryName = ref("");

// Search
const currentSearch = ref("");

// Run Search
const runSearch = async (e) => {
    console.log("RUN SEARCH");
};

// Clear Search Button Handler
const clearSearch = async () => {
    console.log("CLEAR SEARCH");
};

// Setup page data
const setupPage = () => {
    // Set Breadcrumb
    store.setBreadcrumbs([
        {
            title: "Dashboard",
            disabled: false,
            to: store.baseURL + "/dashboard",
        },
        { title: i18n.t("categories.title") },
    ]);

    store.setPageTitle(i18n.t("categories.title"));
    document.title = i18n.t("categories.title") + " — SailCMS";
};

setupPage();
</script>

<style lang="scss" scoped></style>
