<template>
    <div class="tw-w-full tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-y-4 tw-gap-x-6 tw-mt-4">
        <div class="tw-w-full tw-col-span-2">
            <div class="tw-flex tw-flex-col md:tw-flex-row tw-items-start tw-w-full md:tw-w-8/12 lg:tw-w-7/12 xl:tw-w-6/12 tw-gap-x-6">
                <v-select
                    v-model="selectedField"
                    :items="fieldList"
                    id="type-selector"
                    :label="$t('fields.options.field')"
                    color="primary"
                    variant="outlined"
                    density="comfortable"
                    placeholder="Type"
                    :hide-details="true"
                    :persistent-hint="false"
                    class="tw-col-span-2"
                ></v-select>
                <div class="tw-flex-grow tw-w-4/12">
                    <v-btn @click.prevent="addChoice" variant="flat" color="primary" class="tw-mt-1.5">{{ $t('fields.options.add_field') }}</v-btn>
                </div>
            </div>

            <div v-if="showAlreadySelected" class="tw-mt-6 tw-p-3 tw-border tw-border-red-500 tw-w-6/12 tw-rounded-lg tw-text-red-500 tw-flex tw-items-center tw-gap-x-2">
                <v-icon icon="mdi-alert-outline"/>
                {{ $t('fields.matrix_error') }}
            </div>

            <div
                class="tw-border tw-p-4 tw-mt-6 tw-mb-2 tw-w-full md:tw-w-8/12 lg:tw-w-7/12 xl:tw-w-6/12 tw-rounded-md"
                :class="{'tw-border-black/30': $vuetify.theme.name === 'light', 'tw-border-white/30': $vuetify.theme.name === 'dark'}"
            >
                <h3 v-if="internalValue.fields.length === 0" class="tw-text-center tw-font-medium">{{ $t('fields.options.no_fields') }}</h3>

                <div v-else id="sortable-choices" class="tw-flex tw-flex-col tw-gap-y-2">
                    <template v-if="isReady">
                        <div
                            v-for="choice in internalValue.fields"
                            :id="'mtx-' + choice"
                            class="tw-px-4 tw-py-2 tw-group tw-rounded-md tw-flex tw-flex-row tw-items-center tw-justify-between"
                            :class="{'hover:tw-bg-neutral-800 tw-border tw-border-white/30': $vuetify.theme.name === 'dark', 'hover:tw-bg-gray-300 tw-border tw-border-black/30': $vuetify.theme.name === 'light'}"
                        >
                            <div>
                                <v-icon icon="mdi-menu" class="list-dnd-handle tw-mr-1 tw-cursor-grab"/>
                                {{ getTitle(choice) }}
                            </div>
                            <a href="" @click.prevent="removeSelection(choice)" class="hover:tw-text-red-500 tw-invisible group-hover:tw-visible">
                                <v-icon icon="mdi-trash-can-outline" size="small"/>
                            </a>
                        </div>
                    </template>
                    <template v-else>
                        <div class="tw-h-[140px] tw-w-6/12 tw-mx-auto tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <v-progress-linear :indeterminate="true" color="primary" :height="7" class="tw-rounded-md"/>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, nextTick, onBeforeMount } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';
import { Entries } from '@/libs/graphql/lib/entries';
import { availableTypes } from '@/libs/fieldTypes';
import { SailCMS } from '@/libs/graphql';
import Loader from '@/components/globals/Loader.vue';

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

const showAlreadySelected = ref(false);
const fieldList = ref([]);
const selectedField = ref(null);
const isReady = ref(false);

const addChoice = () =>
{
    let item = fieldList.value.find(f => f.value === selectedField.value);

    if (internalValue.value.fields.includes(item.value)) {
        showAlreadySelected.value = true;
        return;
    } else {
        showAlreadySelected.value = false;
    }

    internalValue.value.fields.push(item.value);
    selectedField.value = null;

    nextTick(() =>
    {
        handleChange(null);
        if (internalValue.value.fields.length > 0 && !sortableCreated.value) {
            sortableCreated.value = true;
            let el = document.querySelector('#sortable-choices');
            sortable = new Sortable(el, opts);
        }
    });
}

const removeSelection = (item) =>
{
    document.getElementById('mtx-' + item).remove();
    handleChange(null);

    // Update listing to allow that field again
    for (let field of fieldList.value) {
        if (field.value === item) {
            field.disabled = false;
        }
    }
}

const getTitle = (field) =>
{
    const _field = fieldList.value.find(f => f.value === field);

    if (!_field) return '';

    return _field.title;
}

const handleChange = (e) =>
{
    let choices = [];
    let children = Array.from(document.querySelector('#sortable-choices').children);

    for (let child of children) {
        const item = internalValue.value.fields.find(i => 'mtx-' + i === child.id);

        if (item) {
            choices.push(item);
        }
    }

    choiceList = choices;
    const config = cloneDeep(props.field.config);
    config.fields = choices.map(c =>
    {
        return c;
    });

    emitter('change', config);
}

const emitter = defineEmits(['change']);
const internalValue = ref({fields: props.field.config.fields || []});
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

onMounted(() =>
{
    if (internalValue.value.fields.length > 0) {
        sortableCreated.value = true;
        let el = document.querySelector('#sortable-choices');
        sortable = new Sortable(el, opts);
    }
});

onBeforeMount(async () =>
{
    let fields = await Entries.fields(SailCMS.getLocales());

    fieldList.value = fields.map(field => {
        return {value: field.key, title: field.name, disabled: false}
    });

    nextTick(() =>
    {
        isReady.value = true;
    });
});
</script>

<style>
.ghost {
    opacity: 0.5;
}
</style>
