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
                                    clearable
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
                                    v-model="navItemTypeObject"
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
                                    :disabled="
                                        !navigationDetails?.structure.length
                                    "
                                />

                                <div class="tw-flex tw-flex-col tw-gap-8">
                                    <v-btn
                                        v-if="!selectedNavigation"
                                        type="submit"
                                        block
                                        color="primary"
                                        class="tw-w-full"
                                        @click="handleAddNavigation"
                                    >
                                        {{
                                            $t(
                                                "navigations.form.add_navigation_btn"
                                            )
                                        }}
                                    </v-btn>
                                    <v-btn
                                        v-else
                                        @click="handleEditNavigation"
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
                                    @edit-item="handleEditNavItem"
                                    @delete-item="handleDeleteNavItem"
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
import NestedList from "@/components/globals/navigations/NestedList.vue";
import NavNestedList from "@/components/globals/navigations/NavNestedList.vue";

const store = useAppStore();
const i18n = useI18n();
const isLoading = ref<boolean>(true);
const siteId = ref<string>(SailCMS.getSiteId());

const navigationsList = ref<NavigationItem[]>([]);
const sortedNavigationsList = ref<SortedNavigationItem[]>([]);
const navigationDetails = ref<NavigationDetails>();
const navigationFullStructure = ref<NavigationItem[]>([]);
const selectedNavigation = ref<string>("Header");
const selectedNavItem = ref<NavigationItem | null>(null);
const formattedNavItemsList = ref<NavigationItem[]>([]);

// Template Refs
const navFormRef = ref();
const navItemTypeRef = ref();

// Constants
const IS_EXTERNAL_URL = "External url";
const IS_ENTRY = "Entry";
const IS_CATEGORY = "Category";

// Search & Validations
const isFormValid = ref<boolean>(false);
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
    external: true,
    children: [],
});
const navItemType = ref<string | null>(null);

// TODO: Change for real Entry type once entries are created
interface Entry {
    id: string;
}
type NavItemType = Category & Entry & { nameToDisplay: string };
const navItemTypeObject = ref<NavItemType | { nameToDisplay: string } | null>(
    null
);
const navItemTypeLink = ref<{
    type: string | null;
    selection: Category | { name: string } | null;
}>({
    type: null,
    selection: null,
});
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
    const structure = setNavStructure(
        formattedNavItemsList.value,
        sortedNavigationsList.value
    );
    console.log("STRUCTURE", structure);

    /* navigationFullStructure.value = formatNavFullStructure(structure);
    handleEditNavigation(); */
});

// Return the locale as string
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Get the navigations list
const getNavigationDetails = async (name: string) => {
    const responseNavigationDetails = await Navigations.navigationDetails(name);
    if (responseNavigationDetails) {
        navigationDetails.value = responseNavigationDetails;
        formatNavItemsList(navigationDetails.value.structure);
        navParentsList.value = formattedNavItemsList.value.sort((a, b) =>
            a.label.localeCompare(b.label)
        );
        isLoading.value = false;
    }
};

// Flatten the list + add id & parent_id to every nav items
const formatNavItemsList = (navItemsList: NavigationItem[]) => {
    const list = navItemsList.map((item) => {
        const currentItemId = uuidv4();
        if (item.children && item.children.length) {
            formatNavItemsList(item.children);
            return { ...item, id: uuidv4(), parent_id: currentItemId };
        }
        return { ...item, id: currentItemId, parent_id: "" };
    });
    formattedNavItemsList.value = [...formattedNavItemsList.value, ...list];
};

// Remove useless keys from items (id, parent_id) once structure is complete
const formatNavFullStructure = (navStructure: NavigationItem[]) => {
    const formattedStructure = navStructure.map((item) => {
        if (item.children && item.children.length) {
            formatNavFullStructure(item.children);
            const formattedChildren = item.children.map((child) => {
                const { id, parent_id, ...itemObject } = child;
                return itemObject;
            });
            item.children = [...formattedChildren];
        }
        const { id, parent_id, ...itemObject } = item;
        return itemObject;
    });
    return formattedStructure;
};

// Sort the nav items & assign them to their parent
const setNavStructure = (
    formattedNavItems: NavigationItem[],
    sortedNavItems: SortedNavigationItem[]
): NavigationItem[] => {
    const list = formattedNavItems.flatMap((item) => {
        const nestedList = sortedNavItems.map((sortedItem) => {
            if (item.id === sortedItem.parent) {
                const navItemObject = formattedNavItems.find(
                    (el) => el.id === sortedItem.id
                );
                if (navItemObject) {
                    item.children.push({
                        ...navItemObject,
                        parent_id: item.id,
                    });
                    return item;
                }
            }
        });
        return nestedList;
    });

    return list.filter((el) => el) as NavigationItem[];
};

// Add a navigation
const handleAddNavigation = async () => {
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

// Edit a navigation
const handleEditNavigation = async () => {
    const responseUpdateCategory = await Navigations.updateNavigation({
        id: navigationDetails.value?._id!,
        name: navName.value,
        structure:
            navigationFullStructure.value ||
            navigationDetails.value?.structure!,
        locale: i18n.locale.value,
    });
    if (responseUpdateCategory) {
        getNavigationDetails(navNameSlug.value);
        handleCancel();
    }
};

const handleEditNavItem = (item: NavigationItem) => {
    selectedNavItem.value = item;
    navItemStructure.value.label = item.label;
    navItemStructure.value.url = item.url;
    console.log("EDIT ITEM", item);
};

const handleDeleteNavItem = (item: NavigationItem) => {
    selectedNavItem.value = item;
    console.log("DELETE ITEM", item);
};

// Cancel
const handleCancel = () => {
    isFormValid.value = false;
    selectedNavItem.value = null;
    navItemTypeObject.value = null;
    navItemTypeLink.value = { type: null, selection: null };
    reset(navFormRef.value);
};

watch(navItemType, (newValueType) => {
    reset(navItemTypeRef.value);
    navItemStructure.value.is_entry = newValueType === "Entry" ? true : false;
    navItemStructure.value.external = !navItemStructure.value.is_entry;
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
