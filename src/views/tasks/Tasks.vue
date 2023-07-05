<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                v-if="hasPermission('readwrite_task')"
                color="primary"
                @click="
                    $router.push({ name: 'SingleTask', params: { id: 'add' } })
                "
            >
                {{ $t("tasks.add") }}
            </v-btn>
        </Teleport>

        <v-table class="utable">
            <thead>
                <tr>
                    <th class="tw-min-w-[4px] tw-max-w-[4px]">
                        <v-checkbox
                            @change="handleCheckAll"
                            color="primary"
                            value="checkall"
                            hide-details
                        />
                    </th>
                    <SmartTH
                        :text="$t('tasks.columns.name')"
                        :sortable="true"
                        @sort="setSorting('name.full')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'name.full' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'name.full' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <SmartTH
                        :text="$t('tasks.columns.status')"
                        :sortable="true"
                        @sort="setSorting('email')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'email' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'email' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <SmartTH
                        :text="$t('tasks.columns.created')"
                        :sortable="true"
                        @sort="setSorting('name.full')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'name.full' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'name.full' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="task in taskListing" :key="task._id">
                    <td class="tw-min-w-[4px] tw-max-w-[4px]">
                        <v-checkbox
                            v-model="selectedTasks"
                            color="primary"
                            :value="task"
                            hide-details
                        />
                    </td>
                    <td>
                        <router-link
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{
                                'hover:tw-text-white':
                                    $vuetify.theme.name !== 'light',
                            }"
                            :to="{
                                name: 'SingleTask',
                                params: { id: task._id },
                            }"
                        >
                            {{ task.name }}
                        </router-link>
                    </td>
                    <td>{{ task.status }}</td>
                    <td>{{ task.created }}</td>
                    <td>
                        <v-btn
                            @click.prevent="handleViewTask(task)"
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-eye-outline"
                        />
                        <v-btn
                            @click.prevent="handleReloadTask(task)"
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-reload"
                        />
                        <v-btn
                            @click.prevent="handleDeleteTask(task)"
                            density="comfortable"
                            color="red"
                            variant="tonal"
                            rounded
                            icon="mdi-trash-can-outline"
                            class="tw-text-red-600"
                        />
                    </td>
                </tr>

                <tr v-if="!taskListing.length">
                    <td colspan="7" class="tw-text-center tw-font-medium">
                        {{ $t("tasks.no_tasks") }}
                    </td>
                </tr>
            </tbody>
        </v-table>

        <Pagination
            class="tw-mt-6"
            :limit="currentLimit"
            :pagination="pagination"
        />

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                :title="$t('users.confirm')"
                :loading="applyingAction"
                :message="$t('users.confirm_msg')"
                @cancel="showDeleteConfirm = false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";

import { hasPermission } from "@/libs/tools";

import Pagination from "@/components/globals/Pagination.vue";
import Loader from "@/components/globals/Loader.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const store = useAppStore();
const i18n = useI18n();
const isReady = ref(true);
const tasks = ref([]);

const taskListing = ref([
    { _id: "1", name: "Task 1", status: "Running", created: "05/06/2022" },
    { _id: "2", name: "Task 2", status: "Failed", created: "05/06/2022" },
    { _id: "3", name: "Task 3", status: "Running", created: "05/06/2022" },
]);

// Pagination handling
const currentPage = ref(1);
const currentLimit = ref(25);
const selectedTasks = ref([]);

// Handle the "Check All" checkbox
const handleCheckAll = (e) => {
    if (e.target.checked) selectedTasks.value = taskListing.value;
    if (!e.target.checked) selectedTasks.value = [];
};

// View a task
const handleViewTask = (task) => {
    console.log("VIEW", task);
};

// Reload a task
const handleReloadTask = (task) => {
    console.log("RELOAD", task);
};

// Delete a task
const handleDeleteTask = (task) => {
    console.log("DELETE", task);
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
        { title: i18n.t("tasks.title") },
    ]);

    store.setPageTitle(i18n.t("tasks.title"));
    document.title = i18n.t("tasks.title") + " — SailCMS";
};

onMounted(() => {
    setupPage();
});
</script>

<style lang="scss" scoped>
.utable tr:hover td {
    background-color: rgba(229, 231, 235, 0.2);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
