<template>
    <div class="tw-relative">
        <div
            class="drag-handle tw-cursor-grab tw-absolute tw-border tw-border-b-0 tw-top-[-28px] tw-flex tw-flex-row tw-items-center tw-justify-between tw-left-0 tw-text-black tw-py-1 tw-px-3 tw-rounded-t-lg tw-text-sm"
            :class="{'tw-bg-white tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
        >
            {{ title }}

            <button class="tw-ml-4">
                <v-icon icon="mdi-cog" size="small" class="hover:tw-text-red-500"/>
            </button>
        </div>
        <div
            class="tw-border tw-rounded-tr-lg tw-rounded-b-lg tw-w-[290px] md:tw-w-[320px] lg:tw-w-[350px] tw-p-4 tw-h-full"
            :class="{'tw-bg-white tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
        >

        <div :id="'tab-' + tab.id" class="field-list tw-flex tw-flex-col tw-gap-3 sorting-parent tw-min-h-full">
            <div
                v-for="(element, index) in tab.fields"
                :id="element.key"
                :data-fid="'field-' + element.key"
                class="tw-border tw-py-2 tw-px-2 tw-flex tw-flex-row tw-items-center"
                :class="{'tw-bg-white hover:tw-bg-gray-100 tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white hover:tw-bg-neutral-800 tw-border-neutral-500': $vuetify.theme.name === 'dark'}"
            >
                <v-icon
                    icon="mdi-menu"
                    class="list-dnd-handle tw-mr-2 tw-cursor-grab"
                    :class="{'tw-text-zinc-400': $vuetify.theme.name === 'light', 'tw-text-neutral-500': $vuetify.theme.name === 'dark'}"
                />
                <div class="tw-truncate tw-mr-1">Name of Field {{ element.key}}</div>
                <div class="tw-flex-grow tw-flex tw-flex-row tw-justify-end tw-gap-x-2">
                    <button><v-icon icon="mdi-cog" size="small" class="hover:tw-text-primary"/>
                        <v-tooltip activator="parent" location="bottom" :open-delay="750">Field Settings</v-tooltip>
                    </button>
                    <button><v-icon icon="mdi-content-duplicate" size="small" class="hover:tw-text-primary"/>
                        <v-tooltip color="#000" activator="parent" location="bottom" :open-delay="750">Duplicate Field</v-tooltip>
                    </button>
                    <button><v-icon icon="mdi-trash-can-outline" size="small" class="hover:tw-text-red-500"/>
                        <v-tooltip activator="parent" location="bottom" :open-delay="750">Delete Field</v-tooltip>
                    </button>
                </div>
            </div>
        </div>



<!--                {{ tab.fields.length }}-->

<!--                <div v-for="field in tab.fields">{{ field.key }}</div>-->

<!--                <Sortable-->
<!--                    :ref="sortable"-->
<!--                    :list="tab.fields"-->
<!--                    item-key="data-fid"-->
<!--                    tag="div"-->
<!--                    :options="opts"-->
<!--                    class="tw-flex tw-flex-col tw-gap-3 tw-mb-3 tw-min-h-[45px] sorting-parent"-->
<!--                    @add="handleChange"-->
<!--                    @update="handleChange"-->
<!--                    @remove="handleChange"-->
<!--                >-->
<!--                <div-->
<!--                    @click="openFieldSelector"-->
<!--                    class="tw-border tw-border-zinc-400 tw-py-2 tw-px-3 tw-cursor-pointer hover:tw-bg-primary hover:tw-text-white"-->
<!--                    :class="{'tw-bg-white hover:tw-bg-gray-100 tw-border-zinc-400': $vuetify.theme.name === 'light', 'tw-bg-neutral-900 tw-text-white hover:tw-bg-neutral-800 tw-border-neutral-500': $vuetify.theme.name === 'dark'}"-->
<!--                >-->
<!--                    <v-icon icon="mdi-plus"/>-->
<!--                    Add Field-->
<!--                </div>-->
        </div>
    </div>
</template>

<script setup>
import Sortable from 'sortablejs';
import { onMounted, ref, watch } from 'vue';

const emitter = defineEmits(['change']);

const props = defineProps({
    tab: {
        type: Object,
        default: null
    },
    title: {
       type: String,
       default: 'Unamed'
    }
});

let sortable;

const handleChange = (e) =>
{
    emitter('change', {
        tab: props.tab.id,
        event: e.type,
        field: e.item.id,
        index: e.newIndex,
        oldIndex: e.oldIndex
    });
}

const opts = {
    group: 'shared',
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

onMounted(() =>
{
    let el = document.querySelector('#tab-' + props.tab.id);
    sortable = new Sortable(el, opts);
});

</script>
