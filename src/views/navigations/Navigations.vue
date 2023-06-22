<template>
    <div v-if="!isLoading">
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" fluid>
                <v-row>
                    <v-col cols="12" xs="12" md="3">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <h3>
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

                                <v-autocomplete
                                    :label="
                                        $t('navigations.form.select_parent')
                                    "
                                    :items="navParentsList"
                                    v-model="navItemParent"
                                    item-title="label"
                                    return-object
                                    variant="outlined"
                                    density="comfortable"
                                    clearable
                                    :disabled="
                                        !navigationsList?.structure.length
                                    "
                                />

                                <div class="tw-flex tw-flex-col tw-gap-8">
                                    <v-btn
                                        v-if="selectedAction === CREATE_ACTION"
                                        type="submit"
                                        block
                                        color="primary"
                                        class="tw-w-full"
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
                                        class="tw-w-full"
                                    >
                                        {{
                                            $t(
                                                "navigations.form.edit_navigation_btn"
                                            )
                                        }}
                                    </v-btn>
                                    <v-btn
                                        @click="handleCancel"
                                        color="primary"
                                        class="tw-w-full"
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
                                        navigationsList &&
                                        navigationsList.structure.length
                                    "
                                    v-model:items="navigationsList.structure"
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
// Vue
import { ref, inject, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/store/app";
// Helpers & Libs
import type {
    NavigationItem,
    SortedNavigationItem,
    NavigationDetails,
} from "@/libs/graphql/types/navigations";
import type { Category } from "@/libs/graphql/types/categories";
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
import { Categories } from "@/libs/graphql";
import { v4 as uuidv4 } from "uuid";
// Components
import Loader from "@/components/globals/Loader.vue";
import NestedDraggable from "@/components/globals/nestedDraggable/NestedDraggable.vue";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref<boolean>(true);
const siteId = ref<string>(SailCMS.getSiteId());

const navigationsList = ref<NavigationDetails>();
const selectedNavigation = ref<string>("Header");
const sortedNavigationsList = ref<SortedNavigationItem[]>([]);
const selectedNavItem = ref<NavigationItem | null>(null);
const formattedNavItemsList = ref<NavigationItem[]>([]);
const navigationsKey = ref<number>(0);

// Template Refs
const navFormRef = ref();

// Constants
const IS_EXTERNAL_URL = "External url";
const IS_ENTRY = "Entry";
const IS_CATEGORY = "Category";
const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";

// Search & Validations
const isFormValid = ref<boolean>(false);
const selectedAction = ref<string>(CREATE_ACTION);
const navName = ref<string>("Header");
const navNameSlug = ref<string>(
    navName.value.toLowerCase().replaceAll(" ", "-")
);
const navItemStructure = ref<NavigationItem>({
    label: "",
    url: "",
    is_entry: false,
    is_category: false,
    entry_id: "",
    external: false,
    children: [],
});
const navItemType = ref<string | null>(null);

// TODO: Change for real Entry type once entries are created
interface Entry {
    id: string;
}
type NavItemType =
    | (Category & { nameToDisplay: string })
    | (Entry & { nameToDisplay: string });

const navItemTypeEntry = ref<NavItemType | null>(null);
const navItemParent = ref<NavigationItem | null>(null);
const navParentsList = ref<NavigationItem[]>([]);
const navFormValidations = {
    required: (value: string) => !!value || "Required",
};

// Reset
const reset = (input: any) => {
    input.reset();
};

// Emits
const emitter: any = inject("emitter");
emitter.on("update-list", (sortedList: SortedNavigationItem[]) => {
    sortedNavigationsList.value = sortedList;
    updateNavItemsList(
        formattedNavItemsList.value,
        sortedNavigationsList.value
    );
    handleUpdateNavigation();
});
emitter.on("edit-item", (navItem: NavigationItem) =>
    editActionSelected(navItem)
);
emitter.on("delete-item", (navItem: NavigationItem) =>
    deleteActionSelected(navItem)
);

// Return the locale as string
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Get the navigations list
const getNavigationDetails = async (name: string) => {
    const responseNavigationDetails = await Navigations.navigationDetails(name);
    if (responseNavigationDetails) {
        navigationsList.value = responseNavigationDetails;
        formatNavItemsList(navigationsList.value.structure, "");
        navParentsList.value = formattedNavItemsList.value.sort((a, b) =>
            a.label.localeCompare(b.label)
        );
        isLoading.value = false;
    }
};

// Flatten the list + add id & parent_id to every nav items
const formatNavItemsList = (
    navItemsList: NavigationItem[],
    parentId: string
) => {
    const list = navItemsList.map((item) => {
        const itemId = uuidv4();
        if (item.children && item.children.length) {
            formatNavItemsList(item.children, itemId);
        }
        return {
            ...item,
            id: itemId,
            parent_id: parentId,
            order: navItemsList.indexOf(item) + 1,
        };
    });

    formattedNavItemsList.value = [...formattedNavItemsList.value, ...list];
};

// Update the list if an item has been moved or edited
const updateNavItemsList = (
    navItems: NavigationItem[],
    sortedNavItems: SortedNavigationItem[]
) => {
    navItems.forEach((item) => {
        // Check if parent_id has changed
        sortedNavItems.forEach((sortedItem) => {
            if (item.id === sortedItem.id) {
                item.parent_id = sortedItem.parent_id || "";
                item.order = sortedItem.order;
            }
        });
    });
};

// Group items together according to parent_id
const makeIndex = (items: NavigationItem[], indexer: Function) => {
    const append = (group, parentId: string, navItem: NavigationItem) => {
        return group.set(
            parentId,
            (group.get(parentId) || []).concat([navItem])
        );
    };
    return items.reduce(
        (group, navItem) => append(group, indexer(navItem), navItem),
        new Map()
    );
};

// Assign the nav items to their parent
const setNavStructure = (group, root = "") => {
    const many = (all = []) => all.map(one);
    const one = (navItem = {}) => ({
        ...navItem,
        children: many(group.get(navItem.id)),
    });

    return many(group.get(root));
};

// Remove id, parent_id & order from items
const formatNavStructure = (structure: NavigationItem[]) => {
    structure.sort((a, b) => a.order! - b.order!);
    structure.forEach((el) => {
        if (el.children && el.children.length) formatNavStructure(el.children);
        delete el.id;
        delete el.parent_id;
        delete el.order;
    });
};

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
            id: uuidv4(),
            parent_id: navItemParent.value?.id || "",
        };
        formattedNavItemsList.value = [...formattedNavItemsList.value, newItem];
        handleUpdateNavigation();
    }
};

// Update a navigation
const handleUpdateNavigation = async () => {
    if (selectedNavItem.value) {
        formattedNavItemsList.value = formattedNavItemsList.value.map((el) => {
            if (el.id === selectedNavItem.value!.id!) {
                return (el = {
                    ...navItemStructure.value,
                    id: selectedNavItem.value?.id,
                    parent_id: navItemParent.value?.id || "",
                });
            }
            return el;
        });
    }

    const navStructure = setNavStructure(
        makeIndex(
            formattedNavItemsList.value,
            (navItem: NavigationItem) => navItem.parent_id
        )
    );

    formatNavStructure(navStructure);

    const responseUpdateCategory = await Navigations.updateNavigation({
        id: navigationsList.value?._id!,
        name: navName.value,
        structure: navStructure,
        locale: i18n.locale.value,
    });
    if (responseUpdateCategory) {
        formattedNavItemsList.value = [];
        getNavigationDetails(navNameSlug.value);
        navigationsKey.value += 1;
        handleCancel();
    }
};

// Edit action selected before updating the navigation
const editActionSelected = (item: NavigationItem) => {
    selectedAction.value = UPDATE_ACTION;
    selectedNavItem.value = item;

    if (item.external) navItemType.value = IS_EXTERNAL_URL;
    else if (item.is_entry) navItemType.value = IS_ENTRY;
    else navItemType.value = IS_CATEGORY;

    navItemStructure.value.label = item.label;
    navItemStructure.value.url = item.url;
    navItemParent.value =
        formattedNavItemsList.value.find((el) => el.id === item.parent_id) ||
        null;
    navParentsList.value = navParentsList.value.filter(
        (nav) => nav.id !== selectedNavItem.value?.id
    );
    navItemTypeEntry.value =
        formattedCategories.value.find((cat) => cat._id === item.entry_id) ||
        null;
    navItemStructure.value.entry_id = navItemTypeEntry.value?._id! || "";
};

// Delete action selected before updating the navigation
const deleteActionSelected = (item: NavigationItem) => {
    selectedNavItem.value = item;
    formattedNavItemsList.value = formattedNavItemsList.value.filter(
        (el) => el.id !== selectedNavItem.value?.id
    );
    handleUpdateNavigation();
};

// Cancel
const handleCancel = () => {
    isFormValid.value = false;
    selectedNavItem.value = null;
    navItemTypeEntry.value = null;
    navItemParent.value = null;
    navParentsList.value = formattedNavItemsList.value.sort((a, b) =>
        a.label.localeCompare(b.label)
    );
    sortedNavigationsList.value = [];
    selectedAction.value = CREATE_ACTION;
    reset(navFormRef.value);
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

watch(navItemTypeEntry, (newValue) => {
    navItemTypeEntry.value = newValue;
    if (navItemTypeEntry.value) {
        navItemStructure.value.entry_id = navItemTypeEntry.value._id;
        navItemStructure.value.url = navItemTypeEntry.value.slug;
    }
});

watch(navigationsList.value?.structure!, (newValue) => {
    console.log("VALUE", newValue);
});

// Categories
const categoriesList = ref<Category[]>([]);

interface FormattedCategories extends Category {
    nameToDisplay: string;
}
const formattedCategories = ref<FormattedCategories[]>([]);

// Get categories
const categoryFullTree = async (parent_id: string, site_id: string) => {
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
const formatCategoriesList = (categoriesList: Category[]) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            formatCategoriesList(cat.children);
        }

        return {
            ...cat,
            nameToDisplay: cat.name[getLocale()],
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
