<template>
    <template v-if="isReady">
        <template v-if="!$vuetify.display.xs">
            <div class="tw-mb-6">
                TITLE FIELD HERE
            </div>
            <div class="tw-flex tw-flex-row tw-w-full tw-gap-4">
                <div class="tw-w-4/12 lg:tw-w-3/12">
                    <v-card class="tw-p-4 tw-flex tw-flex-col tw-gap-y-4">
                        <v-expansion-panels v-model="panel" :multiple="true">
                            <template v-for="items in [{label: 'layout.inputs.text', data: inputFields}, {label: 'layout.inputs.datetime', data: dtFields}, {label: 'layout.inputs.select', data: selectFields}, {label: 'layout.inputs.special', data: specialFields}]">
                                <v-expansion-panel>
                                    <v-expansion-panel-title>{{ $t(items.label) }}</v-expansion-panel-title>
                                    <v-expansion-panel-text>
                                        <div @click="addField(field)" class="fieldbox" v-for="field in items.data">
                                            <h2 class="tw-font-medium">{{ $t('layout.names.' + cleanName(field.name)) }}</h2>
                                            <div class="tw-text-xs">{{ field.description[$i18n.locale]}}</div>
                                        </div>
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </template>
                        </v-expansion-panels>
                    </v-card>
                </div>
                <div class="tw-w-8/12 lg:tw-w-9/12 tw-flex-grow">
                    <v-card class="tw-p-6">
                        <div v-if="layoutFields.length === 0" class="tw-border tw-border-gray-400 tw-border-dashed tw-w-full tw-py-6 tw-text-center">
                            {{ $t('layout.no_fields') }}
                        </div>

                        <ul id="nested-sort-wrap" class="tw-flex tw-flex-col tw-gap-y-4">
                            <template v-for="field in layoutFields">
                                <FieldItem :ref="'field_' + field.id" :id="field.id" :config="field.conf" @remove="removeField" />
                            </template>
                        </ul>
                    </v-card>
                </div>
            </div>
        </template>
        <template v-else>
            <h1 class="tw-text-4xl tw-font-medium tw-text-center tw-mb-6">{{ $t('layout.mobile.wait') }}</h1>
            <p>{{ $t('layout.mobile.explain') }}</p>
        </template>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { computed, nextTick, ref } from 'vue';
import { v4 } from 'uuid';
import Loader from '@/components/globals/Loader.vue';
import { Entries } from '@/libs/graphql/lib/entries';
import Sortable from 'sortablejs';
import FieldItem from '@/components/entries/fields/FieldItem.vue';

const page = usePage();
page.setPageTitle('layout.add');

const isReady = ref(false);
const fields = ref([]);
const panel = ref([0]);

const layoutFields = ref([]);

const loadFields = async () =>
{
    fields.value = await Entries.fields();
    isReady.value = true;

    await nextTick(() =>
    {
        let sortable = Sortable.create(document.querySelector('#nested-sort-wrap'), {
            handle: '.dnd-handle',
            animation: 150
        });
    });
}

// TODO: GET TREE (run getInfo on all)

const removeField = (id) => layoutFields.value = layoutFields.value.filter(f => f.id !== id);
const addField = (field) => layoutFields.value.push({id: v4(), conf: field});
const inputFields = computed(() => fields.value.filter(f => f.category === 'text'));
const selectFields = computed(() => fields.value.filter(f => f.category === 'select'));
const specialFields = computed(() => fields.value.filter(f => f.category === 'special'));
const dtFields = computed(() => fields.value.filter(f => f.category === 'datetime'));
const cleanName = (name) => name.replace('Field', '');

loadFields();
</script>

<style lang="postcss">
.fieldbox {
    @apply tw-p-2 hover:tw-bg-primary hover:tw-text-white tw-transition-all tw-duration-300;
    @apply tw-rounded-md tw-flex tw-flex-col tw-cursor-pointer;
}

.v-expansion-panel-text__wrapper {
    @apply !tw-px-4;
}
</style>
