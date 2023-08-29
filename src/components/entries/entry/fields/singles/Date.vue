<template>
    <div
        :id="'dpp_' + dpid"
        class="tw-relative dp tw-h-[50px] tw-rounded tw-outline tw-outline-1 tw-py-2 tw-px-3 focus-within:tw-outline-2 tw-cursor-pointer"
        :class="{
            'tw-outline-neutral-400 focus-within:tw-outline-primary focus-within:hover:tw-outline-2 focus-within:hover:tw-outline-primary hover:tw-outline-1 hover:tw-outline-black':
                $vuetify.theme.name === 'light' && !error,
            'tw-outline-neutral-500 focus-within:tw-outline-white focus-within:hover:tw-outline-2 hover:tw-outline-1 hover:tw-outline-white':
                $vuetify.theme.name === 'dark' && !error,
            'tw-outline-[#B00020] focus-within:tw-outline-[#B00020] hover:tw-outline-[#B00020]':
                error && $vuetify.theme.name === 'light',
            'tw-outline-[#CF6679] focus-within:tw-outline-[#CF6679] hover:tw-outline-[#CF6679]':
                error && $vuetify.theme.name === 'dark',
        }"
    >
        <input
            :id="id"
            :placeholder="placeholder"
            v-bind:value="
                typeof value === 'object'
                    ? value.date + sepChar + value.time
                    : value
            "
            class="focus-visible:tw-ring-0 focus-visible:tw-outline-0 tw-h-full tw-w-full tw-cursor-pointer"
            :class="[
                $vuetify.theme.name === 'light'
                    ? {
                          'placeholder:!tw-text-[#B00020] placeholder:!tw-opacity-100':
                              error,
                      }
                    : {
                          'placeholder:!tw-text-[#CF6679] placeholder:!tw-opacity-100':
                              error,
                      },
                $vuetify.theme.name === 'light'
                    ? 'placeholder:tw-text-black placeholder:tw-opacity-50'
                    : 'placeholder:tw-text-white placeholder:tw-opacity-70',
            ]"
        />

        <span
            v-if="error"
            class="tw-absolute -tw-bottom-6 tw-left-4 tw-text-xs tw-tracking-wide"
            :class="
                $vuetify.theme.name === 'light'
                    ? 'tw-text-[#B00020]'
                    : 'tw-text-[#CF6679]'
            "
        >
            Required
        </span>
    </div>
</template>

<script setup>
import flatpickr from "flatpickr";
import locales from "flatpickr/dist/l10n/index";

import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useTheme } from "vuetify";
import { v4 } from "uuid";

const emitter = defineEmits(["change"]);

const sepChar = " — ";

const props = defineProps({
    value: {
        type: String,
        default: "",
    },
    showTime: {
        type: Boolean,
        default: false,
    },
    config: {
        type: Object,
        default: {
            type: "",
            label: "",
            name: "",
            validation: "",
            required: false,
            repeatable: false,
            config: null,
        },
    },
    index: {
        type: Number,
        default: "",
    },
    id: {
        type: String,
        default: "date_" + v4(),
    },
    placeholder: {
        type: String,
        required: false,
        default: "",
    },
    useTimestamp: {
        type: Boolean,
        default: false,
    },
    minuteIncrement: {
        type: Number,
        default: 5,
    },
    error: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const i18n = useI18n();
const theme = useTheme();
const datepicker = ref(null);
const dpid = ref(v4());

const handleDateChange = (selectedDates, dateStr, instance) => {
    if (props.config.config.range) {
        let dates = dateStr.split(" ");

        // Range, wait til we are done
        if (dates.length === 1) {
            return;
        }

        if (props.useTimestamp) {
            emitter("change", Math.floor(selectedDates.getTime() / 1000));
            return;
        }

        if (props.useTimestamp) {
            const timestamps = selectedDates.map((d) =>
                Math.floor(d.getTime() / 1000)
            );
            emitter("change", timestamps);
            return;
        }

        emitter("change", [dates[0], dates[2]]);
        return;
    }

    if (props.showTime) {
        const [d, t] = dateStr.split(sepChar);
        emitter("change", { date: d, time: t });
        return;
    }

    emitter("change", dateStr);
};

const initPicker = () => {
    const el = document.querySelector("#" + props.id);
    datepicker.value = flatpickr(el, {
        positionElement: document.querySelector("#" + props.id),
        dateFormat: props.showTime
            ? props.config.config.date_format +
              sepChar +
              props.config.config.time_format
            : props.config.config.date_format,
        locale: locales[i18n.locale.value],
        enableTime: props.showTime,
        minuteIncrement: props.minuteIncrement,
        mode: props.config.config.range ? "range" : "single",
        minDate: props.config.config.minDate
            ? props.config.config.minDate
            : null,
        onChange: handleDateChange,
    });
};

const validate = () => {};

onMounted(() => {
    if (theme.name.value === "light") {
        document
            .getElementById("calendar-theme")
            .setAttribute(
                "href",
                "https://npmcdn.com/flatpickr@4.6.13/dist/themes/light.css"
            );
    } else {
        document
            .getElementById("calendar-theme")
            .setAttribute(
                "href",
                "https://npmcdn.com/flatpickr@4.6.13/dist/themes/dark.css"
            );
    }

    initPicker();
});

watch(theme.name, (v) => {
    if (v === "light") {
        document
            .getElementById("calendar-theme")
            .setAttribute(
                "href",
                "https://npmcdn.com/flatpickr@4.6.13/dist/themes/light.css"
            );
    } else {
        document
            .getElementById("calendar-theme")
            .setAttribute(
                "href",
                "https://npmcdn.com/flatpickr@4.6.13/dist/themes/dark.css"
            );
    }
});

const localize = (locale) => {
    if (!datepicker.value) return;
    initPicker();
};

watch(i18n.locale, (v) => localize(v));
</script>

<style>
.dark .flatpickr-calendar {
    border-width: 1px;
    border-style: solid;
    @apply tw-bg-darkbg !tw-border !tw-border-neutral-500;
}

.dark .flatpickr-months .flatpickr-month {
    @apply tw-rounded-t-md;
}

.dark .flatpickr-months .flatpickr-month,
.dark .flatpickr-monthDropdown-months,
.dark .flatpickr-weekdays,
.dark .flatpickr-weekday {
    @apply tw-bg-[#111111];
}

.dark .flatpickr-weekdays {
    @apply tw-border-t tw-border-neutral-700;
}

.flatpickr-calendar.arrowBottom:before,
.flatpickr-calendar.arrowTop:before,
.flatpickr-calendar.arrowBottom:after,
.flatpickr-calendar.arrowTop:after {
    @apply !tw-hidden;
}

.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n + 1)),
.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n + 1)) {
    @apply !tw-shadow-calendar;
}

.flatpickr-day.selected,
.flatpickr-day.startRange,
.flatpickr-day.endRange {
    @apply !tw-bg-primary !tw-border-primary;
}
</style>
