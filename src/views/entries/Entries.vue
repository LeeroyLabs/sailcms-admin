<template>
    <template v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>
        <Teleport to="#actions">
            <div class="tw-flex tw-flex-row tw-items-center tw-gap-x-4 tw-mt-1">
                <v-select
                    :hide-details="true"
                    v-model="selectedLocale"
                    :label="$t('entries.view_in')"
                    color="primary"
                    :items="availableLocales"
                    variant="outlined"
                    density="comfortable"
                    :persistent-hint="false"
                    class="tw-w-[200px]"
                />
                <v-btn @click.prevent="$router.push({name: 'EntrySingle', params: {name: $route.params.name, id: 'add-' + selectedLocale}})" color="primary" v-if="hasPermission('readwrite_entry_layout')">
                    {{ $t('entries.add') }}
                </v-btn>
            </div>
        </Teleport>

        <TabBar :tabs="[$t('entries.entries'), $t('system.trash')]" :active="tab" @change="(e) => tab=e"/>

        <template v-for="idx in [0, 1]">
            <div
                class="tw-p-6 tw-rounded-b-md"
                :class="{
                    'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                    'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'
                }"
            >
                <Manager
                    :active="idx === 0"
                    :list="entriesForTab(idx)"
                    :deleteCallback="deleteEntries"
                    :no_items="$t('entries.message.no_items', {entry: entry.title.toLowerCase()})"
                    :columns="columns"
                    :index="idx"
                >
                    <template v-slot:extra>
                        <!-- SEARCH -->
                        SEARCH
                    </template>
                    <template v-slot="{ row }">
                        <td>
                            <router-link
                                class="hover:tw-text-primary hover:tw-underline"
                                :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                                :to="{name: 'EntrySingle', params: {name: $route.params.name, id: row._id}}"
                            >
                                {{ row.title }}
                            </router-link>
                        </td>
                        <td>{{ row.authors }}</td>
                        <td></td>
                        <td class="tw-text-center"></td>
                        <td class="tw-text-center"></td>
                    </template>
                    <template #footer="{ index }">
                        <v-pagination
                            v-model="currentPage[index - 1]"
                            class="tw-mt-6"
                            density="comfortable"
                            :rounded="true"
                            :length="pageCountForTab(index) === 0 ? 1 : pageCountForTab(index)"
                        ></v-pagination>
                    </template>
                </Manager>
            </div>
        </template>
    </template>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useAppStore } from '@/store/app';
import { Entries } from '@/libs/graphql/lib/entries';
import { useRoute } from 'vue-router';
import { SailCMS } from '@/libs/graphql';
import inflector from "inflector-js";
import plural from "pluralize-fr";
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { hasPermission } from '@/libs/tools';
import { format } from 'date-fns';
import BackButton from '@/components/globals/BackButton.vue';
import Manager from '@/components/globals/Manager.vue';
import Loader from '@/components/globals/Loader.vue';
import TabBar from '@/components/globals/Tab.vue';

const store = useAppStore();
const page = usePage();
const route = useRoute();
const i18n = useI18n();

const isReady = ref(false);
const entry = ref(null);
const typeName = ref('');
const tab = ref(0);
const currentPage = ref([1, 1, 1]);
const currentSearch = ref(['', '', '']);
const direction = ref([1, 1, 1]);

const selectedLocale = ref(SailCMS.getLocales()[0]);

const entries = ref([
    {pagination: {}, list: []},
    {pagination: {}, list: []},
    {pagination: {}, list: []}
]);

const availableLocales = computed(() =>
{
    let out = [];

    for (let locale of SailCMS.getLocales()) {
        out.push({value: locale, title: store.configuration.customLocales[i18n.locale.value][locale] ?? locale });
    }

    return out;
});

const columns = ref([
    {label: i18n.t('layouts.columns.title'), centered: false},
    {label: i18n.t('layouts.columns.created_by'), centered: false},
    {label: i18n.t('layouts.columns.last_update'), centered: false}
]);

const runSetup = async () =>
{
    // Entry type data
    entry.value = await Entries.entryType(route.params.name, SailCMS.getLocales());

    if (i18n.locale.value === 'fr') {
        typeName.value = plural(entry.value.title);
    } else {
        typeName.value = inflector.pluralize(entry.value.title);
    }

    page.setPageTitle(typeName.value);

    // Load entries
    entries.value[0] = await Entries.entries(
        route.params.name,
        currentPage.value[0],
        currentSearch.value[0],
        (direction.value[0] === 1) ? 'ASC' : 'DESC',
        SailCMS.getLocales(),
        true,
        selectedLocale.value
    );

    entries.value[1] = await Entries.entries(
        route.params.name,
        currentPage.value[1],
        currentSearch.value[1],
        (direction.value[1] === 1) ? 'ASC' : 'DESC',
        SailCMS.getLocales(),
        false,
        selectedLocale.value
    );

    isReady.value = true;
}

const entriesForTab = (tab) => entries.value[tab].list;
const pageCountForTab = (tab) => entries.value[tab].pagination.totalPages;

runSetup();

</script>

<style lang="postcss">
.v-tab--selected {
    @apply !tw-text-primary;
}
</style>
