<template>
    <template v-if="isReady">
        <BackButton :url="backURL"/>
        <v-form ref="form" autocomplete="off">
            <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-w-full">
                <div class="tw-flex-grow">
                    <TabBar :tabs="tabNames" :active="tab" :stretch="false" @change="(e) => tab=e"/>
                    <template v-for="(name, idx) in tabNames">
                        <div
                            v-if="name !== 'SEO'"
                            class="tw-p-6 tw-rounded-b-md tw-flex tw-flex-col tw-w-full tw-gap-4"
                            :class="{
                                'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                                'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                            }"
                        >
                            <template v-if="idx === 0">
                                <div class="grid grid-cols-1 tw-w-full">
                                    <Title v-model="entry.title" />
                                </div>
                            </template>

                            <template v-for="(gridRow, _idx) in gridFit(entryLayout.schema[idx].fields)" :key="'field_' + idx + '_' + _idx">
                                <div class="tw-grid tw-gap-x-4" :class="{
                                        'tw-grid-cols-1': gridRow.length === 1,
                                        'tw-grid-cols-2': gridRow.length === 2,
                                        'tw-grid-cols-3': gridRow.length === 3
                                }">
                                    <template v-for="(field, _idxx) in gridRow" :key="'field_' + idx + '_' + _idx + '_' + _idxx">
                                        <component
                                            :is="AvailableFields[field.type].component"
                                            :type="AvailableFields[field.type].type"
                                            v-model="entry.content[field.key]"
                                            :config="field"
                                            :index="_idxx"
                                            :locale="entry.locale"
                                        />
                                    </template>
                                </div>
                            </template>
                        </div>
                        <div
                            v-else
                            class="tw-p-6 tw-rounded-md"
                            :class="{
                                'tw-hidden': tab !== idx,
                                'tw-bg-white': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                            }"
                        >
                            SEO!
                        </div>
                    </template>
                </div>
                <div class="md:tw-pt-12 tw-flex tw-flex-col tw-gap-y-8 md:tw-w-4/12 xl:tw-w-3/12">
                    <Meta
                        :loading="isSaving"
                        :entry="entry"
                        :templates="availableTemplates"
                        @template-change="(e) => entry.template = e"
                        @parent-change="(e) => entry.value.parent = e"
                        @save="saveEntry"
                    />
                    <PubRev :entry="entry"/>
                    <Translations :entry="entry"/>

                    <Categories v-if="entryType.use_categories"/>
                </div>
            </div>
        </v-form>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { useRoute } from 'vue-router';
import { Entries } from '@/libs/graphql/lib/entries';
import { Misc, SailCMS } from '@/libs/graphql';
import { entry } from '@/components/entries/entry/entry';
import TabBar from '@/components/globals/Tab.vue';
import Meta from '@/components/entries/entry/Meta.vue';
import Categories from "@/components/entries/entry/Categories.vue";
import Loader from '@/components/globals/Loader.vue';
import BackButton from '@/components/globals/BackButton.vue';
import Translations from '@/components/entries/entry/Translations.vue';
import PubRev from '@/components/entries/entry/PubRev.vue';
import Title from '@/components/entries/entry/fields/Title.vue';
import { deburr, kebabCase } from 'lodash';
import { AvailableFields } from '@/components/entries/entry/fields/Fields';
import { usePage } from '@/libs/page';
import { GridMaker } from '@/libs/gridmaker';

// Use
const i18n = useI18n();
const store = useAppStore();
const route = useRoute();
const page = usePage();

// Variables
const isReady = ref(false);
const entryType = ref(null);
const entryLayout = ref(null);
const tabNames = ref([]);
const tab = ref(0);
const backURL = ref('');
const form = ref(null);
const isSaving = ref(false);
const availableTemplates = ref([]);

// Entry Status
const isDirty = ref(false);

// Saveable version of the entry
let saveableEntryState = {};

// Loaders
const loadBase = async () =>
{
    // Load entry type data
    entry.value.entry_type = route.params.name;
    entryType.value = await Entries.entryType(route.params.name);

    if (entryType.value.entry_layout_id) {
        entryLayout.value = await Entries.entryLayout(entryType.value.entry_layout_id);

        if (entryLayout.value) {
            tabNames.value = entryLayout.value.schema.map(t => t.label);
            tabNames.value.push('SEO');
        }
    }

    // Load available templates
    availableTemplates.value = await Misc.availableTemplates(true);

    if (route.params.id.includes('add-')) {
        page.setPageTitle('entry.new_entry', entryType.value.title);
        const [staticpart, currentLocale] = route.params.id.split('-');
        entry.value.locale = currentLocale;

        // Prepare all fields for use in entry
        initEntryFields();
    } else {
        entry.value = await Entries.entry(route.params.id, route.params.name, SailCMS.getLocales());

        // Load all fields and make them reactive (create missing fields)
        initEntryFields();
    }

    isReady.value = true;
}

const initEntryFields = () =>
{
    for (let tab of entryLayout.value.schema) {
        for (let field of tab.fields) {
            if (entry.value.content[field.key] === undefined) {
                if (field.repeatable) {
                    entry.value.content[field.key] = ref([]);
                } else {
                    entry.value.content[field.key] = ref('');
                }
            } else {
                entry.value.content[field.key] = ref(entry.value.content[field.key]);
            }
        }
    }
}

// Build an array of rows to build a solid grid with
const gridFit = (list) =>
{
    const gridMaker = new GridMaker(list);
    return gridMaker.make();
}

// Utilities
watch(entry.value, (v) =>
{
    isDirty.value = true;

    if (v.title.trim() !== '') {
        // Create slug
        entry.value.slug = kebabCase(deburr(v.title.trim()));
    }
});

// Setup back button url (remove the base url from it, remove the current id, bingo!)
let parts = window.location.pathname.replace(SailCMS.getBaseURL(), '').split('/');
parts.splice(parts.length - 1, 1);
backURL.value = parts.join('/');

// TODO: ON SAVE, JSON PARSE + STRINGIFY THE VUE MESS TO BASIC JS

const saveEntry = async () =>
{
    if (isSaving.value) return;

    isSaving.value = true;

    if (entry.value._id === '') {
        saveableEntryState = JSON.parse(JSON.stringify(entry.value));
        let parent = null;

        if (entry.value.parent !== '') {
            parent = { handle: saveableEntryState.entry_type, parent_id: entry.value.parent };
        }

        const opts = {
            entry_type_handle: saveableEntryState.entry_type,
            locale: saveableEntryState.locale,
            is_homepage: false, // make settable
            title: saveableEntryState.title,
            template: 'default',
            slug: entry.value.slug,
            categories: [],
            content: saveableEntryState.content,
            parent: parent,
            site_id: SailCMS.getSiteId()
        };

        let result = await Entries.createEntry(opts);

        console.log(result);
        isSaving.value = false;
    }
}

// Load Base
loadBase();
</script>
