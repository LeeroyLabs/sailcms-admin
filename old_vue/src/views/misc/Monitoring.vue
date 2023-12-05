<template>
    <div v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>

        <LiveHealth ref="livehealth" :data="liveSample" />

        <div class="tw-mt-6">
            <TabBar :tabs="tabNames" :active="tab" :stretch="false" @change="(e) => tab=e"/>
            <template v-for="(name, idx) in tabNames">
                <div
                    class="tw-p-6 tw-pb-10 tw-rounded-b-md"
                    :class="{
                        'tw-rounded-tr-md': idx === 0, 'tw-rounded-t-md': (idx !== 0 && idx !== 1), 'tw-rounded-tl-md': idx === 1, 'tw-hidden': tab !== idx,
                        'tw-bg-darkbg': $vuetify.theme.name === 'dark',
                        'tw-bg-white': $vuetify.theme.name === 'light'
                    }"
                >
                    <h2 v-if="idx === 0" class="tw-font-medium tw-text-lg tw-mb-4">
                        {{ $t('system.cpu_history') }}
                        <span class="tw-text-base tw-text-neutral-400">({{ $t('system.last_10') }})</span>
                    </h2>

                    <h2 v-if="idx === 1" class="tw-font-medium tw-text-lg tw-mb-4">
                        {{ $t('system.ram_history') }}
                        <span class="tw-text-base tw-text-neutral-400">({{ $t('system.last_10') }})</span>
                    </h2>

                    <h2 v-if="idx === 2" class="tw-font-medium tw-text-lg tw-mb-4">
                        {{ $t('system.disk_history') }}
                        <span class="tw-text-base tw-text-neutral-400">({{ $t('system.last_10') }})</span>
                    </h2>

                    <div v-if="idx === 0" :class="{'tw-hidden': !graphReady}" id="timegraph1"></div>
                    <div v-if="idx === 1" :class="{'tw-hidden': !graphReady}" id="timegraph2"></div>
                    <div v-if="idx === 2" :class="{'tw-hidden': !graphReady}" id="timegraph3"></div>
                </div>
            </template>
        </div>

    </div>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import BackButton from '@/components/globals/BackButton.vue';
import Loader from '@/components/globals/Loader.vue';
import { computed, nextTick, ref, watch } from 'vue';
import { Misc } from '@/libs/graphql';
import ApexCharts from 'apexcharts'
import { cpuTimeChart } from '@/libs/charts';
import { cloneDeep, round } from 'lodash';
import { useI18n } from 'vue-i18n';
import { format, subDays } from 'date-fns';
import { useTheme } from 'vuetify';
import TabBar from '@/components/globals/Tab.vue';
import LiveHealth from '@/components/monitor/LiveHealth.vue';

const isReady = ref(false);
const graphReady = ref(false);

const i18n = useI18n();
const theme = useTheme();
const page = usePage();
page.setPageTitle('system.info');

const liveSample = ref(null);
const rangeSample = ref([]);
const livehealth = ref(null);

const tab = ref(0);
const tabNames = computed(() =>
{
    return ['CPU', 'RAM', i18n.t('system.disk')];
});

const loadSample = async () =>
{
    let start = Math.floor(subDays(new Date(), 10).getTime() / 1000);
    let end = Math.floor(Date.now() / 1000);

    let result = await Misc.getLiveMonitoringSample();
    rangeSample.value = await Misc.getRangeSample(start, end);

    isReady.value = true;

    liveSample.value = result;

    await nextTick(() =>
    {
        setupTimeGraph('1');
        setupTimeGraph('2');
        setupTimeGraph('3');

        setTimeout(() => graphReady.value = true, 150);
    });
}

watch(theme.name, v =>
{
    graphReady.value = false;

    nextTick(() =>
    {
        setupTimeGraph('1');
        setupTimeGraph('2');
        setupTimeGraph('3');

        setTimeout(() => graphReady.value = true, 250);
    });
});

const setupTimeGraph = (graphId) =>
{
    let cpuData = [];
    let ramData = [];
    let diskData = [];

    for (let item of rangeSample.value) {
        cpuData.push([
            format(item.timestamp * 1000, 'MM-dd-yyyy HH:mm'),
            round(item.cpu.percent, 2)
        ]);

        ramData.push([
            format(item.timestamp * 1000, 'MM-dd-yyyy HH:mm'),
            round(item.ram.percent, 2)
        ]);

        diskData.push([
            format(item.timestamp * 1000, 'MM-dd-yyyy HH:mm'),
            round(item.disk.percent, 2)
        ]);
    }

    const options = cloneDeep(cpuTimeChart);

    switch (graphId)
    {
        case '1':
            options.series[0].name = 'CPU';
            options.series[0].data = cpuData;
            break;

        case '2':
            options.series[0].name = 'RAM';
            options.series[0].data = ramData;
            break;

        case '3':
            options.series[0].name = i18n.t('system.disk');
            options.series[0].data = diskData;
            break;
    }

    options.theme.mode = theme.name.value;

    var chart = new ApexCharts(document.querySelector("#timegraph" + graphId), options);
    chart.render();
}

loadSample();
</script>

<style>
#timegraph .apexcharts-canvas {
    @apply tw-pt-8
}
</style>
