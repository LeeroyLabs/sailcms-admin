<template>
    <div
        :id="'dpp_' + dpid"
        class="dp tw-h-[50px] tw-rounded-md tw-border tw-py-2 tw-px-3 focus-within:!tw-px-[11px] focus-within:tw-border-primary focus-within:tw-border-[2px] tw-relative group"
        :class="{'tw-border-neutral-400': $vuetify.theme.name === 'light', 'tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
    >
        <template v-if="config.label !== undefined && innerValueSet && showFloatingLabel">
            <div class="tw-text-xs tw-absolute tw-top-[-8px] tw-px-1 tw-text-primary" :class="{'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-neutral-900': $vuetify.theme.name === 'dark'}">{{ config.label[$i18n.locale] }}</div>
        </template>

        <input :placeholder="config.label[$i18n.locale]" :id="id" v-bind:value="(typeof value === 'object') ? value.date + sepChar + value.time : value" class="focus-visible:tw-ring-0 focus-visible:tw-outline-0 tw-h-full tw-w-full"/>


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

import { nextTick, onMounted, ref, watch } from 'vue';
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
    showFloatingLabel: {
        type: Boolean,
        default: false
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
const innerValueSet = ref(false);

if (props.value !== undefined && props.value !== null && props.value !== '') {
    innerValueSet.value = true;
}

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

    innerValueSet.value = true;
    emitter("change", dateStr);
};

const initPicker = () =>
{
    const el = document.querySelector('#' + props.id);
    let locale = locales[i18n.locale.value];

    datepicker.value = flatpickr(el, {
        positionElement: document.querySelector('#' + props.id),
        dateFormat: (props.showTime) ? props.config.config.date_format + sepChar + props.config.config.time_format : props.config.config.date_format,
        locale: locale,
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

    nextTick(() => initPicker());
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
