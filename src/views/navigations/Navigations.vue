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
                                    !selectedNavigation
                                        ? $t("navigations.form.title_add")
                                        : $t("navigations.form.title_edit")
                                }}
                            </h3>
                            <v-form
                                ref="categoryForm"
                                @submit.prevent
                                v-model="isFormValid"
                                class="tw-flex tw-flex-col tw-gap-4"
                            >
                                <v-text-field
                                    color="primary"
                                    :label="$t(`navigations.form.label`)"
                                    variant="outlined"
                                    :hide-details="true"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    required
                                    :rules="navigationNameRules"
                                    v-model="navigationStructureInput.label"
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
                                    :label="$t(`navigations.form.url`)"
                                    variant="outlined"
                                    :hide-details="true"
                                    type="text"
                                    clearable
                                    density="comfortable"
                                    required
                                    :rules="navigationNameRules"
                                    v-model="navigationStructureInput.url"
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

                                <v-btn
                                    v-if="!selectedNavigation"
                                    @click="
                                        handleAddNavigation(
                                            navigationNameInput,
                                            navigationStructureInput,
                                            siteId
                                        )
                                    "
                                    type="submit"
                                    block
                                    color="primary"
                                    class="tw-w-full"
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
                            </v-form>
                        </div>
                    </v-col>

                    <v-col cols="12" xs="12" md="9">
                        <div class="tw-flex tw-flex-col tw-gap-4">
                            <v-card class="tw-p-4 tw-h-[80vh] tw-overflow-auto">
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
import { ref, onMounted } from "vue";
// Helpers & Libs
import type { NavigationItem } from "@/libs/graphql/types/navigations";
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
// Components
import Loader from "@/components/globals/Loader.vue";

const isLoading = ref<boolean>(true);
const navigations = ref<NavigationItem[]>([]);
const selectedNavigation = ref<NavigationItem | null>(null);
const siteId = ref<string>(SailCMS.getSiteId());

// Search & Validations
const isFormValid = ref<boolean>(false);
const navigationNameInput = ref<string>("");
const navigationStructureInput = ref<NavigationItem>({
    label: "",
    url: "",
    is_entry: false,
    entry_id: "",
    external: false,
    children: [],
});
const navigationNameRules = [
    (value: string) => {
        if (value) return true;
        return "Name is requred.";
    },
];

const getNavigation = async (name: string) => {
    const responseNavigation = await Navigations.navigation(name);
    if (responseNavigation) {
        navigations.value = responseNavigation;
        isLoading.value = false;
    }
};

// Add a category
const handleAddNavigation = async (
    name: string,
    structure: NavigationItem,
    locale: string
) => {
    if (isFormValid.value) {
        const responseAddCategory = await Navigations.updateNavigation({
            name,
            structure,
            locale,
        });
        if (responseAddCategory) {
            handleCancel();
            console.log("RESPONSE", responseAddCategory);
        }
    }
};

// Cancel
const handleCancel = () => {
    isFormValid.value = false;
};

onMounted(() => getNavigation(""));
</script>

<style lang="scss" scoped></style>
