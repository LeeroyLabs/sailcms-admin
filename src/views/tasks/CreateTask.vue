<template>
    <div
        class="tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12"
    >
        <div class="tw-flex tw-flex-col tw-gap-4">
            <h3 class="tw-font-medium tw-text-xl">
                {{ $t("task.create_task") }}
            </h3>

            <v-form
                ref="form"
                class="tw-flex tw-flex-col tw-gap-2"
                v-model="isFormValid"
            >
                <v-text-field
                    color="primary"
                    :label="$t('task.form.name')"
                    variant="outlined"
                    type="text"
                    validate-on="blur"
                    density="comfortable"
                    :rules="[rules.required]"
                    v-model="newTask.name"
                />

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
                        v-model="newTask.action"
                    />
                    <v-select
                        :label="$t('task.form.priority')"
                        :items="[1, 2, 3, 4, 5]"
                        variant="outlined"
                        density="comfortable"
                        single-line
                        :rules="[rules.required]"
                        v-model="newTask.priority"
                    />
                </div>

                <v-checkbox
                    label="Retriable"
                    hide-details
                    v-model="newTask.retriable"
                />

                <div class="tw-gap-x-3 tw-flex">
                    <v-btn
                        :loading="isLoading"
                        @click.prevent="createTask"
                        color="primary"
                    >
                        {{ $t("task.form.save") }}
                    </v-btn>

                    <v-btn
                        flat
                        @click.prevent="showDeleteConfirm = true"
                        color="text"
                    >
                        {{ $t("task.form.cancel") }}
                    </v-btn>
                </div>
            </v-form>
        </div>

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                :title="$t('tasks.confirm')"
                :loading="applyingAction"
                :message="$t('tasks.confirm_msg')"
                @cancel="showDeleteConfirm = false"
                @accept="$router.push({ name: 'Tasks' })"
            />
        </Transition>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { Tasks } from "@/libs/graphql/lib/tasks";

import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const i18n = useI18n();
const router = useRouter();

// Form
const form = ref(null);
const isFormValid = ref(false);
const rules = {
    required: (value) => {
        if (value) return true;
        return i18n.t("user.errors.required");
    },
};

const newTask = ref({
    name: "",
    action: null,
    priority: null,
    retriable: false,
});
const isLoading = ref(false);
const showDeleteConfirm = ref(false);

const createTask = async () => {
    if (isFormValid.value) {
        const responseCreateTask = await Tasks.createTask(
            newTask.value.name,
            newTask.value.action,
            newTask.value.priority,
            newTask.value.retriable
        );
        if (responseCreateTask) {
            router.push({ name: "Tasks" });
        }
    }
};
</script>

<style lang="scss" scoped></style>
