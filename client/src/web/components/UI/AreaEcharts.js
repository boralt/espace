import React from "react";

import ReactEcharts from 'echarts-for-react';

class AreaEcharts extends React.Component {
    render() {
        let x = []
        let data1 = []
        let data2 = []
        for (let i=0; i<23 ; i++){
            x.push(i + ': 00')
            data1.push(5500+ parseInt(Math.random()*2000))
            data2.push(2000+ parseInt(Math.random()*3499))
        }
        let option = {
            title:{
                text:"Bandwidth Consumption",
                subtext:"Last 1 day"
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: "10px",
                right: '10px',
                bottom: '10px',
                containLabel: true
            },
            legend:{
                data:["Provider 1", "Provider 2"],
                right:20
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
            },
            yAxis: {
                type: 'value',
                label:"kbps consumed"
            },
            series: [{
                name:"Provider 1",
                data: data1,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#F0F1F3'},
                itemStyle: {color: '#C6C6C6'}
            }, {
                name:"Provider 2",
                data: data2,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#DCE6F1'},
                itemStyle: {color: '#C0C8D1'}
            }]
        };
        return (
            <ReactEcharts option={option} />
        )
    }
}
export default AreaEcharts;