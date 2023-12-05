<template>
    <div v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>
        <v-card class="tw-p-6">
            <div class="tw-w-full md:tw-w-6/12 lg:tw-w-4/12 xl:tw-w-3/12">
                <v-select
                    label="Logs"
                    v-model="selectedLog"
                    :items="choices"
                    :hide-details="true"
                    variant="outlined"
                    density="comfortable"
                    class="tw-mb-6"
                    color="primary"
                />
            </div>

            <div class="tw-bg-neutral-800 tw-p-4 tw-rounded-md tw-min-h-[450px] tw-h-[450px] tw-text-gray-300 tw-relative">
                <div @click.prevent="reloadLogs" class="tw-absolute tw-top-4 tw-right-4 hover:tw-text-primary tw-cursor-pointer">
                    <v-icon icon="mdi-reload"/>
                </div>
                <div v-if="!isLogLoaded" class="tw-w-[50%] tw-mx-auto tw-h-full tw-flex tw-flex-col tw-items-center justify-center">
                    <v-progress-linear color="primary" :indeterminate="true" :height="12" class=" tw-mx-auto tw-rounded-md"/>
                </div>

                <p v-if="isLogLoaded" v-html="logBuffer" class="tw-pr-6 tw-h-full tw-overflow-y-auto"></p>
            </div>

            <v-pagination
                v-if="hasPagination"
                v-model="currentPage"
                class="tw-mt-6"
                density="comfortable"
                :rounded="true"
                :total-visible="5"
                :length="pagination.totalPages"
            />
        </v-card>
    </div>
    <Loader v-else/>
</template>

<script setup>
import BackButton from '@/components/globals/BackButton.vue';
import { usePage } from '@/libs/page';
import { ref, watch } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { Misc } from '@/libs/graphql';
import { format } from 'date-fns';

const page = usePage();
page.setPageTitle('system.logs');

const isReady = ref(false);
const isLogLoaded = ref(false);
const currentPage = ref(1);
const selectedLog = ref('sail');
const pagination = ref({total: 0, current: 1, totalPages: 1})
const logBuffer = ref('');
const hasPagination = ref(true);

const choices = ref([
    {value: 'sail', title: 'Sail Logs'},
    {value: 'php', title: 'PHP Logs'}
]);

const loadInitial = async () =>
{
    await loadSailLogs();
}

const loadSailLogs = async () =>
{
    let result = await Misc.getSailLogs(currentPage.value, 0);
    logBuffer.value = '';
    pagination.value = result.pagination;

    for (let row of result.list) {
        logBuffer.value += '<b>[' + format(row.date * 1000, 'dd-MM-yyyy HH:mm:ss') + ']</b> ' + row.message.replace(/\n/g, '<br/>') + "<br/>";
    }

    isReady.value = true;
    isLogLoaded.value = true;
}

const reloadLogs = async () =>
{
    if (selectedLog.value === 'sail') {
        isLogLoaded.value = false;
        await loadSailLogs();
        return;
    }

    isLogLoaded.value = false;
    logBuffer.value = '';
    logBuffer.value = await Misc.getPHPLogs();
    isLogLoaded.value = true;
}

watch(selectedLog, async (v) =>
{
    if (v === 'sail') {
        hasPagination.value = true;
        currentPage.value = 1;
        return;
    }

    hasPagination.value = false;
    isLogLoaded.value = false;
    logBuffer.value = '';
    logBuffer.value = await Misc.getPHPLogs();
    isLogLoaded.value = true;
});

watch(currentPage, async (v) =>
{
    isLogLoaded.value = false;
    await loadSailLogs();
});

loadInitial();
</script>
