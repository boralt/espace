import React, { useState } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Container, Row, Col,  InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    Input,
    DropdownToggle,ButtonDropdown,
    DropdownMenu,ButtonToolbar,ButtonGroup,
    DropdownItem,InputGroupText, 
    Label,ListGroup,ListGroupItem,
    Form, FormGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import UpstreamCharts from "../UI/UpstreamCharts";
import DownstreamCharts from "../UI/DownstreamCharts";

class Channel extends React.Component {
    state={
        dropdownOpen1:true,
    }
   toggle1 = () => this.setState({dropdownOpen1:!this.state.dropdownOpen1});
   useStyles = makeStyles({
    root: {
      width: 300,
    },
  });
  
    render() {
        return (
            <div>
            <Card width="90%">
              
              <CardBody>
                <CardTitle>Channel Configuration</CardTitle>
                <Container>
                    
                   
                    <div>
                        <Row form>
                            <Col md={6}>
                            
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Label for="examplePassword" style={{paddingTop: '5px'}}>Name &nbsp;</Label>
                                </InputGroupAddon>
                                <Input placeholder="" style={{marginRight:'30%'}}/>
                            </InputGroup>
                           
                            <br />
                            <FormControlLabel style={{marginLeft:'2px'}}
                                value="start"
                                control={<Switch color="primary" />}
                                label="Metered"
                                labelPlacement="start"
                            />
                            <br /> <br />
                            <FormControlLabel style={{marginLeft:'2px'}}
                                value="start"
                                control={  <Button color="success" style={{marginLeft:'10px'}}>&nbsp;&nbsp; UP &nbsp;&nbsp;</Button>}
                                label="Admin"
                                labelPlacement="start"
                            />
                            </Col>
                            
                            <Col md={6}>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Label for="examplePassword" style={{paddingTop: '5px'}}>Cost &nbsp;</Label>
                                
                                </InputGroupAddon>
                                <Input placeholder="" style={{marginRight:'25%'}}/>
                                
                            </InputGroup>
                            <br />
                            <Row>
                                <Col md={4}><Label for="examplePassword" style={{paddingTop: '5px'}}>Packet Loss</Label></Col>
                                <Col md={8}><InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <Label for="examplePassword" style={{paddingTop: '5px'}}>Upstream &nbsp;</Label>
                                
                                </InputGroupAddon>
                                <Input placeholder="" style={{marginRight:'40%'}}/>
                                
                            </InputGroup></Col>
                           
                            </Row>
                            <br />
                            <ButtonToolbar style={{justifyContent:'center'}}>
                                    <ButtonGroup>
                                    <div className="custDiv">
                                        <Button className="btnSlider">0</Button>
                                        <Button className="btnSlider" >20</Button>
                                        <Button className="btnSlider">40</Button>
                                        <Button className="btnSlider">60</Button>
                                        <Button className="btnSlider">80</Button>
                                        <Button className="btnSlider">100</Button>
                                    </div>    
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={2}>Channel Bandwidth</Col>
                            <Col md={10}><hr /></Col>
                        </Row>
                        <br /><br />
                        <Row form>
                            <Col md={3} >
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Upstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Downstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Upstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Downstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input />
                            </InputGroup>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={6}>
                                
                                <ButtonToolbar>
                                    <ButtonGroup>
                                    <Label for="examplePassword" style={{paddingTop: '16px'}}>CIR &nbsp;</Label>
                                    <div className="custDiv">
                                        <Button className="btnSlider">0</Button>
                                        <Button className="btnSlider" >10</Button>
                                        <Button className="btnSlider" >20</Button>
                                        <Button className="btnSlider" >30</Button>
                                        <Button className="btnSlider">40</Button>
                                        <Button className="btnSlider" >50</Button>
                                        <Button className="btnSlider">60</Button>
                                        <Button className="btnSlider" >70</Button>
                                        <Button className="btnSlider">80</Button>
                                        <Button className="btnSlider" >90</Button>
                                        <Button className="btnSlider">100</Button>
                                    </div>    
                                    </ButtonGroup>
                                </ButtonToolbar>
                                
                            </Col>
                            <Col md={6}>
                                <ButtonToolbar>
                                    <ButtonGroup>
                                    <Label for="examplePassword" style={{paddingTop: '16px'}}>MIR &nbsp;</Label>
                                    <div className="custDiv">
                                    <Button className="btnSlider">0</Button>
                                        <Button className="btnSlider" >10</Button>
                                        <Button className="btnSlider" >20</Button>
                                        <Button className="btnSlider" >30</Button>
                                        <Button className="btnSlider">40</Button>
                                        <Button className="btnSlider" >50</Button>
                                        <Button className="btnSlider">60</Button>
                                        <Button className="btnSlider" >70</Button>
                                        <Button className="btnSlider">80</Button>
                                        <Button className="btnSlider" >90</Button>
                                        <Button className="btnSlider">100</Button>
                                    </div>    
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={6}>
                            <Card>
                            <CardBody>
                                <UpstreamCharts></UpstreamCharts>
                            </CardBody>
                        </Card>
                            </Col>
                            <Col md={6}>
                            <Card>
                            <CardBody>
                                <DownstreamCharts></DownstreamCharts>
                            </CardBody>
                        </Card>
                            </Col>
                        </Row>
                    </div>
                   
                </Container>
              </CardBody>
            </Card>
          </div>
        )
    }
}

export default Channel;
