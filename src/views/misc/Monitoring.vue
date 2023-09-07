<template>
    <div v-if="isReady">
        <BackButton :url="{name: 'Settings'}"/>

        <div class="tw-flex tw-flex-row tw-items-center tw-justify-between tw-border tw-border-red-500">
            <div id="cpu"></div>
            <div id="ram"></div>
            <div id="disk"></div>
        </div>
    </div>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import BackButton from '@/components/globals/BackButton.vue';
import Loader from '@/components/globals/Loader.vue';
import { nextTick, ref } from 'vue';
import { Misc } from '@/libs/graphql';
import ApexCharts from 'apexcharts'
import { chartOpts } from '@/libs/charts';
import { cloneDeep, round } from 'lodash';

const isReady = ref(false);

const page = usePage();
page.setPageTitle('system.info');

const loadSample = async () =>
{
    let result = await Misc.getLiveMonitoringSample();

    console.log(result);

    isReady.value = true;

    await nextTick(() =>
    {
        setupCpu(result);
        setupRam(result);
        setupDisk(result);
    });
}

const setupCpu = (result) =>
{
    let color = '#238f06';

    if (result.cpu.percent >= 45 && result.cpu.percent < 85) {
        color = '#fabd01';
    } else if (result.cpu.percent >= 85) {
        color = '#cb1111';
    }

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [result.cpu.percent];
    chartOpt.colors = [color];
    chartOpt.labels = ['CPU'];

    var chart = new ApexCharts(document.querySelector("#cpu"), chartOpt);
    chart.render();
}

const setupRam = (result) =>
{
    let color = '#238f06';

    if (result.ram.percent >= 45 && result.ram.percent < 85) {
        color = '#ffc600';
    } else if (result.ram.percent >= 85) {
        color = '#cb1111';
    }

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [result.ram.percent];
    chartOpt.colors = [color];
    chartOpt.labels = ['RAM'];

    var chart = new ApexCharts(document.querySelector("#ram"), chartOpt);
    chart.render();
}

const setupDisk = (result) =>
{
    let color = '#238f06';

    if (result.disk.percent >= 45 && result.disk.percent < 85) {
        color = '#ffc600';
    } else if (result.disk.percent >= 85) {
        color = '#cb1111';
    }

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [result.disk.percent];
    chartOpt.colors = [color];
    chartOpt.labels = ['DISK'];

    console.log(chartOpt);

    var chart = new ApexCharts(document.querySelector("#disk"), chartOpt);
    chart.render();
}

loadSample();
</script>
