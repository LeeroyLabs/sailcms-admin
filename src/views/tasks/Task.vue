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

        <div class="tw-flex tw-flex-col tw-gap-8">
            <div class="tw-flex tw-justify-between">
                <div>
                    <h3 class="tw-font-medium tw-text-xl">Task 1</h3>
                    <span>ID: </span>
                </div>
                <div>
                    <v-btn
                        @click.prevent="handleReloadTask"
                        density="comfortable"
                        rounded
                        variant="text"
                        icon="mdi-reload"
                    />
                    <v-btn
                        @click.prevent="handleDeleteTask"
                        density="comfortable"
                        color="red"
                        variant="tonal"
                        rounded
                        icon="mdi-trash-can-outline"
                        class="tw-text-red-600"
                    />
                </div>
            </div>

            <div
                class="task-config tw-h-[200px] tw-bg-[rgb(33,33,33)] tw-overflow-y-auto"
            ></div>

            <div
                class="task-log tw-h-[200px] tw-bg-[rgb(33,33,33)] tw-overflow-y-auto"
            ></div>
        </div>

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                :title="$t('task.confirm')"
                :loading="applyingAction"
                :message="$i18next.t('task.confirm_msg', { count: 1 })"
                @cancel="showDeleteConfirm = false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>

    <Loader v-else />
</template>

<script setup>
import { ref } from "vue";

import { usePage } from "@/libs/page";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { hasPermission } from "@/libs/tools";

import Loader from "@/components/globals/Loader.vue";
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const isReady = ref(true);
const page = usePage();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const { t } = i18n;
console.log("I18N", t("task.confirm_msg", { count: 1 }));

const showDeleteConfirm = ref(false);
const applyingAction = ref(false);

const handleReloadTask = () => {
    console.log("RELOAD");
};

const handleDeleteTask = () => {
    console.log("DELETE");
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    console.log("DELETE CONFIRMED");
    showDeleteConfirm.value = false;
    router.push({ name: "Tasks" });
};

// Setup page data
const setupPage = (name = "") => {
    if (route.params.id === "add") {
        page.setPageTitle("users.title");
    } else {
        page.setPageTitle(name);
    }
};
</script>

<style lang="scss" scoped></style>
