<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                v-if="hasPermission('readwrite_task')"
                color="primary"
                @click="$router.push({ name: 'Task', params: { id: 'add' } })"
            >
                {{ $t("tasks.add") }}
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
                :list="tasks.list"
                :overrideActions="actions"
                :actionCallback="applyAction"
                :deleteCallback="deleteEntries"
                :no_items="$t('tasks.no_tasks')"
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
                            {{ row.name }}
                        </router-link>
                    </td>
                    <td>
                        {{
                            row.executed
                                ? $t("tasks.columns.executed")
                                : $t("tasks.columns.no_executed")
                        }}
                    </td>
                    <td>
                        {{
                            new Date(
                                row.scheduled_at * 1000
                            ).toLocaleDateString("en-US")
                        }}
                    </td>
                    <td>{{ row.priority }}</td>
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
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { hasPermission } from "@/libs/tools";
import { Tasks } from "@/libs/graphql/lib/tasks";

import Loader from "@/components/globals/Loader.vue";
import Manager from "@/components/globals/Manager.vue";

const store = useAppStore();
const i18n = useI18n();
const isReady = ref(false);
const router = useRouter();

const tasks = ref([]);

const applyingAction = ref(false);
const actions = ref([
    { value: "start", title: i18n.t("tasks.actions.start") },
    { value: "retry", title: i18n.t("tasks.actions.retry") },
    { value: "stop", title: i18n.t("tasks.actions.stop") },
    {
        value: "delete",
        title: i18n.t("tasks.actions.delete"),
    },
]);

const columns = ref([
    { label: i18n.t("tasks.columns.name"), centered: false },
    { label: i18n.t("tasks.columns.status"), centered: false },
    { label: i18n.t("tasks.columns.scheduled"), centered: false },
    { label: i18n.t("tasks.columns.priority"), centered: false },
]);

// Constants
const START = "start";
const RETRY = "retry";
const STOP = "stop";
const CANCEL = "cancel";

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

const startAllTasks = async () => {
    const responseStartAllTasks = await Tasks.startAllTasks();
    if (responseStartAllTasks) {
        console.log("ALL STARTED");
    }
};

const stopAllTasks = async () => {
    const responseStopAllTasks = await Tasks.stopAllTasks();
    if (responseStopAllTasks) {
        console.log("ALL STOPPED");
    }
};

//  Actions
const handleRetryTask = async (items) => {
    applyingAction.value = true;
    const responseRetryTask = await Tasks.retryTask(
        items.map((item) => item._id)
    );
    if (responseRetryTask) {
        applyingAction.value = false;
    }
};

const handleStopTask = async (items) => {
    console.log("ITEMS", items);
    /* applyingAction.value = true;
    const responseStopTask = await Tasks.stopTask(
        items.map((item) => item._id)
    );
    if (responseStopTask) {
        applyingAction.value = false;
    } */
};

const handleCancelTask = async (items) => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask(
        items.map((item) => item._id)
    );
    if (responseCancelTask) {
        applyingAction.value = false;
    }
};

const applyAction = async (action, items) => {
    switch (action) {
        case RETRY:
            return handleRetryTask(items);
        case STOP:
            return handleStopTask(items);
        case CANCEL:
            return handleCancelTask(items);
        default:
            router.push({ name: "Tasks" });
    }
};

// Pagination handling
const currentPage = ref(1);
const currentLimit = ref(25);
const pagination = ref({ total: 0, current: 0, totalPages: 0 });

// Sorting
const currentSorting = ref("name");
const currentSortingDir = ref("ASC");

// Search
const currentSearch = ref("");

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
