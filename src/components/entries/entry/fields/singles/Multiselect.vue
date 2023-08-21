<template>
    <div class="tw-mb-3">
        <h2 class="tw-font-medium tw-mb-0.5">{{ config.label[$i18n.locale] }}</h2>
        <p v-if="config.explain[$i18n.locale] !== ''" class="tw-text-sm" :class="{'tw-text-neutral-400': $vuetify.theme.name === 'dark', 'tw-text-gray-500': $vuetify.theme.name === 'light'}">
            {{ config.explain[$i18n.locale] }}
        </p>
    </div>

    <div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-gap-x-6">
        <div class="tw-border tw-p-2 tw-rounded-md tw-w-full md:tw-w-5/12 xl:tw-w-4/12 tw-h-[230px] tw-overflow-y-auto tw-flex tw-flex-col tw-gap-y-1"
            :class="{
                'tw-border-neutral-400': $vuetify.theme.name === 'light',
                'tw-border-neutral-500': $vuetify.theme.name === 'dark'
            }"
        >
            <template v-if="!isCountry" v-for="item in config.config.choices">
                <div @click.prevent="() => toggleItem(item.value)" v-if="!values.includes(item.value)" class="tw-p-1 tw-px-2 tw-cursor-pointer tw-rounded-md hover:tw-bg-primary/40" :class="{'tw-bg-primary/40': selected.includes(item.value)}">
                    <div class="tw-truncate">{{ item.title }}</div>
                </div>
            </template>
            <template v-else v-for="item in countries">
                <div @click.prevent="() => toggleItem(item.value)" v-if="!values.includes(item.value)" class="tw-p-1 tw-px-2 tw-cursor-pointer tw-rounded-md hover:tw-bg-primary/40" :class="{'tw-bg-primary/40': selected.includes(item.value)}">
                    <div class="tw-truncate">{{ item.title }}</div>
                </div>
            </template>
        </div>


        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-y-4 tw-w-full md:tw-w-auto tw-h-[140px] md:tw-h-[230px]">
            <v-btn @click.prevent="addItems" icon="mdi-arrow-right" variant="flat" color="primary"/>
            <v-btn @click.prevent="removeItems" icon="mdi-arrow-left" variant="flat" color="primary"/>
        </div>


        <div class="tw-border tw-p-2 tw-rounded-md tw-w-full md:tw-w-5/12 xl:tw-w-4/12 tw-h-[230px] tw-overflow-y-auto tw-flex tw-flex-col tw-gap-y-1"
            :class="{
                'tw-border-neutral-400': $vuetify.theme.name === 'light',
                'tw-border-neutral-500': $vuetify.theme.name === 'dark'
            }"
        >
            <template v-for="item in values">
                <div @click.prevent="() => toggleItem2(item)" v-if="values.includes(item)" class="tw-p-1 tw-px-2 tw-cursor-pointer tw-rounded-md hover:tw-bg-primary/40" :class="{'tw-bg-primary/40': selected2.includes(item)}">
                    <div class="tw-truncate">{{ itemTitle(item) }}</div>
                </div>
            </template>
        </div>

        <div class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-y-4 tw-w-full md:tw-w-auto tw-h-[140px] md:tw-h-[230px]">
            <v-btn @click.prevent="() => moveItems('up')" icon="mdi-arrow-up" variant="flat" color="primary" :class="{'tw-opacity-30 tw-pointer-events-none': selected2.length > 1 || selected2.length === 0}"/>
            <v-btn @click.prevent="() => moveItems('down')" icon="mdi-arrow-down" variant="flat" color="primary" :class="{'tw-opacity-30 tw-pointer-events-none': selected2.length > 1 || selected2.length === 0}"/>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const emitter = defineEmits(['change']);
const i18n = useI18n();

const props = defineProps({
    value: {
        type: Array,
        default: []
    },
    config: {
        type: Object,
        default: {}
    },
    isCountry: {
        type: Boolean,
        default: false
    },
    countries: {
        type: Array,
        default: []
    }
});

const values = ref(props.value);
const selected = ref([]);
const selected2 = ref([]);

const toggleItem = (v) =>
{
    if (!selected.value.includes(v.trim())) {
        selected.value.push(v.trim());
        return;
    }

    let idx = selected.value.findIndex(i => i.trim() === v.trim());
    selected.value.splice(idx, 1);
}

const toggleItem2 = (v) =>
{
    if (!selected2.value.includes(v.trim())) {
        selected2.value.push(v.trim());
        return;
    }

    let idx = selected2.value.findIndex(i => i.trim() === v.trim());
    selected2.value.splice(idx, 1);
}

const addItems = () =>
{
    values.value.push(...selected.value);
    selected.value = [];
    emitter('change', values.value);
}

const removeItems = () =>
{
    values.value = values.value.filter(v => !selected2.value.includes(v));
    selected2.value = [];
    emitter('change', values.value);
}

const itemTitle = (id) =>
{
    const item = props.config.config.choices.find(v => v.value.trim() === id.trim());

    if (item) return item.title;
    return '';
}

const moveItems = (direction) =>
{
    let newIndex;

    let currentIndex = values.value.findIndex(v => v === selected2.value[0]);

    if (direction === 'up') {
        newIndex = (currentIndex - 1 < 0) ? 0 : currentIndex - 1;
    } else {
        newIndex = (currentIndex + 1 > values.value.length) ? values.value.length - 1 : currentIndex + 1;
    }

    values.value.splice(currentIndex, 1);
    values.value.splice(newIndex, 0, selected2.value[0]);
}

</script>
