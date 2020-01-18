import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import Bar2Echarts from "../UI/Bar2Echarts";  
import HeatEcharts from "../UI/HeatEcharts"
import LatencyEcharts from "../UI/LatencyEcharts"
import GoodputEcharts from "../UI/GoodputEcharts"; 
import JitterEcharts from "../UI/jitterEcharts"; 

class Blockage extends React.Component {
    render() {
        return (
            <Row>
                <Col sm="6">
                    <Card body>
                    <CardTitle> Internal Blockage Map</CardTitle>    
                    <CardImg right src='../../../assets/images/flat_azimut.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                    <CardImg right src='../../../assets/images/circle_azimut_copy.png' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
                    </Card>
                </Col>            
                <Col sm="6">
                    <Card body>
                    <CardTitle> External Blockage Map</CardTitle>    
                    <HeatEcharts></HeatEcharts>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                    <CardImg right src='../../../assets/images/blockage.png' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
                    </Card>
                </Col>            
            {/* <Card width="90%">
            
            <CardBody>
            <CardImg right src='../../../assets/images/flat_azimut.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
            </CardBody>
            <CardBody>
            <CardImg right src='../../../assets/images/circle_azimut.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
            </CardBody>
            <CardBody>
            <JitterEcharts></JitterEcharts>
            </CardBody>
            <CardBody>
            <GoodputEcharts></GoodputEcharts>
            </CardBody>
          </Card>
          <Card width="90%">
              
              <CardBody>
              <Bar2Echarts></Bar2Echarts>
              </CardBody>
            </Card> */}

          </Row>
          
        )
    }
}

export default Blockage;
