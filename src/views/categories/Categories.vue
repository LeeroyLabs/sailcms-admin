<template>
    <div v-if="!isLoading">
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <h3 class="tw-font-medium tw-text-xl">
                                {{
                                    !selectedCategory
                                        ? $t("categories.form.title_add")
                                        : $t("categories.form.title_edit")
                                }}
                            </h3>
                            <v-form
                                ref="categoryForm"
                                @submit.prevent
                                v-model="isFormValid"
                                class="tw-flex tw-flex-col tw-gap-2"
                            >
                                <v-text-field
                                    v-for="locale in siteLocales"
                                    :key="locale"
                                    color="primary"
                                    :label="
                                        $t(`categories.form.name.${locale}`)
                                    "
                                    variant="outlined"
                                    type="text"
                                    :clearable="true"
                                    density="comfortable"
                                    required
                                    :rules="categoryNameRules"
                                    v-model="categoryNameInput[locale]"
                                    @click:clear="handleCancel"
                                >
                                </v-text-field>

                                <v-select
                                    :clearable="true"
                                    :label="$t('categories.form.select_parent')"
                                    variant="outlined"
                                    density="comfortable"
                                    :items="flattendCategoriesList"
                                    v-model="selectedParentId"
                                    item-title="name"
                                    item-value="id"
                                />

                                <div
                                    class="tw-flex tw-items-center tw-justify-between tw-gap-8 tw-flex-wrap"
                                >
                                    <v-btn
                                        @click="handleCancel"
                                        color="primary"
                                        density="default"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                    >
                                        {{ $t("categories.form.cancel") }}
                                    </v-btn>
                                    <v-btn
                                        v-if="!selectedCategory"
                                        @click="
                                            handleAddCategory(
                                                categoryNameInput,
                                                selectedParentId || '',
                                                siteId
                                            )
                                        "
                                        type="submit"
                                        color="primary"
                                        density="default"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                    >
                                        {{
                                            $t(
                                                "categories.form.add_category_btn"
                                            )
                                        }}
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        @click="
                                            handleUpdateCategory(
                                                selectedCategory
                                            )
                                        "
                                        type="submit"
                                        density="default"
                                        color="primary"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                    >
                                        {{
                                            $t(
                                                "categories.form.edit_category_btn"
                                            )
                                        }}
                                    </v-btn>
                                </div>
                            </v-form>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="9">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-card class="tw-p-4 tw-h-[80vh] tw-overflow-auto">
                                <div class="">
                                    <NestedDraggable
                                        v-if="
                                            categoriesList &&
                                            categoriesList.length
                                        "
                                        :items="categoriesList"
                                        :displayedOption="
                                            (item) => item.name[$i18n.locale]
                                        "
                                        :isParent="true"
                                        :key="categoriesListKey"
                                        @update-list="handleUpdateList"
                                    />
                                </div>
                            </v-card>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </section>
    </div>

    <Loader v-else />
</template>

<script setup>
// Vue
import { ref, inject, onMounted, watch } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
// Helpers & Libs
import { Categories } from "@/libs/graphql";
import { SailCMS } from "@/libs/graphql";
// Components
import Loader from "@/components/globals/Loader.vue";
import NestedDraggable from "@/components/globals/nestedDraggable/NestedDraggable.vue";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref(true);
const siteId = ref(SailCMS.getSiteId());
const siteLocales = ref(SailCMS.getLocales());

const categoriesList = ref([]);
const categoriesListKey = ref(0);
const selectedCategory = ref(null);
const flattendCategoriesList = ref([]);
const sortedCategories = ref([]);
const selectedParentId = ref(null);

// Template refs
const categoryForm = ref();

// Search & Validations
const isFormValid = ref(false);
const categoryNameInput = ref({ en: "", fr: "" });
const categoryNameRules = [
    (value) => {
        if (value) return true;
        return "Name is requred.";
    },
];
// Reset form
const reset = () => {
    if (categoryForm.value) categoryForm.value.reset();
};

// Emits
const emitter = inject("emitter");
emitter.on("delete-item", (data) => handleDeleteCategory(data.item));
emitter.on("update-item", (item) => {
    selectedCategory.value = item;
    selectedParentId.value = item.parent_id;
    categoryNameInput.value = item.name;
    flattendCategoriesList.value = flattendCategoriesList.value.filter(
        (el) => el.id !== selectedCategory?.value?._id
    );
});
const handleUpdateList = (list) => {
    sortedCategories.value = [];
    formatSortedCategories(list, "");
    updateCategoryOrders(sortedCategories.value);
};

// Get categories
const categoryFullTree = async (parent_id, site_id) => {
    const responseCategoryFullTree = await Categories.categoryFullTree(
        parent_id,
        site_id
    );
    if (responseCategoryFullTree) {
        categoriesList.value = responseCategoryFullTree;
        flattendCategoriesList.value = [];
        flatCategoriesList(categoriesList.value);
        isLoading.value = false;
        categoriesListKey.value++;
    }
};

// Flat the categories array to display within the parent id dropdown
const flatCategoriesList = (categoriesList) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            flatCategoriesList(cat.children);
        }

        return {
            id: cat._id,
            name: cat.name[i18n.locale.value],
        };
    });

    flattendCategoriesList.value = [
        ...flattendCategoriesList.value,
        ...formattedList,
    ].sort((a, b) => a.name.localeCompare(b.name));
};

// Format the categories to pass to the updateCategoryOrders mutation
const formatSortedCategories = (categoriesList, parent) => {
    const list = categoriesList.map((el) => {
        if (el.children && el.children.length)
            formatSortedCategories(el.children, el._id);
        return { id: el._id, parent: parent, order: el.order };
    });
    sortedCategories.value = [...sortedCategories.value, ...list];
};

// Add a category
const handleAddCategory = async (name, parent_id, site_id) => {
    if (isFormValid.value) {
        const responseAddCategory = await Categories.createCategory(
            name,
            parent_id,
            site_id
        );
        if (responseAddCategory) {
            categoryFullTree("", siteId.value);
            handleCancel();
        }
    }
};

// Update a category
const handleUpdateCategory = async (item) => {
    if (isFormValid.value) {
        isLoading.value = true;
        const responseUpdateCategory = await Categories.updateCategory(
            item._id,
            categoryNameInput.value,
            selectedParentId.value || ""
        );
        if (responseUpdateCategory) {
            categoryFullTree("", siteId.value);
            handleCancel();
            isLoading.value = false;
        }
    }
};

// Update category orders & parent id
const updateCategoryOrders = async (sortedCategories) => {
    const responseUpdateCategoryOrders = await Categories.updateCategoryOrders(
        sortedCategories,
        siteId.value
    );
    if (responseUpdateCategoryOrders) {
    }
};

// Delete a category
const handleDeleteCategory = async (item) => {
    const responseDeleteCategory = await Categories.deleteCategory(item._id);
    if (responseDeleteCategory) {
        categoryFullTree("", siteId.value);
    }
};

// Cancel
const handleCancel = () => {
    categoryNameInput.value = { en: "", fr: "" };
    selectedCategory.value = null;
    selectedParentId.value = null;
    isFormValid.value = false;
    reset();
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

watch(i18n.locale, () => {
    categoriesListKey.value++;
    flattendCategoriesList.value = [];
    flatCategoriesList(categoriesList.value);
});

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
