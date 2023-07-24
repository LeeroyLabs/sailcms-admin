<template>
    <div v-if="isReady">
        <div class="tw-flex tw-flex-col tw-gap-8">
            <div class="tw-flex tw-justify-between">
                <div>
                    <h3 class="tw-font-medium tw-text-xl">{{ task.name }}</h3>
                    <span>ID: {{ task._id }}</span>
                    <p>Priority: {{ task.priority }}</p>
                </div>

                <div>
                    <div class="tw-flex tw-justify-end">
                        <v-btn
                            @click.prevent="router.push({ name: 'Tasks' })"
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-arrow-left"
                        />
                        <v-btn
                            @click.prevent="handleRetryTask"
                            density="comfortable"
                            rounded
                            variant="text"
                            icon="mdi-reload"
                        />
                        <v-btn
                            @click.prevent="handleCancelTask"
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
                :message="
                    selectedAction === 'retry'
                        ? $t('task.retry_msg')
                        : $t('task.cancel_msg')
                "
                @cancel="showModal = false"
                @accept="
                    selectedAction === 'retry'
                        ? confirmRetryTask
                        : confirmCancelTask
                "
            />
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import { usePage } from "@/libs/page";
import { Tasks } from "@/libs/graphql/lib/tasks";

import Loader from "@/components/globals/Loader.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const isReady = ref(false);
const page = usePage();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();

const task = ref(null);
const selectedAction = ref("");
const showModal = ref(false);
const applyingAction = ref(false);

const loadTask = async () => {
    const responseLoadTask = await Tasks.task(route.params.id);
    if (responseLoadTask) {
        task.value = responseLoadTask;
        isReady.value = true;
    }
};

// Retry task
const handleRetryTask = async () => {
    showModal.value = true;
    selectedAction.value = "retry";
};

const confirmRetryTask = async () => {
    applyingAction.value = true;
    const responseRetryTask = await Tasks.retryTask(task.value._id);
    if (responseRetryTask) {
        showModal.value = false;
        selectedAction.value = "";
        applyingAction.value = false;
    }
};

// Cancel task
const handleCancelTask = () => {
    showModal.value = true;
    selectedAction.value = "cancel";
};

const confirmCancelTask = async () => {
    applyingAction.value = true;
    const responseCancelTask = await Tasks.cancelTask(task.value._id);
    if (responseCancelTask) {
        showModal.value = false;
        selectedAction.value = "";
        applyingAction.value = false;
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
