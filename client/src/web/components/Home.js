import React from 'react';
import { Col, Row, Card, CardBody,CardImg,CardTitle } from 'reactstrap';
import DashGraph from "./UI/DashGraph";
import ProviderGraph from "./UI/ProviderGraph";
import DashGraphDown from "./UI/DashGraphDown";
import IncidentGraph from "./UI/IncidentGraph";
import AreaEcharts from "./UI/AreaEcharts";
import CostGraph from "./UI/CostGraph";
import LineEcharts from "./UI/LineEcharts";
class Dashboard extends React.Component {
    render() {
        return (
            <div className="dashboard-container">
                <Row className="four-boards">
                    <Col>
                        <Card>
                            <CardBody>
                                <ProviderGraph text="2 Providers"></ProviderGraph>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <CardBody>
                                <CostGraph text="0.04 $/MB" subText="0.02 $" direction="up"></CostGraph>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <CardBody>
                                <DashGraphDown text=" QoE - 80" subText="14.1%" direction="down"></DashGraphDown>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <CardBody>
                                <IncidentGraph text="44 incidents" subText="2.1%" direction="up" subText="1.1%" direction="down"></IncidentGraph>
                            </CardBody>
                        </Card>
                    </Col>

                </Row>
                <Row className="home-two-graphs">
                    <Col md="7">
                        <Card>
                            <CardBody>
                                <AreaEcharts></AreaEcharts>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="5">
                        <Card style={{width: '80%'}}>
                            <CardBody>
                            <CardTitle>App groups</CardTitle>   
                            <CardImg top width="90%" src="../../../assets/images/appgroup_stack.jpg" alt="Traffic distribution" />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row className="home-two-graphs">
                    <Col md="7">
                        <Card>
                            <CardBody>   
                            <CardImg top width="90%" src="../../../assets/graphs/graph4.jpg" alt="Traffic distribution" />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="5">
                        <Card>
                            <CardBody>
                                <LineEcharts></LineEcharts>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;
