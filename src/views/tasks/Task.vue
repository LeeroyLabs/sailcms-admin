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
                    class="task-config tw-h-[200px] tw-bg-[rgb(33,33,33)] tw-overflow-y-auto"
                ></div>
            </div>

            <div>
                <h4 class="tw-font-medium tw-text-sm tw-mb-2">Logs</h4>
                <div
                    class="task-config tw-h-[200px] tw-bg-[rgb(33,33,33)] tw-overflow-y-auto"
                ></div>
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
            <div
                id="calendar"
                v-show="selectedAction === RESCHEDULE"
                class="tw-fixed tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]"
            >
                <v-card rounded class="tw-p-6">
                    <v-card-title>Select a new date</v-card-title>
                    <div
                        ref="datePicker"
                        :data-date="rescheduledDate"
                        @changeDate="handleSelectDate"
                    ></div>

                    <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                        <v-btn
                            :disabled="loading"
                            @click.prevent="selectedAction = ''"
                            flat
                        >
                            {{ $t("system.no") }}
                        </v-btn>
                        <v-btn
                            type="primary"
                            variant="flat"
                            color="red"
                            @click.prevent="$emit('accept')"
                            :loading="loading"
                        >
                            {{ $t("system.yes") }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import { usePage } from "@/libs/page";
import { Tasks } from "@/libs/graphql/lib/tasks";
import { hasPermission } from "@/libs/tools";
import { Datepicker } from "vanillajs-datepicker";
import "vanillajs-datepicker/css/datepicker.css";

import Loader from "@/components/globals/Loader.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const page = usePage();
const route = useRoute();

const isReady = ref(false);
const task = ref(null);
const selectedAction = ref("");
const applyingAction = ref(false);
const showModal = ref(false);
const modalMessage = ref("");
const datePicker = ref(null);
const rescheduledDate = ref(Date.now());

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
        console.log("TASK", task.value);
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

const handleChangeTaskSchedule = async () => {
    applyingAction.value = true;
    const responseChangeTaskSchedule = await Tasks.changeTaskSchedule(
        task.value._id,
        rescheduledDate.value
    );
    if (responseChangeTaskSchedule) {
        showModal.value = false;
        selectedAction.value = "";
        modalMessage.value = "";
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
    }
};

const applyAction = async () => {
    switch (selectedAction.value) {
        case RETRY:
            await handleRetryTask();
            break;
        case RESCHEDULE:
            await handleChangeTaskSchedule();
            break;
        case STOP:
            await handleStopTask();
            break;
        case CANCEL:
            await handleCancelTask();
            break;
    }
};

watch(isReady, (newValue) => {
    if (newValue) {
        nextTick(() => new Datepicker(datePicker.value, {}));
    }
});

const handleSelectDate = (event) => {
    rescheduledDate.value = event.detail.datepicker.dates[0];
};

// Setup page data
const setupPage = (name = "") => {
    page.setPageTitle(name);
};

setupPage();
loadTask();
</script>

<style lang="scss" scoped>
#calendar {
    :deep(.datepicker-picker) {
        @apply tw-bg-transparent;
    }

    :deep(.datepicker-controls .button) {
        @apply tw-bg-transparent;
    }

    .day {
        @apply tw-text-black;
    }
    .prev,
    .next {
        @apply tw-text-gray-400;
    }
}
</style>
