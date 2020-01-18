import React from "react";

import ReactEcharts from 'echarts-for-react';

class LineEcharts extends React.Component {
    render() {
        let option = {
            title: {
                text: "QoE"
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ["Channel 1", "Channel 2"],
                right: 20
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: ['App1', 'App2', 'App3', 'App4', 'App5', 'App6']
            },
            yAxis: {
                type: 'value',
                label: "kbps consumed"
            },
            series: [{
                name: "Channel 1",
                data: [820, 932, 901, 934, 1290, 1330],
                type: 'line'
            }, {
                name: "Channel 2",
                data: [320, 332, 401, 534, 290, 330],
                type: 'line'
            }]
        };
        return (
            <ReactEcharts option={option} style={{ height: "400px" }} />
        )
    }
}
export default LineEcharts;