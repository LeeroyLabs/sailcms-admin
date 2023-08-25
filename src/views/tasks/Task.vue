<template>
    <div
        v-if="isReady"
        class="tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12"
    >
        <div class="tw-flex tw-flex-col tw-gap-4">
            <div
                class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center"
            >
                <div>
                    <h3 class="tw-font-medium tw-text-xl">
                        {{
                            actionMode === CREATE
                                ? $t("task.create_task")
                                : $t("task.update_task")
                        }}
                    </h3>
                    <span v-if="actionMode === UPDATE">ID: {{ task._id }}</span>
                </div>

                <div v-if="actionMode === UPDATE" class="tw-flex tw-flex-col">
                    <div
                        class="tw-order-2 sm:tw-order-1 tw-flex tw-gap-2 tw-justify-end"
                    >
                        <v-btn
                            @click.prevent="
                                handleAction(RETRY, $t('task.retry_msg'))
                            "
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-reload"
                        />
                        <v-btn
                            @click.prevent="selectedAction = RESCHEDULE"
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-calendar-month-outline"
                        />
                        <v-btn
                            @click.prevent="
                                handleAction(STOP, $t('task.stop_msg'))
                            "
                            density="comfortable"
                            color="red"
                            variant="tonal"
                            rounded
                            icon="mdi-stop-circle-outline"
                            class="tw-text-red-600"
                        />
                        <v-btn
                            @click.prevent="
                                handleAction(CANCEL, $t('task.cancel_msg'))
                            "
                            density="comfortable"
                            color="red"
                            variant="tonal"
                            rounded
                            icon="mdi-trash-can-outline"
                            class="tw-text-red-600"
                        />
                    </div>
                    <p
                        v-if="actionMode === UPDATE"
                        class="tw-order-1 sm:tw-order-2"
                    >
                        {{
                            task.executed
                                ? `${$t("task.started_at")}: `
                                : `${$t("task.scheduled_at")}: `
                        }}
                        {{
                            new Date(
                                task.scheduled_at * 1000
                            ).toLocaleDateString("en-US")
                        }}
                    </p>
                </div>
            </div>

            <v-form
                ref="form"
                class="tw-flex tw-flex-col tw-gap-2 mb-6"
                @submit.prevent
                v-model="isFormValid"
            >
                <div
                    class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-4 md:tw-gap-y-0"
                >
                    <v-text-field
                        color="primary"
                        :label="$t('task.form.name')"
                        variant="outlined"
                        type="text"
                        validate-on="blur"
                        density="comfortable"
                        :rules="[rules.required]"
                        v-model="taskInput.name"
                    />
                    <v-text-field
                        color="primary"
                        :label="$t('task.form.name')"
                        variant="outlined"
                        type="text"
                        validate-on="blur"
                        density="comfortable"
                        :rules="[rules.required]"
                        v-model="taskInput.name"
                    />
                </div>

                <div
                    class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-4 tw-gap-y-4 md:tw-gap-y-0"
                >
                    <v-select
                        :label="$t('task.form.action')"
                        :items="['test:task-command']"
                        variant="outlined"
                        density="comfortable"
                        single-line
                        :rules="[rules.required]"
                        v-model="taskInput.action"
                    />
                    <v-select
                        :label="$t('task.form.priority')"
                        :items="taskPriority"
                        item-title="label"
                        item-value="value"
                        variant="outlined"
                        density="comfortable"
                        single-line
                        :rules="[rules.required]"
                        v-model="taskInput.priority"
                    />
                </div>

                <div v-if="actionMode === UPDATE">
                    <h4 class="tw-font-medium tw-text-sm tw-mb-2">Config</h4>
                    <div
                        class="tw-h-[200px] tw-overflow-y-auto tw-bg-darkbg"
                        :class="{
                            'tw-text-gray-200': $vuetify.theme.name === 'light',
                        }"
                    ></div>
                </div>

                <div v-if="actionMode === UPDATE" class="tw-mt-[22px]">
                    <h4 class="tw-font-medium tw-text-sm tw-mb-2">Logs</h4>
                    <div
                        class="tw-h-[200px] tw-overflow-y-auto tw-p-5 tw-bg-darkbg"
                        :class="{
                            'tw-text-gray-200': $vuetify.theme.name === 'light',
                        }"
                    >
                        <ul>
                            <li v-for="log in taskLogs" :key="log">
                                {{ log }}
                            </li>
                        </ul>
                    </div>
                </div>

                <v-checkbox
                    label="Retriable"
                    hide-details
                    v-model="taskInput.retriable"
                />

                <div
                    class="tw-self-center sm:tw-self-end tw-gap-x-3 tw-flex tw-flex-col sm:tw-flex-row tw-gap-2"
                >
                    <v-btn
                        type="submit"
                        :loading="isLoading"
                        @click="createTask"
                        color="primary"
                    >
                        {{
                            actionMode === CREATE
                                ? $t("task.save")
                                : $t("task.update")
                        }}
                    </v-btn>

                    <v-btn flat @click="showModal = true" color="text">
                        {{ $t("task.cancel") }}
                    </v-btn>
                </div>
            </v-form>
        </div>

        <Transition>
            <DeleteConfirmation
                v-if="showModal"
                :show="true"
                :overall="true"
                :title="$t('task.confirm')"
                :loading="applyingAction"
                :message="modalMessage"
                @cancel="handleCancel"
                @accept="applyAction"
            />
        </Transition>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Tasks } from "@/libs/graphql/lib/tasks";

import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";
import DatePicker from "@/components/globals/task/DatePicker.vue";

const i18n = useI18n();
const { t } = i18n;
const router = useRouter();
const route = useRoute();

// Form
const form = ref(null);
const isFormValid = ref(false);
const rules = {
    required: (value) => {
        if (value) return true;
        return i18n.t("task.errors.required");
    },
};

const task = ref(null);
const taskLogs = ref([]);
const taskInput = ref({
    name: "",
    action: null,
    priority: null,
    retriable: false,
});
const taskPriority = [
    { label: t("task.form.priority_low"), value: 1 },
    { label: t("task.form.priority_normal"), value: 2 },
    { label: t("task.form.priority_high"), value: 3 },
    { label: t("task.form.priority_urgent"), value: 4 },
];

// Constants
const CREATE = "create";
const UPDATE = "update";
const RETRY = "retry";
const STOP = "stop";
const CANCEL = "cancel";

const actionMode = ref("");
const selectedAction = ref("");
const applyingAction = ref(false);
const isReady = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const modalMessage = ref(t("task.leave_msg"));

const createTask = async () => {
    if (isFormValid.value) {
        const responseCreateTask = await Tasks.createTask(
            taskInput.value.name,
            taskInput.value.action,
            taskInput.value.priority,
            taskInput.value.retriable
        );
        if (responseCreateTask) {
            router.push({ name: "Tasks" });
        }
    }
};

const loadTask = async () => {
    const responseLoadTask = await Tasks.task(route.params.id);
    if (responseLoadTask) {
        task.value = responseLoadTask;
        taskInput.value.name = task.value.name;
        taskInput.value.action = task.value.action;
        taskInput.value.priority = task.value.priority;
        taskInput.value.retriable = task.value.retriable;
        isReady.value = true;
        loadTaskLogs(task.value._id);
    }
};

const loadTaskLogs = async () => {
    const responseTaskLogs = await Tasks.taskLogs(task.value._id);
    if (responseTaskLogs) {
        taskLogs.value = responseTaskLogs;
    }
};

// Actions
const handleAction = (action, message) => {
    showModal.value = true;
    selectedAction.value = action;
    modalMessage.value = message;
};

const handleRetryTask = async () => {
    applyingAction.value = true;
    const responseRetryTask = await Tasks.retryTask([task.value._id]);
    if (responseRetryTask) {
        handleCancel();
        applyingAction.value = false;
    }
};

const handleChangeTaskSchedule = async (newDate) => {
    applyingAction.value = true;
    const responseChangeTaskSchedule = await Tasks.changeTaskSchedule(
        task.value._id,
        newDate / 1000
    );
    if (responseChangeTaskSchedule) {
        await loadTask();
        handleCancel();
        applyingAction.value = false;
    }
};

const handleStopTask = async () => {
    applyingAction.value = true;
    const responseStopTask = await Tasks.stopTask([task.value._id]);
    if (responseStopTask) {
        handleCancel();
        applyingAction.value = false;
    }
};

const handleCancelTask = async () => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask([task.value._id]);
    if (responseCancelTask) {
        handleCancel();
        applyingAction.value = false;
        router.push({ name: "Tasks" });
    }
};

const applyAction = async () => {
    switch (selectedAction.value) {
        case RETRY:
            await handleRetryTask();
            break;
        case STOP:
            await handleStopTask();
            break;
        case CANCEL:
            await handleCancelTask();
            break;
        default:
            router.push({ name: "Tasks" });
    }
};

const handleCancel = () => {
    showModal.value = false;
    selectedAction.value = "";
    modalMessage.value = t("task.leave_msg");
};

if (route.params.id === "add") {
    actionMode.value = CREATE;
    isReady.value = true;
} else {
    actionMode.value = UPDATE;
    loadTask();
}
</script>

<style lang="scss" scoped></style>
