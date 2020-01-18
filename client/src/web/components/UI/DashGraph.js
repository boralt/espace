import React from 'react';
import SmallGraph from "./SmallGraph";
import { Row, Col } from 'reactstrap';
class DashGraph extends React.Component {

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
                <Row>
                    <Col md={3}><img src='../../../assets/graphs/ses.jpg' width='60%' alt='img'/></Col>
                    <Col md={6}><div className="d-flex justify-content-center  align-items-end">
                    <label style={{paddingTop:'7px'}}><b>{this.props.text}</b></label>
                    {this.props.subText &&
                        <span style={{fontSize:"11px",color:'#0dd00d'}}>{this.props.subText}
                            <i className={this.props.direction == 'up' ? 'icon-arrow-up' : 'icon-arrow-down'}>
                            </i>
                        </span>
                    }
                </div></Col>
                    <Col md={3}><img src='../../../assets/graphs/speedcast.png' style={{width:'100%',paddingTop:'5px',height:'35px'}} alt='img'/></Col>
                    
                </Row>
                
                <SmallGraph data={option}></SmallGraph>
            </div>

        )
    }
}
export default DashGraph;
