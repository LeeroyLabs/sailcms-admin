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
                            class="tw-p-6 tw-rounded-b-md tw-flex tw-flex-col tw-gap-y-4"
                            :class="{
                                'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                                'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                            }"
                        >
                            <template v-if="idx === 0">
                                <Title v-model="entry.title" />
                            </template>

                            <template v-for="(field, _idx) in entryLayout.schema[idx].fields" :key="'field_' + idx + '_' + _idx">
                                <component :is="AvailableFields[field.type].component" :type="AvailableFields[field.type].type" v-model="entry.content[field.key]" :config="field" :index="_idx"/>
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
                    <Meta :entry="entry" />
                    <PubRev/>
                    <Translations/>
                    <Categories/>
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
import { SailCMS } from '@/libs/graphql';
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

// Entry Status
const isDirty = ref(false);

// Saveable version of the entry
let saveableEntryState = {};

// Loaders
const loadBase = async () =>
{
    entry.value.entry_type = route.params.name;
    entryType.value = await Entries.entryType(route.params.name);

    if (entryType.value.entry_layout_id) {
        entryLayout.value = await Entries.entryLayout(entryType.value.entry_layout_id);

        if (entryLayout.value) {
            tabNames.value = entryLayout.value.schema.map(t => t.label);
            tabNames.value.push('SEO');
        }
    }

    if (route.params.id === 'add') {
        page.setPageTitle('entry.new_entry', entryType.value.title);

        // Prepare all fields for use in entry
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
    } else {
        // Load all fields and make them reactive (create missing fields)
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

    isReady.value = true;
}

// Utilities
watch(entry.value, (v) =>
{
    isDirty.value = true;

    if (v.title.trim() !== '') {
        // Create slug
        entry.value.slug = kebabCase(deburr(v.title.trim()));
    }

    saveableEntryState = JSON.parse(JSON.stringify(entry.value));
    console.log(saveableEntryState);
});

// Setup back button url (remove the base url from it, remove the current id, bingo!)
let parts = window.location.pathname.replace(SailCMS.getBaseURL(), '').split('/');
parts.splice(parts.length - 1, 1);
backURL.value = parts.join('/');

// TODO: ON SAVE, JSON PARSE + STRINGIFY THE VUE MESS TO BASIC JS

// Load Base
loadBase();
</script>
