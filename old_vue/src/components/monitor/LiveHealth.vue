<template>
    <div
        class="tw-rounded-lg lg:tw-h-[260px] lg:tw-max-h-[260px] lg:tw-overflow-hidden"
        :class="{
                'tw-bg-darkbg': $vuetify.theme.name === 'dark',
                'tw-bg-white': $vuetify.theme.name === 'light'
            }"
    >
        <h2 class="tw-pl-6 tw-pt-6 tw-font-medium tw-text-lg">{{ $t('system.live_check') }}</h2>
        <div
            class="tw-grid tw-grid-cols-2 lg:tw-grid-cols-4"
            :class="{'tw-hidden': !graphReady}"
        >
            <div id="cpu"></div>
            <div id="ram"></div>
            <div id="disk"></div>
            <div id="php"></div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import ApexCharts from 'apexcharts'
import { chartOpts } from '@/libs/charts';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n';
import { useTheme } from 'vuetify';

const i18n = useI18n();
const theme = useTheme();
const graphReady = ref(false);

const props = defineProps({
    data: {
        type: Object,
        default: null
    }
});

const init = () =>
{
    graphReady.value = false;

    nextTick(() =>
    {
        setupCpu();
        setupRam();
        setupDisk();
        setupPHP();
    });

    nextTick(() => graphReady.value = true);
}

onMounted(() => init());
watch(i18n.locale, v => init());

const setupCpu = () =>
{
    let color = '#238f06';

    if (props.data.cpu.percent >= 45 && props.data.cpu.percent < 85) {
        color = '#fabd01';
    } else if (props.data.cpu.percent >= 85) {
        color = '#cb1111';
    }

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [props.data.cpu.percent];
    chartOpt.colors = [color];
    chartOpt.labels = ['CPU'];

    var chart = new ApexCharts(document.querySelector("#cpu"), chartOpt);
    chart.render();
}

const setupRam = () =>
{
    let color = '#238f06';

    if (props.data.ram.percent >= 45 && props.data.ram.percent < 85) {
        color = '#ffc600';
    } else if (props.data.ram.percent >= 85) {
        color = '#cb1111';
    }

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [props.data.ram.percent];
    chartOpt.colors = [color];
    chartOpt.labels = ['RAM'];

    var chart = new ApexCharts(document.querySelector("#ram"), chartOpt);
    chart.render();
}

const setupDisk = () =>
{
    let color = '#238f06';

    if (props.data.disk.percent >= 45 && result.disk.percent < 85) {
        color = '#ffc600';
    } else if (props.data.disk.percent >= 85) {
        color = '#cb1111';
    }

    const title = (i18n.locale.value === 'fr') ? 'DISQUE' : 'DISK';

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [props.data.disk.percent];
    chartOpt.colors = [color];
    chartOpt.labels = [title];

    var chart = new ApexCharts(document.querySelector("#disk"), chartOpt);
    chart.render();
}

const setupPHP = () =>
{
    let color = '#238f06';
    if (!props.data.php.latest && props.data.php.supported) color = '#06668f';
    if (!props.data.php.secure) color = '#cb1111';

    const chartOpt = cloneDeep(chartOpts);
    chartOpt.series = [100];
    chartOpt.colors = [color];
    chartOpt.labels = ['PHP'];
    chartOpt.plotOptions.radialBar.dataLabels.name.offsetY = -10;
    chartOpt.plotOptions.radialBar.dataLabels.value.offsetY = 0;
    chartOpt.plotOptions.radialBar.dataLabels.value.formatter = function (val)
    {
        if (props.data.php.latest) {
            return (i18n.locale.value === 'fr') ? [props.data.php.installed, 'À jour'] : [props.data.php.installed, 'Latest'];
        }

        if (!props.data.php.latest && props.data.php.supported) {
            return (i18n.locale.value === 'fr') ? [props.data.php.installed, 'Supporté'] : [props.data.php.installed, 'Supported'];
        }

        return (i18n.locale.value === 'fr') ? [props.data.php.installed, 'Non-supporté'] : [props.data.php.installed, 'Unsupported'];
    }

    var chart = new ApexCharts(document.querySelector("#php"), chartOpt);
    chart.render();
}
</script>
