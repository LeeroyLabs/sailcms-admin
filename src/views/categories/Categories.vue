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
                                :label="$t('categories.form.name')"
                                variant="outlined"
                                :hide-details="true"
                                type="text"
                                clearable
                                density="comfortable"
                                v-model="categoryNameInput"
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
                                :label="$t('categories.form.slug')"
                                variant="outlined"
                                :hide-details="true"
                                type="text"
                                clearable
                                density="comfortable"
                                v-model="categorySlugInput"
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
                                v-if="action === 'add'"
                                @click="handleAddCategory"
                                color="primary"
                                prepend-icon="mdi-account-plus"
                                :disabled="!categoryNameInput"
                            >
                                {{ $t("categories.form.add_category") }}
                            </v-btn>

                            <div
                                v-else
                                class="tw-flex tw-gap-2 tw-justify-between tw-flex-wrap"
                            >
                                <v-btn
                                    @click="handleCancel"
                                    color="primary"
                                    class="tw-flex-grow"
                                >
                                    {{ $t("categories.form.cancel") }}
                                </v-btn>
                                <v-btn
                                    @click="handleEditCategory"
                                    color="primary"
                                    :disabled="!categoryNameInput"
                                    class="tw-flex-grow"
                                >
                                    {{ $t("categories.form.edit_category") }}
                                </v-btn>
                            </div>
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
import type { Category } from "@/libs/graphql/types/categories";
import { Categories } from "@/libs/graphql";
import { SailCMS } from "@/libs/graphql";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref<boolean>(true);

const categories = ref<Category[]>([
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

// Get categories
const categoryFullTree = async (parent_id: string, site_id: string) => {
    const responseCategoryFullTree = await Categories.categoryFullTree(
        parent_id,
        site_id
    );
    if (responseCategoryFullTree) {
        console.log(responseCategoryFullTree);
    }
};
categoryFullTree("", SailCMS.siteId);

// Emits
const emitter: any = inject("emitter");
emitter.on("delete-item", (item: Category) => handleDeleteCategory(item));
emitter.on("edit-item", (item: Category) => {
    action.value = "edit";
    editCategoryName.value = item.name;
    categoryNameInput.value = item.name;
});

// Add a category
const handleAddCategory = () => {
    categories.value.push({ name: categoryNameInput.value, items: [] });
};

const renameCategory = (
    categories: Category[],
    categoryName: string,
    oldCategoryName: string
) => {
    const cat = categories.find((el) => {
        if (el.items.length) {
            renameCategory(el.items, categoryName, oldCategoryName);
        }

        return el.name === oldCategoryName;
    });

    if (cat) {
        cat.name = categoryName;
    }
};

// Edit a category
const handleEditCategory = () => {
    renameCategory(
        categories.value,
        categoryNameInput.value,
        editCategoryName.value
    );

    categoryNameInput.value = "";
    categorySlugInput.value = "";
    action.value = "add";
};

// Cancel edit
const handleCancel = () => {
    categoryNameInput.value = "";
    categorySlugInput.value = "";
    action.value = "add";
};

const removeCategory = (
    categories: Category[],
    category: Category
): Category[] => {
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
const handleDeleteCategory = (item: Category) => {
    categories.value = removeCategory(categories.value, item);
};

// Search
const action = ref("add");
const categoryNameInput = ref("");
const categorySlugInput = ref(categoryNameInput);
const currentSearch = ref("");
const editCategoryName = ref("");

// Run Search
const runSearch = async () => {
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

<style lang="scss" scoped>
:deep(.v-color-picker-preview__dot) {
    @apply tw-border tw-border-solid tw-border-[#E5E7EB]/80;
    @apply tw-bg-none;
}
</style>
