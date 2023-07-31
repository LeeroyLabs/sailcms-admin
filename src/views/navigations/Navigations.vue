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
                        :text="$t('navigations.columns.name')"
                        :sortable="true"
                        @sort="setSorting('name')"
                        :showLoaderOnSort="true"
                        :condition="currentSorting !== 'name' || !isLoadingSort"
                        :ascending="
                            currentSorting === 'name' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <th class="tw-text-center">
                        {{ $t("navigations.columns.title") }}
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
                                params: { name: nav.name },
                            }"
                        >
                            {{ nav.name }}
                        </router-link>
                    </td>
                    <td>{{ nav.title }}</td>
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
                        :label="$t('navigations.new_navigation')"
                        variant="outlined"
                        type="text"
                        clearable
                        density="comfortable"
                        :hide-details="true"
                        :rules="[rules.required]"
                        v-model="navigationName"
                        validate-on="blur"
                    />

                    <v-card-actions class="tw-justify-end">
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
import { ref, watch, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { Navigations } from "@/libs/graphql/lib/navigations";
import { SailCMS } from "@/libs/graphql";

import Loader from "@/components/globals/Loader.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";
import Modal from "@/components/globals/Modal.vue";

const siteId = ref(SailCMS.getSiteId());
const i18n = useI18n();
const router = useRouter();
const isReady = ref(false);

const navigationsList = ref([]);
const selectedNavigation = ref(null);
const selectedAction = ref("");

// Form
const isFormValid = ref(false);
const navigationName = ref(null);
const rules = {
    required: (value) => !!value || "Required",
};

// Modals
const showDeleteConfirm = ref(false);
const showModal = ref(false);
const applyingAction = ref(false);

// Template Refs
const navFormRef = ref(null);

// Constants
const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";

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
            name: navigationName.value,
            structure: [],
            locale: i18n.locale.value,
            site_id: siteId.value,
        });
        if (responseCreateNavigation) {
            router.push({
                name: "Navigation",
                params: { name: navigationName.value },
            });
            handleReset();
            applyingAction.value = false;
        }
    }
};

// UPDATE
const handleUpdateNavigation = async () => {
    if (isFormValid.value) {
        applyingAction.value = true;
        const responseUpdateNavigation = await Navigations.updateNavigation({
            id: selectedNavigation.value._id,
            title: selectedNavigation.value.title,
            name: navigationName.value,
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
    navigationName.value = null;
    showModal.value = false;
    showDeleteConfirm.value = false;
};

const selectAction = (nav, action) => {
    selectedNavigation.value = nav;
    selectedAction.value = action;
    navigationName.value = nav.name;
    selectedAction.value === UPDATE
        ? (showModal.value = true)
        : (showDeleteConfirm.value = true);
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
const currentSorting = ref("name");
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

// Validate form when modal opens
watch(navigationName, () => {
    nextTick(() => {
        navFormRef.value.validate();
    });
});

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
