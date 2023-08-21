<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                v-if="hasPermission('readwrite_task')"
                color="primary"
                @click="$router.push({ name: 'Tasks' })"
            >
                {{ $t("task.back") }}
            </v-btn>
        </Teleport>

        <div class="tw-flex tw-flex-col tw-gap-8">
            <div class="tw-flex tw-justify-between">
                <div>
                    <h3 class="tw-font-medium tw-text-xl">{{ task.name }}</h3>
                    <span>ID: {{ task._id }}</span>
                    <p>Priority: {{ task.priority }}</p>
                </div>

                <div>
                    <div class="tw-flex tw-gap-2 tw-justify-end">
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
                    <p>
                        {{
                            task.executed
                                ? `Started at: ${task.executed_at}`
                                : `Scheduled at: ${new Date(
                                      task.scheduled_at * 1000
                                  ).toLocaleDateString("en-US")}`
                        }}
                    </p>
                </div>
            </div>

            <div>
                <h4 class="tw-font-medium tw-text-sm tw-mb-2">Config</h4>
                <div
                    class="tw-h-[200px] tw-overflow-y-auto tw-bg-darkbg"
                    :class="{
                        'tw-text-gray-200': $vuetify.theme.name === 'light',
                    }"
                ></div>
            </div>

            <div>
                <h4 class="tw-font-medium tw-text-sm tw-mb-2">Logs</h4>
                <div
                    class="tw-h-[200px] tw-overflow-y-auto tw-p-5 tw-bg-darkbg mb-6"
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
        </div>

        <Transition>
            <DeleteConfirmation
                v-if="showModal"
                :show="true"
                :overall="true"
                :title="$t('task.confirm')"
                :loading="applyingAction"
                :message="modalMessage"
                @cancel="showModal = false"
                @accept="applyAction"
            />
        </Transition>

        <Transition>
            <DatePicker
                :show="selectedAction === RESCHEDULE"
                @cancel="selectedAction = ''"
                @selected="handleChangeTaskSchedule($event)"
            />
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { usePage } from "@/libs/page";
import { Tasks } from "@/libs/graphql/lib/tasks";
import { hasPermission } from "@/libs/tools";

import Loader from "@/components/globals/Loader.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";
import DatePicker from "@/components/globals/task/DatePicker.vue";

const page = usePage();
const route = useRoute();
const router = useRouter();

const isReady = ref(false);
const task = ref(null);
const taskLogs = ref([]);
const selectedAction = ref("");
const applyingAction = ref(false);
const showModal = ref(false);
const modalMessage = ref("");

// Constants
const RETRY = "retry";
const RESCHEDULE = "reschedule";
const STOP = "stop";
const CANCEL = "cancel";

const loadTask = async () => {
    const responseLoadTask = await Tasks.task(route.params.id);
    if (responseLoadTask) {
        task.value = responseLoadTask;
        isReady.value = true;
        loadTaskLogs(task.value._id);
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
    const responseRetryTask = await Tasks.retryTask(task.value._id);
    if (responseRetryTask) {
        showModal.value = false;
        selectedAction.value = "";
        modalMessage.value = "";
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
        showModal.value = false;
        selectedAction.value = "";
        modalMessage.value = "";
        loadTask();
        applyingAction.value = false;
    }
};

const handleStopTask = async () => {
    applyingAction.value = true;
    const responseStopTask = await Tasks.stopTask(task.value._id);
    if (responseStopTask) {
        showModal.value = false;
        selectedAction.value = "";
        modalMessage.value = "";
        applyingAction.value = false;
    }
};

const handleCancelTask = async () => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask(task.value._id);
    if (responseCancelTask) {
        showModal.value = false;
        selectedAction.value = "";
        modalMessage.value = "";
        applyingAction.value = false;
        router.push({ name: "Tasks" });
    }
};

const loadTaskLogs = async () => {
    const responseTaskLogs = await Tasks.taskLogs(task.value._id);
    if (responseTaskLogs) {
        taskLogs.value = responseTaskLogs;
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
    }
};

// Setup page data
const setupPage = (name = "") => {
    page.setPageTitle(name);
};

setupPage();
loadTask();
</script>

<style lang="scss" scoped></style>
