<template>
    <div v-if="isReady">
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-form
                                ref="categoryForm"
                                @submit.prevent
                                class="tw-flex tw-flex-col tw-gap-4"
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
                                    density="comfortable"
                                    required
                                    :rules="categoryNameRules"
                                    :hide-details="true"
                                    v-model="categoryNameInput[locale]"
                                >
                                </v-text-field>

                                <v-select
                                    :label="$t('categories.form.select_parent')"
                                    variant="outlined"
                                    density="comfortable"
                                    :items="flattenCategoriesList"
                                    v-model="selectedParentId"
                                    item-title="name"
                                    item-value="id"
                                    :hide-details="true"
                                />

                                <div
                                    class="tw-flex tw-items-center tw-gap-x-2 tw-flex-wrap"
                                >
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
                                    >
                                        {{
                                            $t(
                                                "categories.form.add_category_btn"
                                            )
                                        }}
                                    </v-btn>

                                    <v-btn
                                        v-if="selectedCategory"
                                        @click="
                                            handleUpdateCategory(
                                                selectedCategory
                                            )
                                        "
                                        type="submit"
                                        density="default"
                                        color="primary"
                                    >
                                        {{
                                            $t(
                                                "categories.form.edit_category_btn"
                                            )
                                        }}
                                    </v-btn>

                                    <v-btn
                                        @click="handleCancel"
                                        variant="text"
                                        density="default"
                                    >
                                        {{ $t("categories.form.cancel") }}
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
                                        :modalMsg="$t('categories.confirm_msg')"
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
const isReady = ref(false);
const siteId = ref(SailCMS.getSiteId());
const siteLocales = ref(SailCMS.getLocales());

// Template refs
const categoryForm = ref();

const categoriesList = ref([]);
const categoriesListKey = ref(0);
const selectedCategory = ref(null);
const selectedParentId = ref(null);
const flattenCategoriesList = ref([]);
const sortedCategories = ref([]);

// Search & Validations
const categoryNameInput = ref({ en: "", fr: "" });
const categoryNameRules = [(value) => !!value || "Name is required"];

// Reset form
const reset = () => {
    if (categoryForm.value) categoryForm.value.reset();
};

// Emits
const emitter = inject("emitter");
emitter.on("delete-item", (data) => handleDeleteCategory(data.item));
emitter.on("update-item", (item) => {
    selectedCategory.value = item;
    selectedParentId.value = item.parent_id || null;
    categoryNameInput.value = item.name;

    flattenCategoriesList.value = [];
    flatCategoriesList(categoriesList.value);
    flattenCategoriesList.value = flattenCategoriesList.value.filter(
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
        flattenCategoriesList.value = [];
        flatCategoriesList(categoriesList.value);
        categoriesListKey.value++;
        isReady.value = true;
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

    flattenCategoriesList.value = [
        ...flattenCategoriesList.value,
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
    const status = await categoryForm.value.validate();
    if (!status.valid) return;

    const responseAddCategory = await Categories.createCategory(
        name,
        parent_id,
        site_id
    );
    if (responseAddCategory) {
        categoryFullTree("", siteId.value);
        handleCancel();
    }
};

// Update a category
const handleUpdateCategory = async (item) => {
    const status = await categoryForm.value.validate();
    if (!status.valid) return;

    isReady.value = false;
    const responseUpdateCategory = await Categories.updateCategory(
        item._id,
        categoryNameInput.value,
        selectedParentId.value || ""
    );
    if (responseUpdateCategory) {
        categoryFullTree("", siteId.value);
        handleCancel();
        isReady.value = true;
    }
};

// Update category orders & parent id
const updateCategoryOrders = async (sortedCategories) => {
    const responseUpdateCategoryOrders = await Categories.updateCategoryOrders(
        sortedCategories,
        siteId.value
    );
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
    flattenCategoriesList.value = [];
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
