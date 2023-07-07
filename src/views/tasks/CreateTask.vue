<template>
    <div
        class="tw-w-full md:tw-w-10/12 lg:tw-w-8/12 xl:tw-w-8/12 2xl:tw-w-7/12"
    >
        <h3 class="tw-font-medium tw-text-xl">{{ $t("task.create_task") }}</h3>
        <v-form ref="form">
            <v-text-field
                color="primary"
                :label="$t('task.name')"
                variant="outlined"
                type="text"
                validate-on="blur"
                density="comfortable"
                :rules="[rules.required]"
                v-model="newTask.name"
            />

            <v-checkbox label="Retriable" v-model="newTask.retriable" />

            <div class="tw-gap-x-3 tw-flex">
                <v-btn
                    :loading="isLoading"
                    @click.prevent="saveTask"
                    color="primary"
                >
                    {{ $t("task.save") }}
                </v-btn>

                <v-btn
                    flat
                    @click.prevent="showDeleteConfirm = true"
                    color="text"
                >
                    {{ $t("task.cancel") }}
                </v-btn>
            </div>
        </v-form>

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
import DeleteConfirmation from "@/components/globals/DeleteConfirmation.vue";

const i18n = useI18n();

// Form
const form = ref(null);
const rules = {
    required: (value) => !!value || i18n.t("user.errors.required"),
};

const newTask = ref({ name: "", retriable: false });
const isLoading = ref(false);
const showDeleteConfirm = ref(false);

const saveTask = () => {
    console.log("SAVE TASK");
};
</script>

<style lang="scss" scoped></style>
