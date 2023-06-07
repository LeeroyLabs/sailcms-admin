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
                                >
                                    <template v-slot:append-inner>
                                        <div class="tw-opacity-[0.20]">
                                            <v-icon
                                                icon="mdi-keyboard-return"
                                            />
                                        </div>
                                    </template>
                                </v-text-field>

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
                                >
                                    <template v-slot:append-inner>
                                        <div class="tw-opacity-[0.20]">
                                            <v-icon
                                                icon="mdi-keyboard-return"
                                            />
                                        </div>
                                    </template>
                                </v-text-field>

                                <v-select
                                    clearable
                                    :label="$t('categories.form.select_parent')"
                                    variant="outlined"
                                    density="comfortable"
                                    :items="[
                                        IS_EXTERNAL_URL,
                                        IS_ENTRY,
                                        IS_CATEGORY,
                                    ]"
                                    v-model="navItemType"
                                />

                                <v-autocomplete
                                    v-if="
                                        navItemType &&
                                        navItemType !== IS_EXTERNAL_URL
                                    "
                                    ref="navItemTypeRef"
                                    :label="$t('categories.form.select_parent')"
                                    :items="
                                        navItemType === 'Entry'
                                            ? ['Entry 1', 'Entry 2', 'Entry 3']
                                            : formattedCategories
                                    "
                                    v-model="navItemUrl"
                                    item-title="name"
                                    item-value="id"
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
                                >
                                    <template v-slot:append-inner>
                                        <div class="tw-opacity-[0.20]">
                                            <v-icon
                                                icon="mdi-keyboard-return"
                                            />
                                        </div>
                                    </template>
                                </v-text-field>

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
                                    <!--                                 <v-btn
                                       v-else
                                       @click="
                                           handleEditCategory(selectedNavigation!)
                                       "
                                       type="submit"
                                       block
                                       color="primary"
                                       class="tw-w-full"
                                   >
                                       {{
                                           $t("categories.form.edit_category_btn")
                                       }}
                                   </v-btn> -->
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
                                <NestedList
                                    :navStructure="navigationDetails!.structure"
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
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
// Helpers & Libs
import type {
    NavigationItem,
    NavigationDetails,
} from "@/libs/graphql/types/navigations";
import type { Category } from "@/libs/graphql/types/categories";
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
import { Categories } from "@/libs/graphql";
// Components
import Loader from "@/components/globals/Loader.vue";
import NestedList from "@/components/globals/navigations/NestedList.vue";

const i18n = useI18n();
const isLoading = ref<boolean>(true);
const siteId = ref<string>(SailCMS.getSiteId());
const navigationsList = ref<NavigationItem[]>([]);
const navigationDetails = ref<NavigationDetails>();
const selectedNavigation = ref<NavigationItem | null>(null);
const selectedNavItem = ref<NavigationItem | null>(null);

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
    entry_id: "",
    external: true,
    children: [],
});
const navItemType = ref<string | null>(null);
const navItemUrl = ref<string | null>(null);
const navFormValidations = {
    required: (value: string) => !!value || "Required.",
};

// Reset
const reset = (input: any) => {
    input.reset();
};

// Return the locale as string
const getLocale = () => (i18n.locale.value === "en" ? "en" : "fr");

// Get the navigations
const getNavigation = async (name: string) => {
    const responseNavigation = await Navigations.navigation(name);
    if (responseNavigation) {
        navigationsList.value = responseNavigation;
        console.log("LIST", navigationsList.value);
        categoryFullTree("", siteId.value);
        isLoading.value = false;
    }
};

const getNavigationDetails = async (name: string) => {
    const responseNavigationDetails = await Navigations.navigationDetails(name);
    if (responseNavigationDetails) {
        navigationDetails.value = responseNavigationDetails;
        console.log("LIST", navigationDetails.value);
        categoryFullTree("", siteId.value);
        isLoading.value = false;
    }
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
            console.log("RESPONSE", responseAddCategory);
        }
    }
};

const handleEditNavItem = (item: NavigationItem) => {
    selectedNavItem.value = item;
    console.log("EDIT", item);
};

const handleDeleteNavItem = (item: NavigationItem) => {
    selectedNavItem.value = item;
    console.log("DELETE", item);
};

// Cancel
const handleCancel = () => {
    isFormValid.value = false;
    selectedNavItem.value = null;
    reset(navFormRef.value);
};

watch(navItemType, (newValue) => {
    reset(navItemTypeRef.value);
    navItemStructure.value.is_entry = newValue === "Entry" ? true : false;
    navItemStructure.value.external = !navItemStructure.value.is_entry;
});

// Categories
const categoriesList = ref<Category[]>([]);
const formattedCategories = ref<
    {
        id: string;
        name: string;
    }[]
>([]);

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

// Format the categories to display within the parent id dropdown
const formatCategoriesList = (categoriesList: Category[]) => {
    const formattedList = categoriesList.map((cat) => {
        if (cat.children && cat.children.length) {
            formatCategoriesList(cat.children);
        }

        return {
            id: cat._id,
            name: cat.name[getLocale()],
        };
    });

    formattedCategories.value = [
        ...formattedCategories.value,
        ...formattedList,
    ].sort((a, b) => a.name.localeCompare(b.name));
};

onMounted(() => {
    //getNavigation(navNameSlug.value);
    getNavigationDetails(navNameSlug.value);
});
</script>

<style lang="scss" scoped>
:deep(.v-expansion-panel-text__wrapper) {
    @apply tw-py-4;
}
</style>
