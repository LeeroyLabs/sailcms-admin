<template>
    <div>
        <div
            class="tw-border tw-rounded-md tw-p-4 t-pt-2 tw-relative"
            :class="{
                'tw-border-neutral-400': $vuetify.theme.name === 'light',
                'tw-border-neutral-500': $vuetify.theme.name === 'dark'
            }"
        >
            <h2 class="tw-text-lg tw-mb-6">{{ config.label[$i18n.locale]}}</h2>

            <template v-if="isReady">
                <template v-if="arrayValue.length === 0">
                    <div class="tw-flex tw-flex-col tw-items-center tw-gap-y-4">
                        <h3
                            class="tw-text-center tw-text-xl"
                            :class="{
                            'tw-text-neutral-400': $vuetify.theme.name === 'light',
                            'tw-text-neutral-500': $vuetify.theme.name === 'dark'
                        }"
                        >
                            {{ $t('system.no_items_now') }}
                        </h3>
                        <v-btn @click.prevent="addElement" variant="text" color="primary">{{ $t('system.add_item') }}</v-btn>
                    </div>
                </template>

                <template v-else>
                    <div :id="id" class="tw-flex tw-flex-col tw-gap-y-4">
                        <template v-for="(group, idx) in arrayValue" :key="'group_' + idx + '_' + index">
                            <div class="tw-rounded-md tw-p-4" :class="{'tw-bg-zinc-800': $vuetify.theme.name === 'dark', 'tw-bg-gray-100': $vuetify.theme.name === 'light'}">
                                <div class="tw-flex tw-flex-row tw-mb-4 tw-justify-between tw-items-center">
                                    <div class="tw-flex tw-flex-row tw-gap-x-2 list-dnd-handle">
                                        <v-icon icon="mdi-menu" class="tw-cursor-grab"/><h3 class="tw-font-medium">{{ $t('system.group') }} #{{ idx+1 }}</h3>
                                    </div>
                                    <div>
                                        <v-btn @click.prevent="(e) => arrayValue.splice(idx, 1)" class="!tw-h-[30px]" variant="tonal" density="compact" color="red"><v-icon icon="mdi-trash-can-outline" /></v-btn>
                                    </div>
                                </div>

                                <div class="tw-flex tw-flex-col tw-gap-y-4">
                                    <template v-for="(_field, idxx) in fieldData" :key="'matrix_field_' + '_' + idx + '_' + index + '_' + idxx">
                                        <component
                                            :is="AvailableFields[_field.type].component"
                                            :type="AvailableFields[_field.type].type"
                                            v-model="arrayValue[idx][_field.key]"
                                            :config="_field"
                                            :index="idx"
                                            :locale="entry.locale"
                                        />
                                    </template>
                                </div>
                            </div>
                        </template>
                    </div>
                    <v-btn @click.prevent="addElement" variant="flat" color="primary" class="tw-absolute tw-top-4 tw-right-4">{{ $t('system.add') }}</v-btn>
                </template>
            </template>
            <template v-else>
                <div class="tw-h-[140px] tw-w-6/12 tw-flex tw-flex-col tw-items-center tw-justify-center tw-mx-auto">
                    <v-progress-linear :indeterminate="true" color="primary" :height="7" class="tw-rounded-md"/>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { nextTick, onMounted, ref, watch } from 'vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';
import { AvailableFields } from '@/components/entries/entry/fields/Fields';
import { entry } from '@/components/entries/entry/entry';
import Sortable from 'sortablejs';
import { v4 } from 'uuid';
import { arrayMoveImmutable } from 'array-move';

const i18n = useI18n();
const id = ref('matrix_' + v4());

const props = defineProps({
    modelValue: {
        default: null
    },
    config: {
        type: Object,
        default: {type: '', label: '', name: '', validation: '', required: false, repeatable: false, config: null, width: 'full'}
    },
    type: {
        type: String,
        default: 'text'
    },
    index: {
        type: Number,
        default: 0
    }
});

const emitter = defineEmits(['update:modelValue']);
const arrayValue = ref(props.modelValue || []);
const isReady = ref(false);
const fieldData = ref([]);
const dndEstablished = ref(false);

// Add element to array
const addElement = () =>
{
    let struct = {};
    for (let field of fieldData.value) {
        struct[field.key] = '';
    }

    arrayValue.value.push(struct);

    nextTick(() =>
    {
        if (!dndEstablished.value) {
            const el = document.querySelector('#' + id.value);

            if (el) {
                new Sortable(
                    el,
                    {
                        tag: 'div',
                        direction: 'vertical',
                        ghostClass: 'ghost',
                        handle: '.list-dnd-handle',
                        animation: 300,
                        swapTreshold: 0.05,
                        dragoverBubble: false,
                        onEnd: sortingChange
                    }
                );

                dndEstablished.value = true;
            }
        }
    });
}

function moveElement(array, fromIndex, toIndex)
{
    const element = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, element);
    return array;
}

const sortingChange = (e) =>
{
    let oldIndex = e.oldIndex;
    let newIndex = e.newIndex;

    if (e.type === 'end') {
        arrayValue.value = arrayMoveImmutable(arrayValue.value, oldIndex, newIndex);
    }
}

// Report back any changes to the array
watch(arrayValue, (v) => emitter('update:modelValue', arrayValue), {deep: true});

const loadInfo = async () =>
{
    fieldData.value = await Entries.fieldsForMatrix(props.config._id, SailCMS.getLocales());
    isReady.value = true;
}

// Fetch Field Info for matrix
loadInfo();
</script>

<style>
.ghost {
    opacity: 0.45;
}
</style>
