<template>
    <div class="tw-relative">
        <div
            class="drag-handle tw-cursor-grab tw-absolute tw-border tw-border-b-0 tw-top-[-28px] tw-flex tw-flex-row tw-items-center tw-justify-between tw-left-0 tw-text-black tw-py-1 tw-px-3 tw-rounded-t-lg tw-text-sm"
            :class="{'tw-bg-white tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
        >
            {{ tab.label }}

            <button @click.prevent="showTabSettings=true" class="tw-ml-4">
                <v-icon icon="mdi-cog" size="small" class="hover:tw-text-primary"/>
            </button>
        </div>
        <div
            class="tw-border tw-rounded-tr-lg tw-rounded-b-lg tw-w-[290px] md:tw-w-[320px] lg:tw-w-[350px] tw-p-4 tw-h-full"
            :class="{'tw-bg-white tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
        >

            <div :id="'tab-' + tab.id" class="field-list tw-flex tw-flex-col tw-gap-3 sorting-parent tw-min-h-full tw-h-full tw-relative">
                <div
                    v-for="(element, index) in tab.fields"
                    :id="element"
                    :data-fid="'field-' + element"
                    class="tw-border tw-py-2 tw-px-2 tw-flex tw-flex-row tw-items-center"
                    :class="{'tw-bg-white hover:tw-bg-gray-100 tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white hover:tw-bg-neutral-800 tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
                >
                    <v-icon
                        icon="mdi-menu"
                        class="list-dnd-handle tw-mr-2 tw-cursor-grab"
                        :class="{'tw-text-zinc-400': $vuetify.theme.name === 'light', 'tw-text-neutral-500': $vuetify.theme.name === 'dark'}"
                    />
                    <div class="tw-truncate tw-mr-1">{{ fields.find(f => f.key === element)?.name }}</div>
                    <div class="tw-flex-grow tw-flex tw-flex-row tw-justify-end tw-gap-x-2">
                        <button @click.prevent="removeField(index, tab.id)"><v-icon icon="mdi-trash-can-outline" size="small" class="hover:tw-text-red-500"/>
                            <v-tooltip activator="parent" location="bottom" :open-delay="750">{{ $t('layout.delete_field') }}</v-tooltip>
                        </button>
                    </div>
                </div>
                <div class="tw-relative tw-h-full">
                    <!-- Small + button -->
                    <template v-if="tab.fields.length > 0">
                        <v-btn @click.prevent="showAddBox=true" variant="flat" color="primary" class="tw-w-full">{{ $t('layout.add_field') }}</v-btn>
                    </template>

                    <!-- Big + button -->
                    <template v-if="tab.fields.length === 0">
                        <div
                            class="tw-h-full tw-min-h-[75px] tw-w-full tw-flex tw-flex-row tw-items-center tw-justify-center tw-rounded-md"
                            :class="{'tw-bg-gray-100': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}"
                        >
                            <div
                                @click.prevent="() => { offsetBox = true; showAddBox = true; }"
                                class="tw-rounded-full tw-w-[40px] tw-h-[40px] tw-cursor-pointer hover:tw-bg-primary tw-flex tw-flex-row tw-items-center tw-justify-between tw-text-white tw-transition tw-duration-250"
                                :class="{'tw-bg-gray-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-700': $vuetify.theme.name === 'dark'}"
                            >
                                <v-icon icon="mdi-plus" class="tw-mx-auto"/>
                            </div>
                        </div>
                    </template>

                    <!-- Field selector -->
                    <Transition>
                        <ArrowUpBox v-if="showAddBox" ref="addbox" :offset="offsetBox">
                            <template v-slot:extra>
                                <v-text-field
                                    variant="outlined"
                                    color="primary"
                                    :clearable="true"
                                    :hide-details="true"
                                    :single-line="true"
                                    v-model="searchFilter"
                                    append-inner-icon="mdi-magnify"
                                    density="comfortable"
                                    :label="$t('system.search')"
                                    class="tw-mb-2"
                                />
                            </template>
                            <template v-slot:default>
                                <div class="tw-flex tw-flex-col tw-gap-y-2">
                                    <template v-for="(element, index) in fields.filter(f => deburr(f.name.toLowerCase()).includes(deburr(searchFilter.toLowerCase())))">
                                        <div
                                            @click.prevent="addToTab(element, tab.id)"
                                            class="tw-p-2 tw-border tw-border-neutral-300 tw-rounded-md tw-cursor-pointer"
                                            :class="{'tw-pointer-events-none tw-opacity-50 tw-select-none': isUsed(element.key), 'hover:tw-bg-zinc-800 ': $vuetify.theme.name === 'dark', 'hover:tw-bg-gray-200': $vuetify.theme.name === 'light'}"
                                        >
                                            {{ element.name }}
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </ArrowUpBox>
                    </Transition>
                </div>
            </div>
        </div>
    </div>

    <Transition>
        <TabSettings
            v-if="showTabSettings"
            :tab="tab"
            @close="showTabSettings=false"
            @delete="() => $emit('tabDeleted', tab)"
            @update="(e) => $emit('tabNameChange', {tab: tab, label: e})"
        />
    </Transition>
</template>

<script setup>
import Sortable from 'sortablejs';
import { onMounted, ref } from 'vue';
import { deburr } from 'lodash';
import ArrowUpBox from '@/components/globals/ArrowUpBox.vue';
import { onClickOutside } from '@vueuse/core';
import TabSettings from '@/components/entries/layout/TabSettings.vue';

const emitter = defineEmits(['change', 'added', 'tabDeleted', 'tabNameChange']);

const props = defineProps({
    tab: {
        type: Object,
        default: null
    },
    fields: {
        type: Array,
        default: []
    },
    title: {
       type: String,
       default: 'Unamed'
    },
    used: {
        type: Array,
        default: []
    }
});

let sortable;
const searchFilter = ref('');
const showAddBox = ref(false);
const addbox = ref(null);
const offsetBox = ref(false);
const usedFields = ref([]);
const showTabSettings = ref(false);

const handleChange = (e) =>
{
    let tab = 'tab-' + props.tab.id;

    let children = Array.from(document.getElementById(tab).children).map(c => c.id);
    usedFields.value = children.filter(c => c !== '');
    emitter('change', {tab: props.tab.id, used: usedFields.value});
}

onClickOutside(addbox, (e) => showAddBox.value = false);

const opts = {
    tag: 'div',
    direction: 'vertical',
    handle: '.list-dnd-handle',
    ghostClass: 'ghost',
    animation: 0,
    swapTreshold: 0.45,
    dragoverBubble: false,
    onAdd: handleChange,
    onRemove: handleChange,
    onUpdate: handleChange
};

const addToTab = (element, tab) =>
{
    offsetBox.value = false;
    usedFields.value.push(element.key);
    emitter('added', {element: element, key: element.key, tab: tab, used: usedFields.value});
}

const removeField = (index, tab) =>
{
    const field = usedFields.value[index];
    usedFields.value.splice(index, 1);
    emitter('removed', {tab: tab, key: field, used: usedFields.value});
}

const isUsed = (key) =>
{
    let field = props.fields.find(f => f.key === key);
    if (field) return field.used;
    return false;
}

onMounted(() =>
{
    usedFields.value = props.tab.fields;
    let el = document.querySelector('#tab-' + props.tab.id);
    sortable = new Sortable(el, opts);
});
</script>

<style>
.arrow::after {
    content: '';
    height: 10px;
    width: 10px;
    position: absolute;
    top: -6px;
    left: calc(50% - 5px);
    transform: rotate(45deg);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
