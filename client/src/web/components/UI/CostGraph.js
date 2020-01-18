import React from 'react';
import SmallGraph from "./SmallGraph";
import { Row, Col } from 'reactstrap';
class CostGraph extends React.Component {

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
                    <Col md={9}><div className="d-flex align-items-end">
                    <label style={{margin:0}}><b>{this.props.text}</b></label>
                    {this.props.subText &&
                        <span style={{fontSize:"13px",color:'#00d08a',margin: "2px 3px"}}>{this.props.subText}
                            <i className={this.props.direction == 'up' ? 'icon-arrow-up' : 'icon-arrow-down'}>
                            </i>
                        </span>
                    }
                </div></Col>
                </Row>
                <Row>
                    <Col md={3}><img src='../../../assets/graphs/speedcast.png' width='100%' alt='img'/></Col>
                    <Col md={9}><div className="d-flex align-items-end">
                    <label style={{margin:0}}><b>0.045 $/MB</b></label>
                    {this.props.subText &&
                        <span style={{fontSize:"13px",color:'#C92440',margin: "2px 3px"}}>0.05$
                            <i className={this.props.direction == 'up' ? 'icon-arrow-down' : 'icon-arrow-down'}>
                            </i>
                        </span>
                    }
                </div></Col>
                </Row>
                <SmallGraph data={option}></SmallGraph>
            </div>

        )
    }
}
export default CostGraph;
