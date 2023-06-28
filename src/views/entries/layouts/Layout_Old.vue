<template>
    <template v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click.prevent="saveLayout" :loading="isSaving" color="primary">
                {{ $t('system.save') }}
            </v-btn>
        </Teleport>
        <template v-if="!$vuetify.display.xs">
            <v-form ref="form">
                <div class="tw-mb-6 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    <template v-for="locale in SailCMS.getLocales()">
                        <v-text-field
                            hide-details
                            variant="outlined"
                            color="primary"
                            :rules="[rules.required]"
                            density="comfortable"
                            :label="$t('layout.name') + ' (' + locale + ')'"
                            v-model="currentLayout.titles[locale]"
                        />
                    </template>
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
                                    <FieldItem :ref="el => { fieldRefs.push(el) }" :id="field.id" :config="field.conf" @remove="removeField" />
                                </template>
                            </ul>
                        </v-card>
                        <v-btn @click.prevent="saveLayout" :loading="isSaving" color="primary" class="tw-my-6" v-if="layoutFields.length >= 3">
                            {{ $t('system.save') }}
                        </v-btn>
                    </div>
                </div>
            </v-form>
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
import { useRoute, useRouter } from 'vue-router';
import { SailCMS } from '@/libs/graphql';
import { useI18n } from 'vue-i18n';
import { deburr } from 'lodash';
import { useAppStore } from '@/store/app';

const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const store = useAppStore();
const page = usePage();

page.setPageTitle('layout.add');

const isReady = ref(false);
const fields = ref([]);
const panel = ref([0]);
const isSaving = ref(false);
const form = ref(null);

const layoutFields = ref([]);
const fieldRefs = ref([]);

const rules = {
    required: value => !!value || i18n.t('user.errors.required'),
}

const currentLayout = ref({
    _id: '',
    slug: '',
    titles: {fr: '', en: ''},
    schema: [],
    authors: {
        created_by: '',
        updated_by: '',
        deleted_by: ''
    },
    dates: {
        created: parseInt(Date.now() / 1000),
        updated: parseInt(Date.now() / 1000),
        deleted: 0
    },
    is_trashed: false
});

const loadFields = async () =>
{
    fields.value = await Entries.fields(SailCMS.getLocales());
    isReady.value = true;

    await nextTick(() =>
    {
        let sortable = Sortable.create(document.querySelector('#nested-sort-wrap'), {
            handle: '.dnd-handle',
            animation: 150
        });
    });
}

const loadLayout = async () =>
{
    const id = route.params.id;
    currentLayout.value = await Entries.entryLayout(id, SailCMS.getLocales());

    console.log('DB > ', currentLayout.value);

    currentLayout.value.schema.forEach(item =>
    {
        const configs = (item.fieldConfigs);

        console.log('Conf > ' , configs);

        // layoutFields.value.push({
        //     category: 'text',
        //     description: {fr: '', en: ''},
        //     fullname: item.fieldConfigs[0].handle.replace(/-/g, '\\\\'),
        //     handle: item.fieldConfigs[0].handle,
        //     inputs: [],
        //     name: '',
        //     repeatable: true,
        //     searchable: true,
        //     storingType: ''
        // });

        let name = configs[0].handle.split('-');
        name = name[name.length - 1];

        const repeater = item.repeater;

        console.log({
            category: 'text',
            description: {fr: '', en: ''},
            fullname: configs[0].handle.replace(/-/g, '\\'),
            handle: configs[0].handle,
            inputs: [],
            name: name,
            repeatable: repeater,
            searchable: true,
            storingType: ''
        });
    });

    isReady.value = true;
}

const saveLayout = async () =>
{
    if (isSaving.value) return;

    const status = await form.value.validate();
    if (!status.valid) return;

    isSaving.value = true;

    let fields = [];

    for (let field in fieldRefs.value) {
        let info = fieldRefs.value[field].getInfo();
        let conf = info.config;

        let inputSettings = [];
        let settings = [];
        let keys = Object.keys(info.data);
        let inputKey = '';

        for (let key of keys) {
            if (key === 'key') {
                inputKey = info.data[key];
                continue;
            }

            switch (key)
            {
                case 'title':
                    break;

                default:
                    let settings = [];

                    for (let input of conf.inputs) {
                        let foundInput = input.availableSettings.find(i => i.name === key);
                        let type = foundInput.type;

                        if (!Number.isNaN(info.data[key])) {
                            if (Number.isInteger(info.data[key])) {
                                type = 'integer';
                            } else {
                                type = 'float';
                            }
                        }

                        let setting = {
                            name: key,
                            value: info.data[key],
                            type: type
                        }

                        settings.push(setting);
                    }
                    break;
            }
        }

        inputSettings.push({
            settings: settings
        });

        if (layoutFields.value[field]) {
            fields.push({
                labels: info.data.title,
                key: info.data.key,
                handle: layoutFields.value[field].conf.handle,
                repeater: false,
                inputSettings: inputSettings
            });
        }
    }

    if (route.params.id === 'add') {
        const slug = deburr(currentLayout.value.titles.en);
        let result = await Entries.createEntryLayout(currentLayout.value.titles, fields, slug);

        if (result) {
            store.displayToast('success', i18n.t('layout.save_success'));
            await router.push({name: 'EntryLayouts'});
        } else {
            store.displayToast('error', i18n.t('layout.save_error'));
            isSaving.value = false;
        }
    }
}

const removeField = (id) => {
    fieldRefs.value = [];
    layoutFields.value = layoutFields.value.filter(f => f.id !== id);
}
const addField = (field) =>
{
    fieldRefs.value = [];
    layoutFields.value.push({id: v4(), conf: field});

    console.log('Field > ', field);
}

if (route.params !== 'add') {
    loadLayout();
}

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
