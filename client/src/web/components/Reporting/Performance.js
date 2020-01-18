import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import Bar2Echarts from "../UI/Bar2Echarts";  
import HeatEcharts from "../UI/HeatEcharts"
import LatencyEcharts from "../UI/LatencyEcharts"
import GoodputEcharts from "../UI/GoodputEcharts"; 
import JitterEcharts from "../UI/jitterEcharts"; 

class Performance extends React.Component {
    render() {
        return (
            <div>
            
            <Card width="90%">
            
            <CardBody>
            <HeatEcharts></HeatEcharts>
            <CardImg right src='../../../assets/graphs/performance_graph1.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
            </CardBody>
            <CardBody>
            <LatencyEcharts></LatencyEcharts>
            <CardImg right src='../../../assets/graphs/performance_graph2.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
            </CardBody>
            <CardBody>
            <JitterEcharts></JitterEcharts>
            <CardImg right src='../../../assets/graphs/performance_graph3.jpg' alt="img" style={{paddingLeft:'10px',paddingRight:'10px'}}/>
            </CardBody>
            {/* <CardBody>
            <GoodputEcharts></GoodputEcharts>
            </CardBody> */}
          </Card>
          <Card width="90%">
              
              {/* <CardBody>
              <Bar2Echarts></Bar2Echarts>
              </CardBody> */}
            </Card>
          </div>
          
        )
    }
}

export default Performance;
