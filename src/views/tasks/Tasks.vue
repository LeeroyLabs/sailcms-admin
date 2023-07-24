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

        <section class="tw-mt-6 tw-mb-4">
            <div
                class="tw-mb-4 md:tw-mb-0 lg:tw-w-4/12 tw-flex tw-flex-row tw-gap-x-4 tw-items-center"
            >
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

                <v-progress-circular
                    :class="{
                        'tw-invisible': !isLoadingSearch,
                        'tw-hidden': $vuetify.display.mobile,
                    }"
                    indeterminate
                    size="small"
                    width="3"
                />
            </div>
        </section>

        <v-table class="utable">
            <thead>
                <tr>
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
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";

import { hasPermission } from "@/libs/tools";
import { Tasks } from "@/libs/graphql/lib/tasks";

import Pagination from "@/components/globals/Pagination.vue";
import Loader from "@/components/globals/Loader.vue";
import SmartTH from "@/components/globals/table/SmartTH.vue";

const store = useAppStore();
const i18n = useI18n();
const isReady = ref(false);

const tasks = ref([]);

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
