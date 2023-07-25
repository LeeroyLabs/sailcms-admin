<template>
    <div v-if="!isLoading">
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" fluid>
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <h3 class="tw-font-medium tw-text-xl">
                                {{
                                    !selectedNavItem
                                        ? $t("navigations.form.title_add")
                                        : $t("navigations.form.title_edit")
                                }}
                            </h3>

                            <v-form
                                ref="navFormRef"
                                @submit.prevent
                                v-model="isFormValid"
                                class="tw-flex tw-flex-col tw-gap-2"
                            >
                                <v-text-field
                                    color="primary"
                                    :label="$t(`navigations.form.name`)"
                                    variant="outlined"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    :rules="[navFormValidations.required]"
                                    v-model="navName"
                                    @click:clear="handleCancel"
                                />

                                <v-text-field
                                    color="primary"
                                    :label="$t('navigations.form.label')"
                                    variant="outlined"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    :rules="[navFormValidations.required]"
                                    v-model="navItemStructure.label"
                                    @click:clear="handleCancel"
                                />

                                <v-select
                                    :label="$t('navigations.form.select_type')"
                                    variant="outlined"
                                    density="comfortable"
                                    :items="[
                                        IS_EXTERNAL_URL,
                                        IS_ENTRY,
                                        IS_CATEGORY,
                                    ]"
                                    :rules="[navFormValidations.required]"
                                    v-model="navItemType"
                                />

                                <v-autocomplete
                                    v-if="
                                        navItemType &&
                                        navItemType !== IS_EXTERNAL_URL
                                    "
                                    :label="
                                        navItemType === IS_ENTRY
                                            ? $t(
                                                  'navigations.form.select_entry'
                                              )
                                            : $t(
                                                  'navigations.form.select_category'
                                              )
                                    "
                                    :items="
                                        navItemType === 'Entry'
                                            ? [
                                                  { nameToDisplay: 'Entry 1' },
                                                  { nameToDisplay: 'Entry 2' },
                                                  { nameToDisplay: 'Entry 3' },
                                              ]
                                            : formattedCategories
                                    "
                                    v-model="navItemTypeEntry"
                                    clearable
                                    item-title="nameToDisplay"
                                    return-object
                                    variant="outlined"
                                    density="comfortable"
                                />

                                <v-text-field
                                    v-else
                                    color="primary"
                                    :label="$t('navigations.form.url')"
                                    variant="outlined"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    :rules="
                                        navItemType
                                            ? [navFormValidations.required]
                                            : []
                                    "
                                    v-model="navItemStructure.url"
                                    :disabled="navItemType !== IS_EXTERNAL_URL"
                                    @click:clear="handleCancel"
                                />

                                <div
                                    class="tw-flex tw-items-center tw-justify-between tw-gap-8 tw-flex-wrap"
                                >
                                    <v-btn
                                        @click="handleCancel"
                                        color="primary"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                    >
                                        {{ $t("categories.form.cancel") }}
                                    </v-btn>
                                    <v-btn
                                        v-if="selectedAction === CREATE_ACTION"
                                        type="submit"
                                        block
                                        color="primary"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                        @click="handleCreateNavigationItem"
                                    >
                                        {{
                                            $t(
                                                "navigations.form.add_navigation_btn"
                                            )
                                        }}
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        @click="handleUpdateNavigation"
                                        type="submit"
                                        block
                                        :disabled="!isFormValid"
                                        color="primary"
                                        class="tw-min-w-[100px] tw-flex-grow"
                                    >
                                        {{
                                            $t(
                                                "navigations.form.edit_navigation_btn"
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
                                <NestedDraggable
                                    v-if="
                                        formattedNavItems &&
                                        formattedNavItems.length
                                    "
                                    :items="formattedNavItems"
                                    :displayedOption="(item) => item.label"
                                    :isParent="true"
                                    :modalMsg="$t('navigations.confirm_msg')"
                                    :key="navigationsKey"
                                    @update-list="handleUpdateList"
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

<script setup>
// Vue
import { ref, inject, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/store/app";
// Helpers & Libs
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
import { Categories } from "@/libs/graphql";
import { v4 as uuidv4 } from "uuid";
// Components
import Loader from "@/components/globals/Loader.vue";
import NestedDraggable from "@/components/globals/nestedDraggable/NestedDraggable.vue";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref(true);
const siteId = ref(SailCMS.getSiteId());

const navigationsList = ref();
const selectedNavigation = ref("Header");
const selectedNavItem = ref(null);
const navigationsKey = ref(0);

const formattedNavItems = ref([]);
const flattenFormattedNavItems = ref([]);
const sortedNavItems = ref(null);
const navStructure = ref([]);

// Template Refs
const navFormRef = ref();

// Constants
const IS_EXTERNAL_URL = "External url";
const IS_ENTRY = "Entry";
const IS_CATEGORY = "Category";
const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";

// Search & Validations
const isFormValid = ref(false);
const selectedAction = ref(CREATE_ACTION);
const navName = ref("Header");
const navNameSlug = ref(navName.value.toLowerCase().replaceAll(" ", "-"));
const navItemStructure = ref({
    label: "",
    url: "",
    is_entry: false,
    is_category: false,
    entry_id: "",
    external: false,
    children: [],
});
const navItemType = ref(null);
const navItemTypeEntry = ref(null);
const navFormValidations = {
    required: (value) => !!value || "Required",
};

// Reset
const reset = (input) => {
    input.reset();
};

// Emits
const emitter = inject("emitter");
emitter.on("update-item", (navItem) => updateActionSelected(navItem));
emitter.on("delete-item", (data) => {
    sortedNavItems.value = data.structure;
    handleUpdateNavigation();
});
const handleUpdateList = (structure) => {
    sortedNavItems.value = structure;
    handleUpdateNavigation();
};

// Get the navigations list
const getNavigationDetails = async (name) => {
    const responseNavigationDetails = await Navigations.navigationDetails(name);
    if (responseNavigationDetails) {
        navigationsList.value = responseNavigationDetails;
        navStructure.value = navigationsList.value.structure;

        formattedNavItems.value = formatNavItems(
            navigationsList.value.structure
        );
        flattenFormattedNavItems.value = [];
        flatFormattedNavItems(formattedNavItems.value);
        navigationsKey.value += 1;
        isLoading.value = false;
    }
};

// Add an id to every items
const formatNavItems = (navigationsList) => {
    const list = navigationsList.map((item) => {
        let childrenList = [];
        if (item.children && item.children.length)
            childrenList = formatNavItems(item.children);
        return { ...item, _id: uuidv4(), children: [...childrenList] };
    });
    return list;
};

// Flat the formatted items array
const flatFormattedNavItems = (navigationsList) => {
    const flattenList = navigationsList.flatMap((item) => {
        if (item.children && item.children.length)
            flatFormattedNavItems(item.children);
        return item;
    });

    return (flattenFormattedNavItems.value = [
        ...flattenFormattedNavItems.value,
        ...flattenList,
    ]);
};

// Build the nav structure to pass to the mutation
const setNavItemsStructure = (dataList) => {
    const list = dataList.flatMap((el) => {
        let childrenList = [];

        if (el.children && el.children.length) {
            childrenList = setNavItemsStructure(el.children);
        }

        return flattenFormattedNavItems.value
            .map((item) => {
                if (el._id === item._id) {
                    const { _id, ...itemObject } = item;
                    return {
                        ...itemObject,
                        children: [...childrenList],
                    };
                }
            })
            .filter((el) => el);
    });
    return list;
};

// CREATE
// Create a navigation
const handleCreateNavigation = async () => {
    if (isFormValid.value) {
        const responseAddCategory = await Navigations.createNavigation({
            name: navName.value,
            structure: [navItemStructure.value],
            locale: i18n.locale.value,
            site_id: siteId.value,
        });
        if (responseAddCategory) {
            getNavigationDetails(navNameSlug.value);
            handleCancel();
        }
    }
};

// Create a navigation item
const handleCreateNavigationItem = async () => {
    if (isFormValid.value) {
        const newItem = {
            ...navItemStructure.value,
            _id: uuidv4(),
        };

        formattedNavItems.value = [newItem, ...formattedNavItems.value];
        flattenFormattedNavItems.value = [];
        flatFormattedNavItems(formattedNavItems.value);
        handleUpdateNavigation();
    }
};

// UPDATE
// Update a navigation
const handleUpdateNavigation = async () => {
    if (selectedAction.value === UPDATE_ACTION) {
        flattenFormattedNavItems.value = flattenFormattedNavItems.value.map(
            (item) => {
                if (item._id === selectedNavItem.value?._id)
                    return { ...navItemStructure.value, _id: item._id };
                return item;
            }
        );
    }

    navStructure.value = setNavItemsStructure(
        sortedNavItems.value ?? formattedNavItems.value
    );

    const responseUpdateCategory = await Navigations.updateNavigation({
        id: navigationsList.value?._id,
        name: navName.value,
        structure: navStructure.value,
        locale: i18n.locale.value,
    });
    if (responseUpdateCategory) {
        getNavigationDetails(navNameSlug.value);
        handleCancel();
    }
};

// Update action selected before updating the navigation
const updateActionSelected = (item) => {
    selectedAction.value = UPDATE_ACTION;
    selectedNavItem.value = item;

    if (item.external) navItemType.value = IS_EXTERNAL_URL;
    else if (item.is_entry) navItemType.value = IS_ENTRY;
    else navItemType.value = IS_CATEGORY;

    navItemStructure.value.label = item.label;
    navItemStructure.value.url = item.url;
    navItemTypeEntry.value =
        formattedCategories.value.find((cat) => cat._id === item.entry_id) ||
        null;
    navItemStructure.value.entry_id = navItemTypeEntry.value?._id || "";
};

// Cancel
const handleCancel = () => {
    isFormValid.value = false;
    selectedNavItem.value = null;
    navItemTypeEntry.value = null;
    selectedAction.value = CREATE_ACTION;
    sortedNavItems.value = null;
    if (navFormRef.value) reset(navFormRef.value);
    navName.value = selectedNavigation.value;
};

// Watch the type of item (external, entry or category)
watch(navItemType, (newValueType) => {
    switch (newValueType) {
        case IS_EXTERNAL_URL:
            navItemStructure.value.external = true;
            navItemStructure.value.is_entry = false;
            navItemStructure.value.is_category = false;
            break;
        case IS_ENTRY:
            navItemStructure.value.external = false;
            navItemStructure.value.is_entry = true;
            navItemStructure.value.is_category = false;
            break;
        case IS_CATEGORY:
            navItemStructure.value.external = false;
            navItemStructure.value.is_entry = false;
            navItemStructure.value.is_category = true;
            break;
        default:
            navItemStructure.value.external = false;
            navItemStructure.value.is_entry = false;
            navItemStructure.value.is_category = false;
    }
});

// Check which entry is associated with the item (id, url)
watch(navItemTypeEntry, (newValue) => {
    navItemTypeEntry.value = newValue;
    if (navItemTypeEntry.value) {
        navItemStructure.value.entry_id = navItemTypeEntry.value._id;
        navItemStructure.value.url = navItemTypeEntry.value.slug;
    } else {
        navItemStructure.value.entry_id = "";
        navItemStructure.value.url = "";
    }
});

// Categories
const categoriesList = ref([]);
const formattedCategories = ref([]);

// Get categories
const categoryFullTree = async (parent_id, site_id) => {
    const responseCategoryFullTree = await Categories.categoryFullTree(
        parent_id,
        site_id
    );
    if (responseCategoryFullTree) {
        categoriesList.value = responseCategoryFullTree;
        formattedCategories.value = [];
        formatCategoriesList(categoriesList.value);
        isLoading.value = false;
    }
};

// Format the categories to display within the dropdown
const formatCategoriesList = (categoriesList) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            formatCategoriesList(cat.children);
        }

        return {
            ...cat,
            nameToDisplay: cat.name[i18n.locale.value],
        };
    });

    formattedCategories.value = [
        ...formattedCategories.value,
        ...formattedList,
    ].sort((a, b) => a.nameToDisplay.localeCompare(b.nameToDisplay));
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
        { title: i18n.t("navigations.title") },
    ]);

    store.setPageTitle(i18n.t("navigations.title"));
    document.title = i18n.t("navigations.title") + " — SailCMS";
};

onMounted(() => {
    getNavigationDetails(navNameSlug.value);
    setupPage();
    categoryFullTree("", siteId.value);
});
</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text__wrapper) {
    @apply tw-py-4;
}
</style>
