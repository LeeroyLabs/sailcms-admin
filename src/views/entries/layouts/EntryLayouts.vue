<template>
    <template v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click.prevent="$router.push({name: 'SingleLayout', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_entry_layout')">
                {{ $t('layouts.add') }}
            </v-btn>
        </Teleport>

        <div class="tw-flex tw-flex-row tw-w-full lg:tw-w-3/12 tw-items-center tw-mb-4" v-if="hasPermission('readwrite_entry_layout')">
            <v-select
                v-model="selectedAction"
                label="Actions"
                color="primary"
                :items="availableActions"
                variant="outlined"
                density="comfortable"
                single-line
                placeholder="Actions"
                :persistent-hint="false"
                :hide-details="true"
            ></v-select>

            <v-btn
                :class="{
                    'tw-invisible tw-opacity-0': selectedAction === null,
                    'tw-opacity-100': selectedAction !== null
                }"
                class="!tw-hidden md:!tw-block tw-ml-2 tw-transition-opacity tw-duration-300"
                color="primary"
                size="small"
                icon
                @click.prevent="performAction"
            >
                <v-icon icon="mdi-chevron-right"/>
            </v-btn>

            <v-progress-circular indeterminate size="x-small" width="2" class="tw-ml-2" :class="{'tw-invisible': !applyingAction}"/>
        </div>
        <div v-else></div>

        <v-table class="utable">
            <thead>
            <tr>
                <th class="!tw-min-w-[4px] !tw-max-w-[4px]">
                    <v-checkbox @change="handleCheckAll" color="primary" value="checkall" hide-details></v-checkbox>
                </th>
                <th class="lg:tw-w-[35%]">
                    {{ $t('layouts.columns.title') }}
                </th>
                <th>
                    {{ $t('layouts.columns.created_by') }}
                </th>
                <th>
                    {{ $t('layouts.columns.last_update') }}
                </th>
                <th class="!tw-text-center">
                    {{ $t('layouts.columns.used_by') }}
                </th>
                <th class="!tw-text-center">
                    {{ $t('layouts.columns.num_records') }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="layout in layoutListing" :key="layout._id">
                <td class="!tw-min-w-[4px] !tw-max-w-[4px]">
                    <v-checkbox v-model="selectedLayouts" color="primary" :value="layout" hide-details></v-checkbox>
                </td>
                <td>
                    <router-link
                        class="hover:tw-text-primary hover:tw-underline"
                        :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                        :to="{name: 'SingleLayout', params: {id: layout._id}}"
                    >
                        {{ layout.titles[$i18n.locale] }}
                    </router-link>
                </td>
                <td>{{ layout.authors.created_by.name.full }}</td>
                <td v-html="format(layout.dates.updated * 1000, 'dd-MM-yyyy H:mm:ss')"></td>
                <td class="tw-text-center">{{ layout.used_by }}</td>
                <td class="tw-text-center">{{ layout.record_count }}</td>
            </tr>
            <tr v-if="layoutListing.length === 0">
                <td colspan="6" class="tw-text-center tw-font-medium">{{ $t('layouts.no_layout') }}</td>
            </tr>
            </tbody>
        </v-table>
    </template>
    <Loader v-else/>
</template>

<script setup>

import { usePage } from '@/libs/page';
import { format } from 'date-fns';
import { ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';
import { hasPermission } from '@/libs/tools';

const page = usePage();
page.setPageTitle('layouts.title');

const isReady = ref(false);
const layoutListing = ref([]);
const selectedLayouts = ref([]);
const selectedAction = ref(null);
const applyingAction = ref(false);

const availableActions = ref([
    {value: 'delete', title: 'Delete'}
]);

const loadLayouts = async () =>
{
    layoutListing.value = await Entries.entryLayouts(SailCMS.getLocales());
    isReady.value = true;
}

loadLayouts();
</script>

<style lang="postcss">
.utable tr:hover td {
    background-color: rgba(229, 231, 235, 0.20);
}
</style>
