import { round } from "lodash";

export const chartOpts = {
    series: [0],
    colors: [],
    chart: {
        height: 225,
        type: 'radialBar'
    },
    stroke: {
        lineCap: "round"
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                background: "#52688F",
                size: '70%',
            },
            dataLabels: {
                name: {
                    offsetY: -2,
                    color: "#fff",
                    fontSize: "20px"
                },
                value: {
                    color: "#fff",
                    fontSize: "16px",

                    offsetY: 15,
                    show: true
                },
            },
            track: {
                dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 0,
                    blur: 4,
                    opacity: 0.15
                }
            },
        },
    },
    labels: []
};

export let cpuTimeChart = {
    theme: {
        mode: 'dark'
    },
    series: [
        {
            name: 'CPU',
            data: []
        }
    ],
    chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
        },
        toolbar: {
            autoSelected: 'zoom'
        }
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
        },
    },
    yaxis: {
        labels: {
            formatter: function (val: number) {
                return round(val, 2);
            },
        },
        title: {
            text: 'Percentage'
        },
    },
    xaxis: {
        type: 'datetime',
    },
    tooltip: {
        shared: false,
        y: {
            formatter: function (val: number) {
                return val + '%';
            }
        }
    }
};
