<template>
    <v-card class="tw-p-6">
        <div class="tw-flex tw-flex-row tw-items-center tw-mb-4">
            <h1 class="tw-mr-4 tw-text-xl">{{ $t('entries.title') }}</h1>
            <v-divider class="border-opacity-75"></v-divider>
        </div>
        <div class="tw-flex tw-flex-row tw-flex-wrap tw-gap-6">
            <div class="tw-flex tw-flex-col">
                <v-btn @click.prevent="$router.push({name: 'EntryTypes'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-shape-plus-outline" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_types') }}</div>
            </div>
            <div class="tw-flex tw-flex-col">
                <v-btn @click.prevent="$router.push({name: 'EntryLayouts'})" icon size="x-large" variant="flat">
                    <v-icon icon="mdi-order-alphabetical-ascending" size="42"/>
                </v-btn>
                <div class="tw-text-center tw-mt-2">{{ $t('system.entry_layouts') }}</div>
            </div>
        </div>
    </v-card>
</template>

<script setup>

import { usePage } from '@/libs/page';

const page = usePage();
page.setPageTitle('system.settings');

</script>
