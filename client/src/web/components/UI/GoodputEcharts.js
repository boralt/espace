import React from "react";

import ReactEcharts from 'echarts-for-react';

class GoodputEcharts extends React.Component {
    render() {
        let x = []
        let data1 = []
        let data2 = []
        let data3 = []
        let data4 = []
        let data5 = []
        let data6 = []
        let data7 = []
        let data8 = []
        for (let i=0; i<60 ; i++){
            x.push('20:'+i)
            data1.push(10000+ parseInt(Math.random()*10000))
            data2.push(15000+ parseInt(Math.random()*10000))
            data3.push(20000+ parseInt(Math.random()*10000))
            data4.push(30000+ parseInt(Math.random()*10000))
            data5.push(35000+ parseInt(Math.random()*10000))
            data6.push(42000+ parseInt(Math.random()*10000))
            data7.push(55000+ parseInt(Math.random()*10000))
            data8.push(65000+ parseInt(Math.random()*10000))
        }
        let option = {
            title:{
                text:"Goodput per App Group"
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: "20px",
                right: '20px',
                bottom: '20px',
                containLabel: true
            },
            legend:{
                data:["App 1", "App 2", "App 3", "App 4", "App 5", "App 6", "App 7", "App 8"],
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
                name:"App 1",
                data: data1,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#A86260'},
                itemStyle: {color: '#A86260'}
            }, {
                name:"App 2",
                data: data2,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#D9B47F'},
                itemStyle: {color: '#D9B47F'}
            }, {
                name:"App 3",
                data: data3,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#6C73CD'},
                itemStyle: {color: '#6C73CD'}
            }, {
                name:"App 4",
                data: data4,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#AE846C'},
                itemStyle: {color: '#AE846C'}
            }, {
                name:"App 5",
                data: data5,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#76C1DB'},
                itemStyle: {color: '#76C1DB'}
            }, {
                name:"App 6",
                data: data6,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#9E90C2'},
                itemStyle: {color: '#9E90C2'}
            }, {
                name:"App 7",
                data: data7,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#87C982'},
                itemStyle: {color: '#87C982'}
            }, {
                name:"App 8",
                data: data8,
                type: 'line',
                smooth: true,
                areaStyle: {color: '#C5B386'},
                itemStyle: {color: '#C5B386'}
            }]
        };
        return (
            <ReactEcharts option={option} />
        )
    }
}
export default GoodputEcharts;