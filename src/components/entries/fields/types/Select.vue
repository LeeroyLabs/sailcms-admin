<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <div class="tw-w-full tw-col-span-2">
            <h2 class="tw-mb-3">Add choice</h2>
            <div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-w-full md:tw-w-8/12 lg:tw-w-7/12 xl:tw-w-6/12 tw-gap-x-6">
                <v-text-field
                    variant="outlined"
                    color="primary"
                    hide-details
                    density="comfortable"
                    :label="$t('fields.options.value')"
                    v-model="value"
                    class="tw-w-4/12"
                />
                <v-text-field
                    variant="outlined"
                    color="primary"
                    hide-details
                    density="comfortable"
                    :label="$t('fields.options.select_label')"
                    v-model="label"
                    class="tw-w-4/12"
                />
                <div class="tw-flex-grow tw-w-4/12">
                    <v-btn @click.prevent="addChoice" variant="flat" color="primary" class="tw-mt-1.5">Add Choice</v-btn>
                </div>
            </div>

            <div
                class="tw-border tw-p-4 tw-mt-6 tw-mb-2 tw-w-full md:tw-w-8/12 lg:tw-w-7/12 xl:tw-w-6/12 tw-rounded-md"
                :class="{'tw-border-black/30': $vuetify.theme.name === 'light', 'tw-border-white/30': $vuetify.theme.name === 'dark'}"
            >
                <h3 v-if="internalValue.choices.length === 0" class="tw-text-center tw-font-medium">No Choices yet.</h3>

                <div v-else id="sortable-choices" class="tw-flex tw-flex-col tw-gap-y-2">
                    <div
                        v-for="choice in internalValue.choices"
                        :id="choice.value"
                        class="tw-px-4 tw-py-2 tw-group tw-rounded-md tw-flex tw-flex-row tw-items-center tw-justify-between"
                        :class="{'hover:tw-bg-neutral-800 tw-border tw-border-white/30': $vuetify.theme.name === 'dark', 'hover:tw-bg-gray-300 tw-border tw-border-black/30': $vuetify.theme.name === 'light'}"
                    >
                        <div>
                            <v-icon icon="mdi-menu" class="list-dnd-handle tw-mr-1 tw-cursor-grab"/>
                            {{ choice.value }} : {{ choice.title }}
                        </div>
                        <a href="" class="hover:tw-text-red-500 tw-invisible group-hover:tw-visible">
                            <v-icon icon="mdi-trash-can-outline" size="small"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="tw-col-span-2 tw-mt-[-10px]">
            <div class="tw-flex tw-flex-row tw-gap-x-6">
                <v-switch
                    v-model="internalValue.multi"
                    :label="$t('fields.options.multi')"
                    color="primary"
                    value="1"
                    hide-details
                    class="tw-flex-grow"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, nextTick } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';

const i18n = useI18n();

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
};

const props = defineProps({
    field: {
        type: Object,
        default: {}
    },
    type: {
        type: Object,
        default: {}
    }
});

const addChoice = () =>
{
    internalValue.value.choices.push({value: value.value, title: label.value});
    value.value = '';
    label.value = '';
}

const handleChange = (e) =>
{
    let choices = [];
    let children = Array.from(document.querySelector('#sortable-choices').children);

    for (let child of children) {
        const item = internalValue.value.choices.find(i => i.value === child.id);

        if (item) {
            choices.push(item);
        }
    }

    choiceList = choices;
    const config = cloneDeep(props.field.config);
    config.choices = choices;
    config.multi = internalValue.value.multi;
    emitter('change', config);
}

const emitter = defineEmits(['change']);
const internalValue = ref({choices: props.field.config.choices || [], multi: props.field.config.multi || false});
let choiceList = [];

let sortable = null;
const label = ref('');
const value = ref('');
const sortableCreated = ref(false);

const opts = {
    tag: 'div',
    direction: 'vertical',
    handle: '.list-dnd-handle',
    ghostClass: 'ghost',
    animation: 0,
    swapTreshold: 0.05,
    dragoverBubble: false,
    onEnd: handleChange
};

watch(internalValue.value, (v) =>
{
    const config = cloneDeep(props.field.config);
    config.choices = choiceList;
    config.multi = v.multi;
    emitter('change', config);

    nextTick(() =>
    {
        if (config.choices.length > 0 && !sortableCreated.value) {
            sortableCreated.value = true;
            let el = document.querySelector('#sortable-choices');
            sortable = new Sortable(el, opts);
        }
    });
});

onMounted(() =>
{
    if (internalValue.value.choices.length > 0) {
        sortableCreated.value = true;
        let el = document.querySelector('#sortable-choices');
        sortable = new Sortable(el, opts);
    }
});
</script>

<style>
.ghost {
    opacity: 0.5;
}
</style>
