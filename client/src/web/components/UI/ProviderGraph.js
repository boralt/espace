import React from 'react';
import SmallGraph from "./SmallGraph";
import { Row, Col } from 'reactstrap';
class ProviderGraph extends React.Component {

    state = {

    }
    render() {
        let x = [];
        let y = [];
        for (let i = 0; i < 10; i++) {
            y.push((Math.random() * 10) % 10);
            x.push(i+1);
        }
        let option = {
            xAxis: {
                type: 'category',
                data: x,
                show:false
            },
            yAxis: {
                type: 'value',
                show:false
                
            },
            grid: {
                left: '0',
                right: '0',
                bottom: '0',
                containLabel: false
            },
            series: [{
                data: y,
                type: 'line',
                smooth: true,
                color:"#ccc"
            }]
        };
        return (
            <div>
                <Row style={{justifyContent:'center'}}>
                    <img src='../../../assets/graphs/ses.jpg' width='30%' alt='img'/>
                </Row>
                <hr />
                <Row style={{justifyContent:'center'}}>
                    <img src='../../../assets/graphs/speedcast.png' width='30%' alt='img'/>
                </Row>   
                
                   
            </div>

        )
    }
}
export default ProviderGraph;
