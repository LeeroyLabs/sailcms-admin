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
                                @click="
                                    handleAddCategory(
                                        categoryNameInput,
                                        '',
                                        siteId
                                    )
                                "
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
                                    v-if="selectedCategory"
                                    @click="
                                        handleEditCategory(selectedCategory)
                                    "
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
                                <NestedList :categories="categoriesList" />
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
import { ref, inject, onMounted } from "vue";
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
const selectedCategory = ref<Category>();

// Search & Actions
const action = ref("add");
const categoryNameInput = ref<LocaleObject>({ en: "", fr: "" });
const currentSearch = ref("");

// Get categories
const categoryFullTree = async (parent_id: string, site_id: string) => {
    const responseCategoryFullTree = await Categories.categoryFullTree(
        parent_id,
        site_id
    );
    if (responseCategoryFullTree) {
        categoriesList.value = responseCategoryFullTree;
        isLoading.value = false;
    }
};

// Emits
const emitter: any = inject("emitter");
emitter.on("delete-item", (item: Category) => handleDeleteCategory(item));
emitter.on("edit-item", (item: Category) => {
    action.value = "edit";
    selectedCategory.value = item;
    categoryNameInput.value = item.name;
});

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
        categoryNameInput.value = { en: "", fr: "" };
        action.value = "add";
    }
};

// Cancel edit
const handleCancel = () => {
    categoryNameInput.value = { en: "", fr: "" };
    action.value = "add";
};

// Delete a category
const handleDeleteCategory = async (item: Category) => {
    const responseDeleteCategory = await Categories.deleteCategory(item._id);
    if (responseDeleteCategory) {
        categoryFullTree("", siteId.value);
    }
};

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

onMounted(() => {
    categoryFullTree("", siteId.value);
    setupPage();
});
</script>

<style lang="scss" scoped>
:deep(.v-color-picker-preview__dot) {
    @apply tw-border tw-border-solid tw-border-[#E5E7EB]/80;
    @apply tw-bg-none;
}
</style>
