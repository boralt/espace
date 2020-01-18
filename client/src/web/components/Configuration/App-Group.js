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

class AppGroup extends React.Component {
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
                <CardTitle>App Group Configuration</CardTitle>
                <Container>
                    
                   
                    <div>
                        <Row form>
                            <Col md={4}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" name="name" id="name"/>&nbsp;&nbsp;
                            </FormGroup>
                            <br />
                            <FormControlLabel
                                value="start"
                                control={<Switch color="primary" />}
                                label="PEP"
                                labelPlacement="start"
                            />
                            </Col>
                            <Col md={4}>
                            
                            <FormGroup>
                                <Label for="examplePassword">App Group Type</Label>
                                <br />
                                &nbsp;&nbsp;<ButtonDropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle1.bind(this)}>
                                <DropdownToggle caret>
                                &nbsp;&nbsp;Realtime - Interactive&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >Realtime - Interactive</DropdownItem>
                                    <DropdownItem header> Web - Interactive</DropdownItem>
                                    <DropdownItem header>Sreaming</DropdownItem>
                                    <DropdownItem header>Bi-Directional</DropdownItem>
                                    <DropdownItem header>High volume FT App</DropdownItem>
                                    <DropdownItem header> Scavenger </DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </FormGroup>
                            </Col>
                            <Col md={4}>
                            <Label for="priority" className="padding35">Priority</Label>
                                <ButtonGroup vertical>
                                    <Button style={{backgroundColor: '#167AE6',color: '#fff'}} className="btnFocus">Control</Button>
                                    <Button style={{backgroundColor: '#4994EB',color: '#fff'}} className="btnFocus">Critical</Button>
                                    <Button style={{backgroundColor: '#5DA1F4',color: '#fff'}} className="btnFocus">High</Button>
                                    <Button style={{backgroundColor: '#75ADF3',color: '#fff'}} className="btnFocus">Medium</Button>
                                    <Button style={{backgroundColor: '#8EBBF1',color: '#fff'}} className="btnFocus">Low</Button>
                                    <Button style={{backgroundColor: '#A4CBF3',color: '#fff'}}className="btnFocus">Best-effort</Button>
                                    <Button style={{backgroundColor: '#BCD7F5',color: '#fff'}}  className="btnFocus">Scavenger</Button>
                                </ButtonGroup>
                            </Col>
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
                            <CardTitle>&nbsp;</CardTitle>   
                            <CardImg top width="90%" src="../../../assets/images/circles.jpg" alt="Traffic distribution" />
                            </CardBody>
                        </Card>
                            </Col>
                            <Col md={6}>
                            <Card>
                            <CardBody>
                            <CardTitle>Policy Region</CardTitle>   
                            <CardImg top width="90%" src="../../../assets/images/maps2.jpg" alt="Traffic distribution" />
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

export default AppGroup;
