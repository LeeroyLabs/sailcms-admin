<template>
    <v-card class="tw-p-6" v-if="isReady">
        <div class="tw-flex tw-flex-row tw-items-center tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('entries.title') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'EntryTypes'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-shape-plus-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_types') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'EntryFields'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-form-textbox" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_fields') }}</div>
            </div>
            <div class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'EntryLayouts'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-order-alphabetical-ascending" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_layouts') }}</div>
            </div>
        </div>
        <div class="tw-flex tw-flex-row tw-items-center tw-mt-8 tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('emails.title') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'EmailTest'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-email-check-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('emails.test') }}</div>
            </div>
        </div>
        <template v-if="extensions.others.length > 0">
        <div class="tw-flex tw-flex-row tw-items-center tw-mt-8 tw-mb-2">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('system.other') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6" v-if="extensions.others.length > 0">
            <div v-for="item in extensions.others" class="tw-flex tw-flex-col tw-items-center">
                <v-btn @click.prevent="$router.push({name: 'SettingsDynamicContent', params: {param: item.url}})" icon size="x-large" variant="flat">
                    <v-icon :icon="item.icon" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ item.label[$i18n.locale] }}</div>
            </div>
        </div>
        </template>
    </v-card>
    <Loader v-else/>
</template>

<script setup>

import { usePage } from '@/libs/page';
import { ref } from 'vue';
import { Misc } from '@/libs/graphql';
import Loader from '@/components/globals/Loader.vue';

const page = usePage();
page.setPageTitle('system.settings');

const extensions = ref({entries: [], emails: [], others: []});
const isReady = ref(false);

const loadExtensions = async () =>
{
    extensions.value = await Misc.settingsElements();
    isReady.value = true;
}

loadExtensions();

</script>
