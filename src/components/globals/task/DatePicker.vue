<template>
    <div
        id="date-picker"
        v-show="show"
        class="tw-fixed tw-bg-black/40 tw-inset-0 tw-flex tw-flex-row tw-items-center tw-justify-center tw-z-[9999]"
    >
        <v-card rounded class="tw-p-6">
            <v-card-title>{{ $t("task.select_date") }}</v-card-title>
            <v-card-text class="tw-min-w-[300px] lg:tw-min-w-[450px] tw-mt-4">
                {{ $t("task.reschedule_msg") }}
            </v-card-text>

            <div
                ref="datePicker"
                class="tw-flex tw-justify-center tw-mt-2 tw-mb-4"
                :data-date="rescheduledDate"
                @changeDate="handleSelectDate"
            ></div>

            <v-card-actions class="tw-flex tw-flex-row tw-justify-end">
                <v-btn
                    :disabled="loading"
                    @click.prevent="$emit('cancel')"
                    flat
                >
                    {{ $t("task.cancel") }}
                </v-btn>
                <v-btn
                    type="primary"
                    variant="flat"
                    color="red"
                    @click.prevent="$emit('selected', rescheduledDate)"
                    :loading="loading"
                >
                    {{ $t("task.save") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Datepicker } from "vanillajs-datepicker";
import "vanillajs-datepicker/css/datepicker.css";

defineProps({
    show: {
        type: Boolean,
        default: false,
    },
});
defineEmits(["cancel", "selected"]);

const datePicker = ref(null);
const rescheduledDate = ref(Date.now());

const handleSelectDate = (event) => {
    rescheduledDate.value = event.detail.datepicker.dates[0];
};

onMounted(
    () =>
        new Datepicker(datePicker.value, {
            prevArrow: "<",
            nextArrow: ">",
            minDate: rescheduledDate.value,
        })
);
</script>

<style lang="scss" scoped>
#date-picker {
    :deep(.datepicker-picker) {
        @apply tw-bg-transparent;
    }

    :deep(.datepicker-controls .button) {
        @apply tw-bg-transparent tw-text-white;
    }

    :deep(.datepicker-controls .button[disabled]) {
        @apply tw-opacity-10 tw-cursor-default tw-select-none;
    }

    :deep(.datepicker-cell:not(.disabled):hover) {
        @apply tw-text-black;
    }

    :deep(.datepicker-cell.disabled) {
        @apply tw-opacity-10;
    }
}
</style>
