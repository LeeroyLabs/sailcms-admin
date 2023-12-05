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
                    <h3 class="tw-font-medium tw-text-xl tw-mb-2">
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
                        class="tw-order-2 sm:tw-order-1 tw-flex tw-gap-2 tw-justify-end tw-mt-2 sm:tw-mt-0 sm:tw-mb-2"
                    >
                        <v-btn
                            @click.prevent="
                                handleAction(RETRY, $t('task.retry_msg'))
                            "
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-reload"
                            class="!tw-rounded-full"
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
                            class="tw-text-red-600 !tw-rounded-full"
                        />
                        <v-btn
                            @click.prevent="handleAction(CANCEL, $t('task.cancel_msg'))"
                            density="comfortable"
                            color="red"
                            variant="tonal"
                            rounded
                            icon="mdi-trash-can-outline"
                            class="tw-text-red-600 !tw-rounded-full"
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

                        {{ format(task.scheduled_at * 1000, "dd-MM-yyyy") }}
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

                    <DateTime
                        :id="'date_time'"
                        :value="taskInput.date.date ? taskInput.date : ''"
                        :config="{
                            type: 'text',
                            label: {fr: $t('task.select_date'), en: $t('task.select_date')},
                            validation: '',
                            required: false,
                            repeatable: false,
                            config: {
                                date_format: 'Y-m-d',
                                time_format: 'H:i',
                                minDate: Date.now(),
                            },
                        }"
                        :minuteIncrement="15"
                        :index="0"
                        :showTime="true"
                        :useTimestamp="true"
                        :error="errorDateTime"
                        @change="(event) => (taskInput.date = event)"
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

                <div>
                    <div
                        class="tw-h-[150px]"
                        :class="{
                            'tw-text-gray-200': $vuetify.theme.name === 'light',
                        }"
                    >
                        <v-textarea
                            type="text"
                            :label="$t('task.form.settings')"
                            variant="solo"
                            :rules="[rules.required]"
                            validate-on="blur"
                            bg-color="#212121"
                            :no-resize="true"
                            v-model="taskInput.settings"
                        />
                    </div>
                </div>

                <div
                    v-if="actionMode === UPDATE && task.logs"
                    class="tw-mt-[22px]"
                >
                    <h4 class="tw-font-medium tw-text-sm tw-mb-2">Logs</h4>
                    <div
                        class="tw-h-[150px] tw-overflow-y-auto tw-p-5 tw-bg-darkbg tw-rounded"
                        :class="{
                            'tw-text-gray-200': $vuetify.theme.name === 'light',
                        }"
                    >
                        <ul>
                            <li
                                v-for="log in Object.values(task.logs)"
                                :key="log"
                            >
                                {{ log }}
                            </li>
                        </ul>
                    </div>
                </div>

                <v-checkbox
                    class="tw-mt-2"
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
                        color="primary"
                        @click="
                            actionMode === CREATE ? createTask() : updateTask()
                        "
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
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

import { Tasks } from "@/libs/graphql/lib/tasks";
import { format } from "date-fns";

import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";
import DateTime from "@/components/entries/entry/fields/singles/Date.vue";

const i18n = useI18n();
const { t } = i18n;
const router = useRouter();
const route = useRoute();

// Form
const form = ref(null);
const isFormValid = ref(false);
const errorDateTime = ref(false);
const rules = {
    required: (value) => {
        if (value) return true;
        return i18n.t("task.errors.required");
    },
};

const task = ref(null);
const taskInput = ref({
    name: "",
    action: null,
    priority: null,
    retriable: false,
    date: { date: "", time: "" },
    settings: "{}",
});
const taskPriority = [
    { label: t("task.form.priority_low"), value: 1 },
    { label: t("task.form.priority_normal"), value: 2 },
    { label: t("task.form.priority_high"), value: 3 },
    { label: t("task.form.priority_urgent"), value: 4 },
];

const actionMode = ref("");
const selectedAction = ref("");
const applyingAction = ref(false);
const isReady = ref(false);
const isLoading = ref(false);
const showModal = ref(false);
const modalMessage = ref(t("task.leave_msg"));

// Constants
const CREATE = "create";
const UPDATE = "update";
const RETRY = "retry";
const STOP = "stop";
const CANCEL = "cancel";

const loadTask = async () => {
    const responseLoadTask = await Tasks.task(route.params.id);
    if (responseLoadTask) {
        task.value = responseLoadTask;
        taskInput.value.name = task.value.name;
        taskInput.value.action = task.value.action;
        taskInput.value.priority = task.value.priority;
        taskInput.value.retriable = task.value.retriable;
        taskInput.value.settings = JSON.parse(task.value.settings).settings;
        taskInput.value.date = {
            date: format(task.value.scheduled_at * 1000, "Y-MM-d"),
            time: format(task.value.scheduled_at * 1000, "H:ii"),
        };
        isReady.value = true;
    }
};

const createTask = async () => {
    let status = await form.value.validate();

    if (!taskInput.value.date.time) {
        status = false;
        errorDateTime.value = true;
    }

    // TODO: VALIDATE JSON

    if (status) {
        const responseCreateTask = await Tasks.createTask(
            taskInput.value.name,
            taskInput.value.action,
            taskInput.value.priority,
            taskInput.value.retriable,
            Math.round(parseInt(taskInput.value.date.time, 10) / 1000000),
            JSON.stringify({ settings: taskInput.value.settings })
        );

        if (responseCreateTask) {
            router.push({ name: "Tasks" });
        }
    }
};

const updateTask = async () => {
    const status = await form.value.validate();

    // TODO: VALIDATE JSON

    if (status && taskInput.value.date.time) {
        const responseUpdateTask = await Tasks.updateTask(
            task.value._id,
            taskInput.value.name,
            taskInput.value.action,
            taskInput.value.priority,
            taskInput.value.retriable,
            Math.round(parseInt(taskInput.value.date.time, 10) / 1000000),
            taskInput.value.settings
        );
        if (responseUpdateTask) {
            router.push({ name: "Tasks" });
        }
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
    }
};

const handleStopTask = async () => {
    applyingAction.value = true;
    const responseStopTask = await Tasks.stopTask([+task.value.pid]);
    if (responseStopTask) {
        handleCancel();
    }
};

const handleCancelTask = async () => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask([task.value._id]);
    if (responseCancelTask) {
        handleCancel();
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
    applyingAction.value = false;
};

watch(taskInput.value, (value) => {
    if (value.date.time) {
        errorDateTime.value = false;
    }
});

if (route.params.id === "add") {
    actionMode.value = CREATE;
    isReady.value = true;
} else {
    actionMode.value = UPDATE;
    loadTask();
}
</script>

<style lang="scss" scoped></style>
