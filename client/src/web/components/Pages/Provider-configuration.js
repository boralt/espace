import React from 'react';
import { Card, CardImg, 
    Row,Col,Badge,
    CardText, CardBody,
    CardTitle, CardSubtitle, Button } from 'reactstrap';
import Bar2Echarts from "../UI/Bar2Echarts";

class ProviderConfig extends React.Component {
    render() {
        return (
            <div>
          <Card width="100%">
          <Row>
                        <Col md={2} >
                        
                        <CardImg right src='../../../assets/images/brand2.jpg' alt="img" style={{paddingLeft:'10px',paddingTop:'10px'}}/>
                        </Col>
                        <Col md={5}>
                        <CardTitle style={{paddingLeft:'15px',paddingTop:'20px'}}>
                        Comtech Telecommunications Corp.</CardTitle>
                        </Col>
                        <Col md={2}>
                        <CardTitle style={{paddingLeft:'15px',paddingTop:'10px'}}></CardTitle>
                        </Col>
                        <Col md={3} style={{paddingLeft:'15px',paddingTop:'10px'}}>
                        <CardTitle style={{marginBottom:'0px'}}>Excellent&nbsp;<Badge href="#" color="secondary">4.6</Badge></CardTitle>
                        <small>33+ Reviews</small>
                        </Col>
                    </Row>
                    <CardBody style={{padding:'1.5rem'}}>
                    
                    <CardText>
                        <Row>
                            <Col md={9}>
                              <p>Comtech Telecommunications Corp. designs, develops, produces and markets innovative products, systems and services for advanced communications solutions.</p>
                            <Row>
                              <Col md={3}>
                              <CardSubtitle>Bandwidth :98%</CardSubtitle>
                              </Col>
                              <Col md={1}>
                                
                              </Col>
                              <Col md={8}>
                                <CardSubtitle style={{marginBottom:'0rem'}}>SLA :</CardSubtitle>
                                <small>Latency: (600-850ms), </small>
                                <small>Jitter: (2-100ms), </small>
                                <small>Availability: (96-99.999%)</small>
                              </Col>
                            </Row>
                            </Col>
                            <Col md={3}>
                                <p style={{marginBottom:'0px'}}>$2,345.10</p>
                                <small>+$ 137 taxes and charges</small>
                            </Col>
                        </Row></CardText>
                    
                    </CardBody>
            </Card>
          </div>
          
        )
    }
}

export default ProviderConfig;
