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
                                    ref="navItemTypeRef"
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
                                    ref="navItemTypeRef"
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
                                <NavNestedList
                                    :items="formattedNavItemsList"
                                    :key="navigationsKey"
                                    @edit-item="editActionSelected"
                                    @delete-item="deleteActionSelected"
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
import NavNestedList from "@/components/globals/navigations/NavNestedList.vue";

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
const navItemTypeRef = ref();

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

        formatNavItemsList(navigationsList.value.structure);
        navParentsList.value = formattedNavItemsList.value.sort((a, b) =>
            a.label.localeCompare(b.label)
        );
        isLoading.value = false;
    }
};

// Flatten the list + add id & parent_id to every nav items
let itemParentId: string = "";
const formatNavItemsList = (navItemsList: NavigationItem[]) => {
    const list = navItemsList.map((item) => {
        const itemId = uuidv4();
        if (item.children && item.children.length) {
            itemParentId = uuidv4();
            formatNavItemsList(item.children);
            return { ...item, id: itemParentId, parent_id: "" };
        }
        return { ...item, id: itemId, parent_id: itemParentId };
    });
    formattedNavItemsList.value = [...formattedNavItemsList.value, ...list];
};

// Assign the nav items to their parent + remove id & parent_id
const setNavStructure = (navItems: NavigationItem[]) => {
    // Group items together according to the parent_id
    const groupedList = navItems.reduce((group, item) => {
        const { id, parent_id, ...itemObject } = item;
        if (parent_id) {
            group[parent_id] = group[parent_id] ?? [];
            group[parent_id].push(itemObject);
        } else {
            group["root"] = group["root"] ?? [];
            group["root"].push(item);
        }
        return group;
    }, {});
    console.log("GROUP", groupedList);

    // Iterate through items and assign children according to the id
    const nestedList = navItems.flatMap((nav) => {
        if (groupedList[nav.id])
            nav = {
                ...nav,
                children: [...groupedList[nav.id]],
            };
        return nav;
    });
    console.log("NESTED", nestedList);

    // Return only top level items
    return nestedList
        .flatMap((el) => {
            return groupedList["root"].flatMap((rootItem) => {
                if (el.id === rootItem.id) {
                    const { id, parent_id, ...navItemObject } = el;
                    return navItemObject;
                }
            });
        })
        .filter((el) => el);
};

const updateNavItems = (
    navItems: NavigationItem[],
    sortedNavItems: SortedNavigationItem[]
): NavigationItem[] => {
    const updatedList = navItems.flatMap((item) => {
        // Check if parent_id has changed
        if (sortedNavItems && sortedNavItems.length) {
            const sortedList = sortedNavItems.flatMap((sortedItem) => {
                if (item.id === sortedItem.id)
                    return { ...item, parent_id: sortedItem.parent };
            });
            return sortedList.filter((el) => el);
        } else {
            // Check if item has been selected to edit
            if (item.id === selectedNavItem.value?.id) {
                item = {
                    ...navItemStructure.value,
                    id: selectedNavItem.value?.id,
                    parent_id: navItemParent.value?.id,
                };
            }
            return item;
        }
    });
    return updatedList as NavigationItem[];
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
        formattedNavItemsList.value.push(newItem);
        handleUpdateNavigation();
    }
};

// Update a navigation
const handleUpdateNavigation = async () => {
    formattedNavItemsList.value = updateNavItems(
        formattedNavItemsList.value,
        sortedNavigationsList.value
    );

    const navStructure = setNavStructure(formattedNavItemsList.value);
    console.log("STRUCTURE", navStructure);

    const responseUpdateCategory = await Navigations.updateNavigation({
        id: navigationsList.value?._id!,
        name: navName.value,
        structure: navStructure,
        locale: i18n.locale.value,
    });
    if (responseUpdateCategory) {
        getNavigationDetails(navNameSlug.value);
        navigationsKey.value += 1;
        handleCancel();
    }
};

// Edit action selected before updating the navigation
const editActionSelected = (item: NavigationItem) => {
    selectedAction.value = UPDATE_ACTION;
    selectedNavItem.value = item;
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

    if (item.external) navItemType.value = IS_EXTERNAL_URL;
    else if (item.is_entry) navItemType.value = IS_ENTRY;
    else navItemType.value = IS_CATEGORY;
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
};

// Watch the type of item (external, entry or category)
watch(navItemType, (newValueType) => {
    reset(navItemTypeRef.value);
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
