import React from "react";

import ReactEcharts from 'echarts-for-react';

class Bar2Echarts extends React.Component {
    render() {
        let option = {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', '2017', '2018', '2019'],
                source: [
                    {product: 'Matcha Latte', '2017': 43.3, '2018': 85.8, '2019': 93.7},
                    {product: 'Milk Tea', '2017': 83.1, '2018': 73.4, '2019': 55.1},
                    {product: 'Cheese Cocoa', '2017': 86.4, '2018': 65.2, '2019': 82.5},
                    {product: 'Walnut Brownie', '2017': 72.4, '2018': 53.9, '2019': 39.1}
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar',itemStyle: {color: '#4290d8'}},
                {type: 'bar',itemStyle: {color: '#9dddc2'}},
                {type: 'bar'}
            ]
        };
        return (
            <ReactEcharts option={option} style={{ height: "400px" }} />
        )
    }
}
export default Bar2Echarts;