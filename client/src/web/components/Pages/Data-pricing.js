import React from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';

class DataPricing extends React.Component {
    render() {
        return (
            <div>
            <Card width="90%">
              
              <CardBody>
                <CardTitle>ARPU</CardTitle>
                <CardImg top width="90%" src="../../../assets/images/data-pricing.jpg" alt="Traffic distribution" />
              </CardBody>
            </Card>
          </div>
        )
    }
}

export default DataPricing;
