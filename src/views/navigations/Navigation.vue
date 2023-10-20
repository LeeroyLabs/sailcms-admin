<template>
    <div v-if="isReady">
        <BackButton :url="{ name: 'Navigations' }" />

        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" fluid>
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-form
                                ref="navFormRef"
                                class="tw-flex tw-flex-col tw-gap-4"
                                @submit.prevent
                            >
                                <v-text-field
                                    color="primary"
                                    :label="$t('navigation.form.title')"
                                    variant="outlined"
                                    type="text"
                                    density="comfortable"
                                    :hide-details="true"
                                    disabled
                                    v-model="navigationTitle"
                                />

                                <v-text-field
                                    color="primary"
                                    :label="$t('navigation.form.label')"
                                    variant="outlined"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    :hide-details="true"
                                    :rules="[navFormValidations.required]"
                                    v-model="navItemStructure.label"
                                />

                                <v-select
                                    :label="$t('navigation.form.select_type')"
                                    variant="outlined"
                                    density="comfortable"
                                    :hide-details="true"
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
                                            ? $t('navigation.form.select_entry')
                                            : $t(
                                                  'navigation.form.select_category'
                                              )
                                    "
                                    :items="
                                        navItemType === IS_ENTRY
                                            ? entriesList
                                            : formattedCategories
                                    "
                                    v-model="navItemTypeEntry"
                                    clearable
                                    :hide-details="true"
                                    item-title="nameToDisplay"
                                    return-object
                                    variant="outlined"
                                    density="comfortable"
                                    :rules="[navFormValidations.required]"
                                />

                                <v-text-field
                                    v-else
                                    color="primary"
                                    :label="$t('navigation.form.url')"
                                    variant="outlined"
                                    type="text"
                                    clearable
                                    :hide-details="true"
                                    density="comfortable"
                                    :rules="
                                        navItemType
                                            ? [navFormValidations.required]
                                            : []
                                    "
                                    v-model="navItemStructure.url"
                                    :disabled="navItemType !== IS_EXTERNAL_URL"
                                />

                                <div
                                    class="tw-flex tw-items-center tw-flex-wrap"
                                >
                                    <v-btn
                                        v-if="selectedAction === CREATE_ACTION"
                                        type="submit"
                                        color="primary"
                                        @click="handleCreateNavigationItem"
                                    >
                                        {{
                                            $t(
                                                "navigation.form.add_navigation_btn"
                                            )
                                        }}
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        type="submit"
                                        @click="handleUpdateNavigation"
                                        color="primary"
                                    >
                                        {{
                                            $t(
                                                "navigation.form.edit_navigation_btn"
                                            )
                                        }}
                                    </v-btn>

                                    <v-btn
                                        @click="handleCancel"
                                        variant="text"
                                        class="tw-ml-2"
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
                                <NestedDraggable
                                    v-if="
                                        formattedNavItems &&
                                        formattedNavItems.length
                                    "
                                    :items="formattedNavItems"
                                    :displayedOption="(item) => item.label"
                                    :isParent="true"
                                    :modalMsg="$t('navigation.confirm_msg')"
                                    :key="navigationsKey"
                                    @update-list="handleUpdateList"
                                    @delete-item="handleUpdateList"
                                />
                                <span v-else>
                                    {{ $t("navigations.no_navigations") }}</span
                                >
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
import { useRoute } from "vue-router";
// Helpers & Libs
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
import { Categories } from "@/libs/graphql";
import { v4 as uuidv4 } from "uuid";
// Components
import Loader from "@/components/globals/Loader.vue";
import NestedDraggable from "@/components/globals/nestedDraggable/NestedDraggable.vue";
import BackButton from "@/components/globals/BackButton.vue";

const store = useAppStore();
const i18n = useI18n();
const route = useRoute();
const isReady = ref(false);
const siteId = ref(SailCMS.getSiteId());

const navigation = ref();
const navigationTitle = ref("");
const navStructure = ref([]);
const selectedNavItem = ref(null);
const navigationsKey = ref(0);
const formattedNavItems = ref([]);
const flattenFormattedNavItems = ref([]);
const sortedNavItems = ref(null);

// Constants
const IS_EXTERNAL_URL = "External url";
const IS_ENTRY = "Entry";
const IS_CATEGORY = "Category";
const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const UPDATE_LIST_ACTION = "update-list";
const DELETE_ACTION = "delete";

// Form & Validations
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

const selectedAction = ref(CREATE_ACTION);

// Template Refs
const navFormRef = ref(null);

// Emits
const emitter = inject("emitter");
emitter.on("update-item", (navItem) => {
    updateActionSelected(navItem);
});
emitter.on("delete-item", async (data) => {
    sortedNavItems.value = data.structure;
    selectedAction.value = DELETE_ACTION;
    if (navFormRef.value) {
        await navFormRef.value.reset();
    }
    handleUpdateNavigation();
});
const handleUpdateList = async (structure) => {
    sortedNavItems.value = structure;
    selectedAction.value = UPDATE_LIST_ACTION;
    if (navFormRef.value) {
        await navFormRef.value.reset();
    }
    handleUpdateNavigation();
};

// Get the details of the navigation
const getNavigationDetails = async (slug) => {
    const responseNavigationDetails = await Navigations.navigationDetails(slug);
    if (responseNavigationDetails) {
        navigation.value = responseNavigationDetails;
        navigationTitle.value = navigation.value.title;
        navStructure.value = navigation.value.structure;

        formattedNavItems.value = formatNavItems(navigation.value.structure);
        flattenFormattedNavItems.value = [];
        flatFormattedNavItems(formattedNavItems.value);
        navigationsKey.value += 1;
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
// Create a navigation item
const handleCreateNavigationItem = async () => {
    const status = await navFormRef.value.validate();
    if (!status.valid) return;

    const newItem = {
        ...navItemStructure.value,
        _id: uuidv4(),
    };

    formattedNavItems.value = [newItem, ...formattedNavItems.value];
    flattenFormattedNavItems.value = [];
    flatFormattedNavItems(formattedNavItems.value);
    handleUpdateNavigation();
};

// UPDATE
// Update a navigation
const handleUpdateNavigation = async () => {
    if (selectedAction.value === UPDATE_ACTION) {
        const status = await navFormRef.value.validate();
        if (!status.valid) return;

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
        id: navigation.value?._id,
        title: navigation.value?.title,
        slug: navigation.value?.slug,
        structure: navStructure.value,
        locale: i18n.locale.value,
    });
    if (responseUpdateCategory) {
        getNavigationDetails(navigation.value.slug);
        handleCancel();
    }
};

// Update action selected before updating the navigation
const updateActionSelected = async (item) => {
    selectedAction.value = UPDATE_ACTION;
    selectedNavItem.value = item;

    if (selectedNavItem.value.external) navItemType.value = IS_EXTERNAL_URL;
    else if (selectedNavItem.value.is_entry) navItemType.value = IS_ENTRY;
    else navItemType.value = IS_CATEGORY;

    navItemStructure.value.label = selectedNavItem.value.label;
    navItemStructure.value.url = selectedNavItem.value.url;
    navItemStructure.value.entry_id = selectedNavItem.value.entry_id;

    await navFormRef.value.validate();
};

// Cancel
const handleCancel = () => {
    selectedNavItem.value = null;
    navItemStructure.value = {
        label: "",
        url: "",
        is_entry: false,
        is_category: false,
        entry_id: "",
        external: false,
        children: [],
    };
    navItemTypeEntry.value = null;
    selectedAction.value = CREATE_ACTION;
    sortedNavItems.value = null;

    navFormRef.value.reset();
    navFormRef.value.resetValidation();

    navigationTitle.value = navigation.value.title;
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

            navItemTypeEntry.value =
                entriesList.value.find(
                    (entry) => entry._id === selectedNavItem.value?.entry_id
                ) || null;
            break;
        case IS_CATEGORY:
            navItemStructure.value.external = false;
            navItemStructure.value.is_entry = false;
            navItemStructure.value.is_category = true;

            navItemTypeEntry.value =
                formattedCategories.value.find(
                    (cat) => cat._id === selectedNavItem.value?.entry_id
                ) || null;
            break;
        default:
            navItemStructure.value.external = false;
            navItemStructure.value.is_entry = false;
            navItemStructure.value.is_category = false;
    }
});

// Check which entry is associated with the item & update navItemStructure (id, url)
watch(navItemTypeEntry, (newValue) => {
    navItemTypeEntry.value = newValue;
    if (navItemTypeEntry.value) {
        navItemStructure.value.entry_id = navItemTypeEntry.value._id;
        navItemStructure.value.url = navItemTypeEntry.value.slug;
    }
});

// Update navItemTypeEntry when clicking on item
watch(selectedNavItem, (newValue) => {
    selectedNavItem.value = newValue;

    if (selectedNavItem.value && selectedNavItem.value.is_category) {
        navItemTypeEntry.value =
            formattedCategories.value.find(
                (cat) => cat._id === selectedNavItem.value?.entry_id
            ) || null;
    }
    if (selectedNavItem.value && selectedNavItem.value.is_entry) {
        navItemTypeEntry.value =
            entriesList.value.find(
                (entry) => entry._id === selectedNavItem.value?.entry_id
            ) || null;
    }
});

/* TODO: Fill entriesList with data when Entries are ready */
// Entries
const entriesList = ref([
    {
        nameToDisplay: "Entry 1",
        _id: "1",
        slug: "/slug-1",
    },
    {
        nameToDisplay: "Entry 2",
        _id: "2",
        slug: "/slug-2",
    },
    {
        nameToDisplay: "Entry 3",
        _id: "3",
        slug: "/slug-3",
    },
]);

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

onMounted(async () => {
    setupPage();

    const results = await Promise.allSettled([
        getNavigationDetails(route.params.slug),
        categoryFullTree("", siteId.value),
    ]);
    if (results) isReady.value = true;
});
</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text__wrapper) {
    @apply tw-py-4;
}
</style>
