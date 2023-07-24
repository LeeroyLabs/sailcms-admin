<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                v-if="hasPermission('readwrite_task')"
                color="primary"
                @click="$router.push({ name: 'CreateTask' })"
            >
                {{ $t("tasks.add") }}
            </v-btn>
        </Teleport>

        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <div
                class="tw-flex tw-flex-row tw-w-full lg:tw-w-3/12 tw-items-center"
                v-if="hasPermission('readwrite_task')"
            >
                <v-select
                    v-model="selectedAction"
                    label="Actions"
                    color="primary"
                    :items="availableActions"
                    variant="outlined"
                    density="comfortable"
                    single-line
                    placeholder="Actions"
                    :persistent-hint="false"
                    :hide-details="true"
                />

                <v-btn
                    v-if="hasPermission('readwrite_task')"
                    :class="{
                        'tw-invisible tw-opacity-0': selectedAction === null,
                        'tw-opacity-100': selectedAction !== null,
                    }"
                    class="tw-hidden md:tw-block tw-ml-2 tw-transition-opacity tw-duration-300"
                    color="primary"
                    size="small"
                    icon
                    @click.prevent="performAction"
                >
                    <v-icon icon="mdi-chevron-right" />
                </v-btn>

                <v-progress-circular
                    indeterminate
                    size="x-small"
                    width="2"
                    class="tw-ml-2"
                    :class="{ 'tw-invisible': !applyingAction }"
                />
            </div>

            <div
                class="tw-w-full tw-mb-4 md:tw-mb-0 lg:tw-w-4/12 tw-flex tw-flex-row tw-gap-x-4 tw-items-center"
            >
                <v-progress-circular
                    :class="{
                        'tw-invisible': !isLoadingSearch,
                        'tw-hidden': $vuetify.display.mobile,
                    }"
                    indeterminate
                    size="small"
                    width="3"
                />
                <v-text-field
                    color="primary"
                    :label="$t('tasks.search')"
                    variant="outlined"
                    :hide-details="true"
                    type="text"
                    clearable
                    density="comfortable"
                    v-model="currentSearch"
                    @keydown.enter="runSearch"
                    @click:clear="clearSearch"
                >
                    <template v-slot:append-inner>
                        <div class="tw-opacity-[0.20]">
                            <v-icon icon="mdi-keyboard-return" />
                        </div>
                    </template>
                </v-text-field>
            </div>
        </section>

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
                        @sort="setSorting('name')"
                        :showLoaderOnSort="true"
                        :condition="currentSorting !== 'name' || !isLoadingSort"
                        :ascending="
                            currentSorting === 'name' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <SmartTH
                        :text="$t('tasks.columns.status')"
                        :sortable="true"
                        @sort="setSorting('executed')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'executed' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'executed' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <SmartTH
                        :text="$t('tasks.columns.scheduled')"
                        :sortable="true"
                        @sort="setSorting('executed_at')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'executed_at' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'executed_at' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                    <SmartTH
                        :text="$t('tasks.columns.priority')"
                        :sortable="true"
                        @sort="setSorting('priority')"
                        :showLoaderOnSort="true"
                        :condition="
                            currentSorting !== 'priority' || !isLoadingSort
                        "
                        :ascending="
                            currentSorting === 'priority' &&
                            currentSortingDir === 'ASC'
                        "
                    />
                </tr>
            </thead>

            <tbody>
                <tr v-for="task in tasks.list" :key="task._id">
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
                    <td>
                        {{
                            task.executed
                                ? $t("tasks.columns.executed")
                                : $t("tasks.columns.no_executed")
                        }}
                    </td>
                    <td>
                        {{
                            new Date(
                                task.scheduled_at * 1000
                            ).toLocaleDateString("en-US")
                        }}
                    </td>
                    <td>{{ task.priority }}</td>
                </tr>

                <tr v-if="tasks.list && !tasks.list.length">
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
                :title="$t('tasks.confirm')"
                :loading="applyingAction"
                :message="$t('tasks.confirm_msg')"
                @cancel="showDeleteConfirm = false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";

import { hasPermission } from "@/libs/tools";
import { Tasks } from "@/libs/graphql/lib/tasks";

import Pagination from "@/components/globals/Pagination.vue";
import Loader from "@/components/globals/Loader.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const store = useAppStore();
const i18n = useI18n();
const isReady = ref(false);

const tasks = ref([]);
const selectedTask = ref(null);
const selectedTasks = ref([]);

// Actions
const selectedAction = ref(null);
const applyingAction = ref(false);
const availableActions = computed(() => {
    return [
        { value: "retry", title: i18n.t("tasks.actions.retry") },
        { value: "delete", title: i18n.t("tasks.actions.delete") },
    ];
});

// Search
const currentSearch = ref("");
const isLoadingSearch = ref(false);

// Pagination handling
const currentPage = ref(1);
const currentLimit = ref(25);
const pagination = ref({ total: 0, current: 0, totalPages: 0 });

// Sorting
const currentSorting = ref("name");
const currentSortingDir = ref("ASC");
const isLoadingSort = ref(false);

const runSearch = async () => {
    isLoadingSearch.value = true;
    currentPage.value = 1;
    currentSorting.value = "name";
    currentSortingDir.value = "ASC";
    await loadTasks();
    isLoadingSearch.value = false;
};

const clearSearch = async () => {
    isLoadingSearch.value = true;
    currentSearch.value = "";
    currentPage.value = 1;
    currentSorting.value = "name";
    currentSortingDir.value = "ASC";
    await loadTasks();
    isLoadingSearch.value = false;
};

// Handle the "Check All" checkbox
const handleCheckAll = (e) => {
    if (e.target.checked) selectedTasks.value = tasks.value.list;
    if (!e.target.checked) selectedTasks.value = [];
};

// Load tasks
const loadTasks = async () => {
    const responseLoadTasks = await Tasks.taskSearch(
        currentPage.value,
        currentLimit.value,
        currentSearch.value,
        currentSorting.value,
        currentSortingDir.value
    );

    if (responseLoadTasks) {
        tasks.value = responseLoadTasks;
        pagination.value = responseLoadTasks.pagination;
        isReady.value = true;
    }
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
    selectedTask.value = task;
    console.log("DELETE", task);
};

// Confirm delete
const confirmDelete = () => {
    console.log("CONFIRM DELETE");
};

// Delete a task
const performAction = async () => {
    if (selectedAction.value === i18n.t("tasks.actions.delete")) {
        showDeleteConfirm.value = true;
        return;
    }

    if (applyingAction.value) return;
    applyingAction.value = true;

    switch (selectedAction.value) {
        default:
        case i18n.t("tasks.actions.retry"):
            //await Users.enableUsers(userIds);
            break;
        case i18n.t("tasks.actions.delete"):
            await Tasks.cancelTask();
            //await Users.disableUsers(userIds);
            break;
    }
};

// Modal
const showDeleteConfirm = ref(false);

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
    loadTasks();
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
