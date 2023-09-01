<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn
                color="primary"
                @click="$router.push({ name: 'Form', params: { id: 'add' } })"
            >
                {{ $t("form.save") }}
            </v-btn>
        </Teleport>
        FORM
        <section
            class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between"
        >
            <v-container class="tw-m-0" :fluid="true">
                <v-row>
                    <v-col cols="12" xs="12" md="3"> </v-col>

                    <v-col cols="12" xs="12" md="9"> </v-col>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const isReady = ref(true);
const router = useRouter();
const route = useRoute();

const actionMode = ref("");

// Constants
const CREATE = "create";
const UPDATE = "update";

if (route.params.id === "add") {
    actionMode.value = CREATE;
    isReady.value = true;
} else {
    actionMode.value = UPDATE;
    //loadTask();
}
</script>

<style lang="scss" scoped></style>
