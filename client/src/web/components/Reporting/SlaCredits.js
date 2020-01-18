import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import Bar2Echarts from "../UI/Bar2Echarts";  
import HeatEcharts from "../UI/HeatEcharts"
import LatencyEcharts from "../UI/LatencyEcharts"
import GoodputEcharts from "../UI/GoodputEcharts"; 
import JitterEcharts from "../UI/jitterEcharts"; 

class SlaCredits extends React.Component {
    render() {
        return (
            <div>
            
            <Card width="90%">
            
            <CardBody>
            <HeatEcharts></HeatEcharts>
            </CardBody>
            <CardBody>
            <LatencyEcharts></LatencyEcharts>
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
            </Card>
          </div>
          
        )
    }
}

export default SlaCredits;
