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
                        {{ format(row.scheduled_at * 1000, "yyyy/MM/dd") }}
                    </td>
                    <td>
                        {{
                            taskPriority.find(
                                (priority) => priority.value === row.priority
                            ).label
                        }}
                    </td>
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
import { format } from "date-fns";

import Loader from "@/components/globals/Loader.vue";
import Manager from "@/components/globals/Manager.vue";

const store = useAppStore();
const i18n = useI18n();
const { t } = i18n;
const isReady = ref(false);
const router = useRouter();

const tasks = ref([]);

const applyingAction = ref(false);
const actions = ref([
    { value: START, title: i18n.t("tasks.actions.start") },
    { value: RETRY, title: i18n.t("tasks.actions.retry") },
    { value: STOP, title: i18n.t("tasks.actions.stop") },
    {
        value: CANCEL,
        title: i18n.t("tasks.actions.cancel"),
    },
]);

const columns = ref([
    { label: i18n.t("tasks.columns.name"), centered: false },
    { label: i18n.t("tasks.columns.status"), centered: false },
    { label: i18n.t("tasks.columns.scheduled"), centered: false },
    { label: i18n.t("tasks.columns.priority"), centered: false },
]);

const taskPriority = [
    { label: t("task.form.priority_low"), value: 1 },
    { label: t("task.form.priority_normal"), value: 2 },
    { label: t("task.form.priority_high"), value: 3 },
    { label: t("task.form.priority_urgent"), value: 4 },
];

// Constants
const START = "start";
const RETRY = "retry";
const STOP = "stop";
const CANCEL = "cancel";

// Load tasks
const loadTasks = async () => {
    const responseLoadTasks = await Tasks.taskSearch(
        1,
        25,
        currentSearch.value,
        currentSorting.value,
        currentSortingDir.value
    );

    if (responseLoadTasks) {
        tasks.value = responseLoadTasks;
        isReady.value = true;
    }
};

//  Actions
const handleStartTask = async (items) => {
    applyingAction.value = true;
    const responseStartTask = await Tasks.startTasks(
        items.map((item) => item._id)
    );
    if (responseStartTask) {
        applyingAction.value = false;
    }
};

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
    applyingAction.value = true;
    const responseStopTask = await Tasks.stopTask(
        items.map((item) => +item.pid)
    );
    if (responseStopTask) {
        applyingAction.value = false;
    }
};

const handleCancelTask = async (items) => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask(
        items.map((item) => item._id)
    );
    if (responseCancelTask) {
        applyingAction.value = false;
        loadTasks();
    }
};

const applyAction = async (action, items) => {
    switch (action) {
        case START:
            return handleStartTask(items);
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
