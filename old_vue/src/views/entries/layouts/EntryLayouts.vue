<template>
    <template v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>
        <Teleport to="#actions">
            <v-btn @click.prevent="$router.push({name: 'SingleLayout', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_entry_layout')">
                {{ $t('layouts.add') }}
            </v-btn>
        </Teleport>

        <TabBar :tabs="[$t('system.active'), $t('system.trash')]" :active="tab" @change="(e) => tab=e"/>

        <template v-for="idx in [0, 1]">
            <div
                class="tw-p-6 tw-rounded-b-md"
                :class="{
                    'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                    'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                }"
            >
                <Manager
                    :active="(idx === 0)"
                    :key="'tab_' + idx"
                    :list="(idx === 0) ? layoutListing.filter(l => !l.is_trashed) : layoutListing.filter(l => l.is_trashed)"
                    :deleteCallback="deleteLayouts"
                    :restoreCallback="restoreLayouts"
                    :no_items="$t('layouts.no_layout')"
                    :columns="columns"
                    :delete-message="noItemsAvailable((idx === 0))"
                >
                    <template v-slot="{ row }">
                        <td>
                            <router-link
                                class="hover:tw-text-primary hover:tw-underline"
                                :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                                :to="{name: 'SingleLayout', params: {id: row._id}}"
                            >
                                {{ row.title }}
                            </router-link>
                        </td>
                        <td>{{ row.authors.created_by.name.full }}</td>
                        <td v-html="format(row.dates.updated * 1000, 'dd-MM-yyyy H:mm:ss')"></td>
                        <td class="tw-text-center">{{ row.used_by }}</td>
                        <td class="tw-text-center">{{ row.record_count }}</td>
                    </template>
                </Manager>
            </div>
        </template>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { ref } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { Entries } from '@/libs/graphql/lib/entries';
import { SailCMS } from '@/libs/graphql';
import { hasPermission } from '@/libs/tools';
import BackButton from '@/components/globals/BackButton.vue';
import Manager from '@/components/globals/Manager.vue';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { useAppStore } from '@/store/app';
import TabBar from '@/components/globals/Tab.vue';

const page = usePage();
page.setPageTitle('layouts.title');

const i18n = useI18n();
const store = useAppStore();

const isReady = ref(false);
const layoutListing = ref([]);

const tab = ref(0);

const columns = ref([
    {label: i18n.t('layouts.columns.title'), centered: false},
    {label: i18n.t('layouts.columns.created_by'), centered: false},
    {label: i18n.t('layouts.columns.last_update'), centered: false},
    {label: i18n.t('layouts.columns.used_by'), centered: false},
    {label: i18n.t('layouts.columns.num_records'), centered: false}
]);

const loadLayouts = async () =>
{
    layoutListing.value = await Entries.entryLayouts(SailCMS.getLocales(), false);
    isReady.value = true;
}

const noItemsAvailable = (active) =>
{
    let count = (active) ? layoutListing.value.filter(l => !l.is_trashed) : layoutListing.value.filter(l => l.is_trashed);

    if (active && count.length > 1) {
        return i18n.t('layouts.confirm_softdelete');
    } else if (active && count.length === 1) {
        return i18n.t('layouts.confirm_softdelete_many');
    }

    if (!active && count.length > 1) {
        return i18n.t('layouts.confirm_delete_many');
    }

    return i18n.t('layouts.confirm_delete');
};

const deleteLayouts = async (e) =>
{
    let result = await Entries.deleteEntryLayouts(e.list, e.active);

    if (result) {
        store.displayToast(
            'success',
            (e.list > 1) ? i18n.t('layouts.delete_success_many') : i18n.t('layouts.delete_success')
        );

        await loadLayouts();
        showDeleteConfirm.value = false;
    } else {
        store.displayToast(
            'error',
            (e.list.length > 1) ? i18n.t('layouts.delete_error_many') : i18n.t('layouts.delete_error')
        );
    }
}

const restoreLayouts = async (e) =>
{
    await Entries.restoreEntryLayouts(e.list);
    await loadLayouts();
}

loadLayouts();
</script>
