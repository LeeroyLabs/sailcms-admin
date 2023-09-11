<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click="selectAction(null, CREATE)" color="primary">
                {{ $t("navigations.add") }}
            </v-btn>
        </Teleport>

        <div
            class="tw-p-6 tw-rounded-b-md"
            :class="{
                'tw-bg-white ': $vuetify.theme.name === 'light',
                'tw-bg-darkbg': $vuetify.theme.name === 'dark',
            }"
        >
            <Manager
                :active="0"
                :list="navigationsList"
                :overrideActions="actions"
                :actionCallback="applyAction"
                :deleteCallback="handleDeleteNavigation"
                :no_items="$t('navigations.no_navigations')"
                :columns="columns"
                :index="0"
            >
                <template v-slot="{ row }">
                    <td>
                        <router-link
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{
                                'hover:tw-text-white':
                                    $vuetify.theme.name !== 'light',
                            }"
                            :to="{
                                name: 'Navigation',
                                params: { slug: row.slug },
                            }"
                        >
                            {{ row.title }}
                        </router-link>
                    </td>
                    <td>
                        {{ row.slug }}
                    </td>
                    <td class="tw-relative">
                        <v-icon
                            icon="mdi-square-edit-outline"
                            size="22"
                            class="icon icon-edit tw-cursor-pointer tw-absolute tw-top-2/4 tw--translate-y-2/4 tw-right-4"
                            @click="selectAction(row, UPDATE)"
                        />
                    </td>
                </template>
            </Manager>
        </div>
    </div>

    <Loader v-else />

    <Transition>
        <Modal
            v-if="showModal"
            :title="$t(`navigations.${selectedAction}_navigation`)"
            :message="$t(`navigations.${selectedAction}_navigation_msg`)"
        >
            <template v-slot:content>
                <v-form
                    ref="navFormRef"
                    class="tw-flex tw-flex-col tw-gap-6"
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
                            @click="applyAction(selectedAction, null)"
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
import Modal from "@/components/globals/Modal.vue";
import Manager from "@/components/globals/Manager.vue";

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

const actions = ref([
    { value: DELETE, title: i18n.t("navigations.actions.delete") },
]);
const selectedAction = ref(CREATE);

const columns = ref([
    { label: i18n.t("navigations.columns.title"), centered: false },
    { label: i18n.t("navigations.columns.slug"), centered: false },
    { label: "", centered: false },
]);

// Form & Validations
const isFormValid = ref(false);
const rules = {
    required: (value) => !!value || "Required",
};

// Modals
const showModal = ref(false);
const applyingAction = ref(false);

// Sorting
const currentSorting = ref("slug");
const currentSortingDir = ref("ASC");

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
            title: navigationInput.value.title,
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
const handleDeleteNavigation = async (event) => {
    const responseDeleteNavigation = await Navigations.deleteNavigation(
        event.list
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
};

const selectAction = (nav = null, action) => {
    selectedNavigation.value = nav;
    selectedAction.value = action;
    showModal.value = true;

    if (selectedAction.value === UPDATE) {
        navigationInput.value.title = nav.title;
        navigationInput.value.slug = nav.slug;
        // Validate form
        if (navFormRef.value) navFormRef.value.validate();
    }
};

const applyAction = async (action) => {
    selectedAction.value = action;

    switch (selectedAction.value) {
        case UPDATE:
            return handleUpdateNavigation();
        default:
            return handleCreateNavigation();
    }
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
