export const chartOpts = {
    series: [0],
    colors: [],
    chart: {
        height: 350,
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
                    offsetY: -10,
                    color: "#fff",
                    fontSize: "20px"
                },
                value: {
                    color: "#fff",
                    fontSize: "30px",
                    show: true
                }
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
