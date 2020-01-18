import React from 'react';
import { Row, Col, Progress } from 'reactstrap';
import PropTypes from "prop-types";
import ReactEcharts from 'echarts-for-react';

class SankeyGraph extends React.Component {
    render() {
        let data1 = {
            nodes: [
                { "name": "Channel 1" },
                { "name": "RealTime Interactive",
                    "itemStyle":{
                        "color":"#fbe104"
                    } 
                },
                { "name": "Web Interactive" ,
                "itemStyle":{
                    "color":"#008a00"
                } },
                { "name": "Streaming" ,
                "itemStyle":{
                    "color":"#1ba1e3" 
                } },
                { "name": "Bi-Directional" ,
                "itemStyle":{
                    "color":"#a0522e"
                }},
                { "name": "High Volume FT App" ,
                "itemStyle":{
                    "color":"#f0a30d"
                }},
                { "name": "Scavenger"  ,
                "itemStyle":{
                    "color":"#e95642"
                }},
                { "name": "FEC 100" ,
                "itemStyle":{
                    "color":"#91c7ae"
                }},
                { "name": "FEC 115" ,
                "itemStyle":{
                    "color":"#61a0a8"
                }},
                { "name": "FEC 150",
                "itemStyle":{
                    "color":"#0d4046"
                } }
            ],
            links: [
                {"source": "Channel 1", "target": "RealTime Interactive", "value": 3},
                {"source": "Channel 1", "target": "Streaming", "value": 2},
                {"source": "Channel 1", "target": "Bi-Directional", "value": 2},
                {"source": "Channel 1", "target": "High Volume FT App", "value": 2},
                {"source": "Channel 1", "target": "Scavenger", "value": 2},
                {"source": "Channel 1", "target": "Web Interactive", "value": 2},

                {"source": "Streaming", "target": "FEC 100", "value": 2},
                {"source": "High Volume FT App", "target": "FEC 100", "value": 2},

                {"source": "Web Interactive", "target": "FEC 115", "value": 2},
                {"source": "Bi-Directional", "target": "FEC 150", "value": 2},
                {"source": "Scavenger", "target": "FEC 150", "value": 2},
                {"source": "RealTime Interactive", "target": "FEC 150", "value": 3},

            ]
        }
        let data2 = {
            nodes: [
                { "name": "Channel 2" },
                { "name": "RealTime Interactive" ,
                "itemStyle":{
                    "color":"#fbe104"
                } },
                { "name": "Streaming" ,
                "itemStyle":{
                    "color":"#1ba1e3"
                }},
                { "name": "Bi-Directional" ,
                "itemStyle":{
                    "color":"#a0522e"
                }},
                { "name": "High Volume FT App"  ,
                "itemStyle":{
                    "color":"#f0a30d"
                }},
                { "name": "Scavenger" ,
                "itemStyle":{
                    "color":"#e95642"
                }},
                { "name": "FEC 100" ,
                "itemStyle":{
                    "color":"#91c7ae"
                }},
                { "name": "FEC 115" ,
                "itemStyle":{
                    "color":"#61a0a8"
                }},
                { "name": "FEC 150" ,
                "itemStyle":{
                    "color":"#0d4046"
                }}
            ],
            links: [
                {"source": "Channel 2", "target": "RealTime Interactive", "value": 2},
                {"source": "Channel 2", "target": "Streaming", "value": 2},
                {"source": "Channel 2", "target": "Bi-Directional", "value": 2},
                {"source": "Channel 2", "target": "High Volume FT App", "value": 4},
                {"source": "Channel 2", "target": "Scavenger", "value": 2},

                {"source": "Bi-Directional", "target": "FEC 100", "value": 2},
                {"source": "Streaming", "target": "FEC 100", "value": 2},
                {"source": "High Volume FT App", "target": "FEC 100", "value": 2},

                {"source": "High Volume FT App", "target": "FEC 115", "value": 2},
                {"source": "Scavenger", "target": "FEC 115", "value": 2},

                {"source": "RealTime Interactive", "target": "FEC 150", "value": 2},

            ]
        }
        let data3 = {
            nodes: [
                { "name": "Channel 3" },
                { "name": "RealTime Interactive" ,
                "itemStyle":{
                    "color":"#fbe104"
                } },
                { "name": "Web Interactive" ,
                "itemStyle":{
                    "color":"#008a00"
                }},
                { "name": "Streaming",
                "itemStyle":{
                    "color":"#1ba1e3"
                } },
                { "name": "FEC 100" ,
                "itemStyle":{
                    "color":"#91c7ae"
                }},
                { "name": "FEC 115" ,
                "itemStyle":{
                    "color":"#61a0a8"
                }}, 
                { "name": "FEC 150" ,
                "itemStyle":{
                    "color":"#0d4046"
                }}
            ],
            links: [
                {"source": "Channel 3", "target": "RealTime Interactive", "value": 2},
                {"source": "Channel 3", "target": "Streaming", "value": 2},
                {"source": "Channel 3", "target": "Web Interactive", "value": 2},

                {"source": "Web Interactive", "target": "FEC 100", "value": 2},
                {"source": "Streaming", "target": "FEC 115", "value": 2},
                {"source": "RealTime Interactive", "target": "FEC 150", "value": 2}

            ]
        }
                   
        let option1 = {
            title: {
                text: 'Channel Distribution -  Channel 1'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    top:50,
                    left:0,
                    right:150,
                    type: 'sankey',
                    data: data1.nodes,
                    links: data1.links,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            ]
        }
        let option2 = {
            title: {
                text: 'Channel Distribution - Channel 2'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    top:50,
                    left:0,
                    right:150,
                    type: 'sankey',
                    data: data2.nodes,
                    links: data2.links,
                    focusNodeAdjacency:false,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            ]
        }
        let option3 = {
            title: {
                text: 'Channel Distribution - Channel 3'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'sankey',
                    top:50,
                    left:0,
                    right:150,
                    data: data3.nodes,
                    links: data3.links,
                    itemStyle: {
                        borderWidth: 1,
                        borderColor: '#aaa'
                    },
                    lineStyle: {
                        color: 'source',
                        curveness: 0.5
                    }
                }
            ]
        }
        return (
            <div class="sankey-graph">
                <ReactEcharts option={option1} style={{height:"350px"}}/>
                <ReactEcharts option={option2} style={{height:"350px"}}/>
                <ReactEcharts option={option3} style={{height:"350px"}}/>
            </div>
        )
    }
}

export default SankeyGraph;