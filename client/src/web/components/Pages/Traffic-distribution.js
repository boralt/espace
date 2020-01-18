import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import GoodputEcharts from "../UI/GoodputEcharts"; 
class TrafficDis extends React.Component {
    render() {
        return (
            <div>
            <Card width="90%">
              
              <CardBody>
                <CardTitle>Goodput per App Group</CardTitle>
                <CardImg top width="90%" src="../../../assets/images/Traffic-Distribution-01.jpg" alt="Traffic distribution" />
              </CardBody>
            </Card>
          </div>
        )
    }
}

export default TrafficDis;
