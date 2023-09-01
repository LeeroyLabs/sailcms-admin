<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                color="primary"
                @click="$router.push({ name: 'Form', params: { id: 'add' } })"
            >
                {{ $t("forms.add_form") }}
            </v-btn>
        </Teleport>

        <Manager
            :active="0"
            :list="formsList"
            :overrideActions="actions"
            :actionCallback="applyAction"
            :deleteCallback="deleteEntries"
            :no_items="$t('forms.no_forms')"
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
                            name: 'Task',
                            params: { id: row._id },
                        }"
                    >
                        {{ row.title }}
                    </router-link>
                </td>
                <td>
                    {{ row.handle }}
                </td>
            </template>
            <template #footer="{ index }">
                <v-pagination
                    v-model="currentPage[index - 1]"
                    class="tw-mt-6"
                    density="comfortable"
                    :rounded="true"
                    :length="pagination.totalPages"
                />
            </template>
        </Manager>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Forms } from "@/libs/graphql/lib/forms";
import { useI18n } from "vue-i18n";
import { hasPermission } from "@/libs/tools";
import Manager from "@/components/globals/Manager.vue";

const i18n = useI18n();
const { t } = i18n;
const isReady = ref(false);

// Constants
const DELETE = "delete";

const formsList = ref([]);
const applyingAction = ref(false);
const actions = ref([
    {
        value: DELETE,
        title: i18n.t("forms.actions.delete"),
    },
]);

const columns = ref([
    { label: i18n.t("forms.columns.title"), centered: false },
    { label: i18n.t("forms.columns.handle"), centered: false },
]);

// Pagination handling
const currentPage = ref(1);
const pagination = ref({ total: 0, current: 0, totalPages: 0 });

// Queries
const getForms = async () => {
    const responseGetForms = await Forms.getForms();
    if (responseGetForms) {
        formsList.value = responseGetForms;
        isReady.value = true;
    }
};

// Actions
const handleDeleteForm = async (forms) => {
    const responseDeleteForm = await Forms.deleteForm(forms.map((f) => f._id));
    if (responseDeleteForm) {
        applyingAction.value = false;
    }
};

const applyAction = async (action, items) => {
    switch (action) {
        case DELETE:
            return handleDeleteForm(items);
        default:
            router.push({ name: "Forms" });
    }
};

getForms();
</script>

<style lang="scss" scoped></style>
