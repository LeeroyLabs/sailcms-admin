<template>
    <div v-if="!isLoading">
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
                                v-model="categoryNameInput[getLocale()]"
                                @click:clear="clearSearch"
                            >
                                <template v-slot:append-inner>
                                    <div class="tw-opacity-[0.20]">
                                        <v-icon icon="mdi-keyboard-return" />
                                    </div>
                                </template>
                            </v-text-field>

                            <v-select
                                clearable
                                :label="$t('categories.form.select_parent')"
                                variant="outlined"
                                :items="formattedCategories"
                                v-model="selectedParentId"
                                item-title="name"
                                item-value="id"
                            />

                            <h3>
                                {{
                                    !selectedCategory
                                        ? $t("categories.form.add_category")
                                        : $t("categories.form.edit_category")
                                }}
                            </h3>
                            <v-btn
                                v-if="!selectedCategory"
                                @click="
                                    handleAddCategory(
                                        categoryNameInput,
                                        selectedParentId || '',
                                        siteId
                                    )
                                "
                                color="primary"
                                class="tw-w-full"
                            >
                                {{ $t("categories.form.add_category") }}
                            </v-btn>
                            <v-btn
                                v-else
                                @click="handleEditCategory(selectedCategory!)"
                                color="primary"
                                class="tw-w-full"
                            >
                                {{ $t("categories.form.edit_category") }}
                            </v-btn>
                            <v-btn
                                @click="handleCancel"
                                color="primary"
                                class="tw-w-full"
                            >
                                {{ $t("categories.form.cancel") }}
                            </v-btn>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="9">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-card class="tw-p-4 tw-h-[80vh] tw-overflow-auto">
                                <NestedList
                                    :categories="categoriesList"
                                    :key="categoriesListKey"
                                />
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
import { ref, inject, onMounted, watch } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import Loader from "@/components/globals/Loader.vue";
import NestedList from "@/components/globals/categories/NestedList.vue";
import type { Category } from "@/libs/graphql/types/categories";
import type { LocaleObject } from "@/libs/graphql/types/general";
import { Categories } from "@/libs/graphql";
import { SailCMS } from "@/libs/graphql";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref<boolean>(true);
const siteId = ref(SailCMS.getSiteId());

// Return the locale as string
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

const categoriesList = ref<Category[]>([]);
const categoriesListKey = ref<number>(0);
const selectedCategory = ref<Category | null>(null);
const formattedCategories = ref<
    {
        id: string;
        name: string;
    }[]
>([]);
const selectedParentId = ref<string | null>(null);

// Search & Actions
const categoryNameInput = ref<LocaleObject>({ en: "", fr: "" });
const currentSearch = ref<string>("");

// Emits
const emitter: any = inject("emitter");
emitter.on("delete-item", (item: Category) => handleDeleteCategory(item));
emitter.on("edit-item", (item: Category) => {
    selectedCategory.value = item;
    selectedParentId.value = item.parent_id;
    categoryNameInput.value = item.name;
    formattedCategories.value = formattedCategories.value.filter(
        (el) => el.id !== selectedCategory?.value?._id
    );
});
emitter.on("update-list", () => categoryFullTree("", siteId.value));

// Get categories
const categoryFullTree = async (parent_id: string, site_id: string) => {
    const responseCategoryFullTree = await Categories.categoryFullTree(
        parent_id,
        site_id
    );
    if (responseCategoryFullTree) {
        categoriesList.value = responseCategoryFullTree;
        formattedCategoriesList(categoriesList.value);
        categoriesListKey.value++;
        isLoading.value = false;
    }
};

// Format the categories to display within the dropdown
const formattedCategoriesList = (categoriesList: Category[]) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            formattedCategoriesList(cat.children);
        }

        return {
            id: cat._id,
            name: cat.name["en"],
        };
    });

    formattedCategories.value = [
        ...formattedCategories.value,
        ...formattedList,
    ];
};

// Add a category
const handleAddCategory = async (
    name: LocaleObject,
    parent_id: string,
    site_id: string
) => {
    const responseAddCategory = await Categories.createCategory(
        name,
        parent_id,
        site_id
    );
    if (responseAddCategory) {
        categoryFullTree("", siteId.value);
        categoryNameInput.value = { en: "", fr: "" };
        selectedParentId.value = null;
    }
};

// Edit a category
const handleEditCategory = async (item: Category) => {
    const responseEditCategory = await Categories.updateCategory(
        item._id,
        categoryNameInput.value,
        ""
    );
    if (responseEditCategory) {
        categoryFullTree("", siteId.value);
        categoryNameInput.value = { en: "", fr: "" };
        selectedCategory.value = null;
    }
};

// Cancel edit
const handleCancel = () => {
    categoryNameInput.value = { en: "", fr: "" };
    selectedCategory.value = null;
    selectedParentId.value = null;
};

// Delete a category
const handleDeleteCategory = async (item: Category) => {
    const responseDeleteCategory = await Categories.deleteCategory(item._id);
    if (responseDeleteCategory) {
        categoryFullTree("", siteId.value);
    }
};

// Clear Search Button Handler
const clearSearch = async () => {
    currentSearch.value = "";
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

onMounted(() => {
    categoryFullTree("", siteId.value);
    setupPage();
});

watch(selectedParentId, (value) => console.log("VALUE", value));
</script>

<style lang="scss" scoped>
:deep(.v-color-picker-preview__dot) {
    @apply tw-border tw-border-solid tw-border-[#E5E7EB]/80;
    @apply tw-bg-none;
}
</style>
