<template>
    <div class="tw-relative" ref="dd">
        <v-text-field
            ref="thefield"
            v-model="internalDisplayValue"
            variant="outlined"
            color="primary"
            :items="items"
            density="comfortable"
            :hide-details="true"
            label="Parent"
            @input="triggerSearch"
            @focus="openDD"
            :append-inner-icon="(isOpen) ? 'mdi-menu-up' : 'mdi-menu-down'"
        />

        <Transition>
            <div
                v-if="isOpen"
                class="tw-absolute tw-top-[55px] tw-inset-x-0 tw-left-0 tw-border tw-rounded-md tw-z-[999]"
                :class="{
                    'tw-bg-white tw-border-neutral-300': $vuetify.theme.name === 'light',
                    'tw-bg-darkbg tw-border-neutral-500': $vuetify.theme.name === 'dark',
                    'tw-h-[50px] tw-flex tw-items-center tw-py-2 tw-px-4': isSearching
                }"
            >
                <v-progress-linear v-if="isSearching" :indeterminate="true" height="7" color="primary" class="tw-rounded-md" />
                <template v-if="!isSearching">
                    <div class="tw-my-1" v-for="item in items">
                        <v-btn
                            @click.prevent="(e) => handleSelect(item.value)"
                            variant="flat"
                            class="tw-w-full !tw-justify-start !tw-normal-case !tw-h-[50px] tw-text-[16px]"
                            :class="{'!tw-text-primary tw-bg-primary/20': value === item.value}"
                        >
                            {{ item.title }}
                        </v-btn>
                    </div>
                </template>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash';
import { onClickOutside } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { Entries } from '@/libs/graphql/lib/entries';

const i18n = useI18n();

const emitter = defineEmits(['change']);

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    modelValue: {
        type: String,
        default: ''
    }
});

const value = ref(props.modelValue || '');
const internalDisplayValue = ref(!props.modelValue || props.modelValue === '' ? i18n.t('entry.no_parent') : items.value.find(i => i.value === v));
const items = ref([{value: '', title: i18n.t('entry.no_parent')}]);
let isSearching = ref(false);
let isOpen = ref(false);
let dd = ref(null);
const thefield = ref(null);

onMounted(() =>
{
    onClickOutside(dd, (e) =>
    {
        isOpen.value = false;
    });
});

const triggerSearch = (e) =>
{
    console.log(value.value);
    if (!value.value || value.value === '') {
        isSearching.value = false;
        items.value = [{value: '', title: i18n.t('entry.no_parent')}];
        return;
    }

    debounced();
}

const openDD = () =>
{
    if (!value.value || value.value.trim() === '') {
        isOpen.value = true;
    }
}

const search = async (e) =>
{
    if (value.value.trim() !== '') {
        isOpen.value = true;
        isSearching.value = true;

        let results = await Entries.entriesForListing(i18n.locale.value, props.type, value.value);

        items.value = [{value: '', title: i18n.t('entry.no_parent')}];

        for (let item of results) {
            items.value.push({value: item._id, title: item.title});
        }

        isSearching.value = false;
    } else {
        isSearching.value = false;
        items.value = [{value: '', title: i18n.t('entry.no_parent')}];
    }
}

const handleSelect = (v) =>
{
    internalDisplayValue.value = (v === '') ? i18n.t('entry.no_parent') : items.value.find(i => i.value === v);
    value.value = v;
    isOpen.value = false;
    isSearching.value = false;
}

let debounced = debounce(search, 500);
watch(value, v => emitter('update:modelValue', v));
</script>

<style lang="postcss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
