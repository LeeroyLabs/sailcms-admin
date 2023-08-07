<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click="showModal = true" color="primary">
                {{ $t("navigations.add") }}
            </v-btn>
        </Teleport>

        <v-table class="utable">
            <thead>
                <tr>
                    <SmartTH
                        :text="$t('navigations.columns.title')"
                        :sortable="true"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'title' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'title' &&
                            currentSortingDir === 'ASC'
                        "
                        @sort="setSorting('title')"
                    />
                    <th class="tw-text-center">
                        {{ $t("navigations.columns.slug") }}
                    </th>
                    <th class="tw-text-center"></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="nav in navigationsList" :key="nav._id">
                    <td>
                        <router-link
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{
                                'hover:tw-text-white':
                                    $vuetify.theme.name !== 'light',
                            }"
                            :to="{
                                name: 'Navigation',
                                params: { slug: nav.slug },
                            }"
                        >
                            {{ nav.title }}
                        </router-link>
                    </td>
                    <td>{{ nav.slug }}</td>
                    <td class="tw-relative">
                        <div
                            class="tw-flex tw-gap-2 tw-absolute tw-top-2/4 tw--translate-y-2/4 tw-right-4"
                        >
                            <v-icon
                                icon="mdi-square-edit-outline"
                                size="22"
                                class="icon icon-edit tw-cursor-pointer"
                                @click="selectAction(nav, UPDATE)"
                            />
                            <v-icon
                                icon="mdi-trash-can-outline"
                                size="22"
                                class="icon icon-delete tw-cursor-pointer"
                                @click="selectAction(nav, DELETE)"
                            />
                        </div>
                    </td>
                </tr>

                <tr v-if="!navigationsList.length">
                    <td colspan="7" class="tw-text-center tw-font-medium">
                        {{ $t("navigations.no_navigations") }}
                    </td>
                </tr>
            </tbody>
        </v-table>
    </div>

    <Loader v-else />

    <Transition>
        <DeleteConfirmation
            v-if="showDeleteConfirm"
            :show="true"
            :overall="true"
            :title="$t('navigations.confirm')"
            :loading="applyingAction"
            :message="$t('navigations.confirm_msg')"
            @cancel="showDeleteConfirm = false"
            @accept="applyAction"
        />
    </Transition>

    <Transition>
        <Modal
            v-if="showModal"
            :title="
                selectedAction === CREATE
                    ? $t('navigations.add_navigation')
                    : $t('navigations.update_navigation')
            "
            :message="
                selectedAction === CREATE
                    ? $t('navigations.add_navigation_msg')
                    : $t('navigations.update_navigation_msg')
            "
        >
            <template v-slot:content>
                <v-form
                    ref="navFormRef"
                    class="tw-flex tw-flex-col tw-gap-4"
                    @submit.prevent
                    v-model="isFormValid"
                >
                    <v-text-field
                        color="primary"
                        :label="$t('navigations.navigation_title')"
                        variant="outlined"
                        type="text"
                        clearable
                        density="comfortable"
                        :hide-details="true"
                        :rules="[rules.required]"
                        v-model="navigationInput.title"
                    />
                    <v-text-field
                        color="primary"
                        :label="$t('navigations.navigation_slug')"
                        variant="outlined"
                        type="text"
                        clearable
                        density="comfortable"
                        :hide-details="true"
                        :rules="[rules.required]"
                        v-model="navigationInput.slug"
                    />

                    <v-card-actions class="tw-p-0 tw-justify-end">
                        <v-btn :disabled="applyingAction" @click="handleReset">
                            {{ $t("navigations.cancel") }}
                        </v-btn>
                        <v-btn
                            type="submit"
                            variant="flat"
                            color="primary"
                            :loading="applyingAction"
                            @click="applyAction"
                        >
                            {{ $t("navigations.save") }}
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </template>
        </Modal>
    </Transition>
</template>

<script setup>
// Vue
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
// Helpers & Libs
import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";
// Components
import Loader from "@/components/globals/Loader.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";
import Modal from "@/components/globals/Modal.vue";

const siteId = ref(SailCMS.getSiteId());
const i18n = useI18n();
const router = useRouter();
const isReady = ref(false);

// Template Refs
const navFormRef = ref(null);

// Constants
const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";

const navigationsList = ref([]);
const selectedNavigation = ref(null);
const navigationInput = ref({
    title: "",
    slug: "",
});
const selectedAction = ref(CREATE);

// Form & Validations
const isFormValid = ref(false);
const rules = {
    required: (value) => !!value || "Required",
};

// Modals
const showDeleteConfirm = ref(false);
const showModal = ref(false);
const applyingAction = ref(false);

// Get the list of navigations
const navigationDetailsList = async () => {
    isReady.value = false;
    const responseNavigationDetailsList =
        await Navigations.navigationDetailsList(
            currentSorting.value,
            currentSortingDir.value,
            i18n.locale.value,
            siteId.value
        );
    if (responseNavigationDetailsList) {
        navigationsList.value = responseNavigationDetailsList;
        isReady.value = true;
    }
};

// CREATE
const handleCreateNavigation = async () => {
    if (isFormValid.value) {
        applyingAction.value = true;
        const responseCreateNavigation = await Navigations.createNavigation({
            title: navigationInput.value.title,
            slug: navigationInput.value.slug,
            structure: [],
            locale: i18n.locale.value,
            site_id: siteId.value,
        });
        if (responseCreateNavigation) {
            router.push({
                name: "Navigation",
                params: { slug: responseCreateNavigation },
            });
            handleReset();
            applyingAction.value = false;
        }
    }
};

// UPDATE
const handleUpdateNavigation = async () => {
    if (applyingAction.value) return;

    if (isFormValid.value) {
        applyingAction.value = true;
        const responseUpdateNavigation = await Navigations.updateNavigation({
            id: selectedNavigation.value._id,
            title: selectedNavigation.value.title,
            slug: navigationInput.value.slug,
            structure: selectedNavigation.value.structure,
            locale: i18n.locale.value,
        });
        if (responseUpdateNavigation) {
            navigationDetailsList();
            handleReset();
            applyingAction.value = false;
        }
    }
};

// DELETE
const handleDeleteNavigation = async () => {
    const responseDeleteNavigation = await Navigations.deleteNavigation(
        selectedNavigation.value._id
    );
    if (responseDeleteNavigation) {
        navigationDetailsList();
        handleReset();
    }
};

const handleReset = () => {
    selectedNavigation.value = null;
    selectedAction.value = CREATE;
    navigationInput.value.title = "";
    navigationInput.value.slug = "";
    showModal.value = false;
    showDeleteConfirm.value = false;
};

const selectAction = (nav, action) => {
    selectedNavigation.value = nav;
    selectedAction.value = action;
    selectedAction.value === UPDATE
        ? (showModal.value = true)
        : (showDeleteConfirm.value = true);

    navigationInput.value.title = nav.title;
    navigationInput.value.slug = nav.slug;
    // Validate form
    if (navFormRef.value) navFormRef.value.validate();
};

const applyAction = () => {
    switch (selectedAction.value) {
        case UPDATE:
            return handleUpdateNavigation();
        case DELETE:
            return handleDeleteNavigation();
        default:
            return handleCreateNavigation();
    }
};

// Sorting
const currentSorting = ref("slug");
const currentSortingDir = ref("ASC");
const isLoadingSort = ref(false);

// Sorting from the Table
const setSorting = async (field) => {
    if (isLoadingSort.value) return;

    if (currentSorting.value !== field) {
        currentSorting.value = field;
        currentSortingDir.value = "ASC";
    } else {
        currentSortingDir.value =
            currentSortingDir.value === "ASC" ? "DESC" : "ASC";
    }

    isLoadingSort.value = true;
    await navigationDetailsList();
    isLoadingSort.value = false;
};

navigationDetailsList();
</script>

<style lang="scss" scoped>
.utable {
    tr {
        td {
            .icon {
                @apply tw-hidden;
            }
        }

        &:hover {
            td {
                background-color: rgba(229, 231, 235, 0.2);
                .icon {
                    @apply tw-block;
                }
            }
        }
    }
}
</style>
