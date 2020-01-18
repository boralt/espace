import React from "react";

import ReactEcharts from 'echarts-for-react';

class LineEcharts extends React.Component {
    render() {
        let x = []
        let data1 = []
        let data2 = []
        for (let i=0; i<23 ; i++){
            x.push(i+ ': 00')
            data1.push(8000+ parseInt(Math.random()*2900))
            data2.push(6000+ parseInt(Math.random()*3900))
            // data2.push(5000)
        }
        let option = {
            title: {
                text: "Bandwidth Prediction"
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data: ["Operational", "Predicted"],
                right: 20
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: x
            },
            yAxis: {
                type: 'value',
                label: "kbps consumed"
            },
            series: [{
                name: "Operational",
                data: data1,
                type: 'line',
                itemStyle: {color:'#4290d8'},
                showSymbol: false
            }, {
                name: "Predicted",
                data: data2,
                showSymbol: false,
                type: 'line'
            }]
        };
        return (
            <ReactEcharts option={option} style={{ height: "400px" }} />
        )
    }
}
export default LineEcharts;