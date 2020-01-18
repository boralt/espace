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
    Form, FormGroup,
    TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import Slider from '@material-ui/core/Slider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import classnames from 'classnames';
import { Link, withRouter } from 'react-router-dom';

class Provider extends React.Component {
    toggle1 = () => this.setState({dropdownOpen1:!this.state.dropdownOpen1});
    toggle2 = () => this.setState({dropdownOpen2:!this.state.dropdownOpen2});
    toggle3 = () => this.setState({dropdownOpen3:!this.state.dropdownOpen3});
    toggle = tab => this.setState({activeTab:tab});
  
    state = {
        priceRange:[1200,2500],
        bandRange:[3500,5300],
        selectedDate:new Date('2019-12-18T21:11:54'),
        selectedDate2:new Date('2019-12-19T21:11:54'),
        dropdownOpen1:false,
        dropdownOpen2:false,
        dropdownOpen3:false,
        activeTab:'1'
    }
    handleSliderChange = (event,value)=>{
        this.setState({
            priceRange:value
        })
    }
    
    handleSlider2Change = (event,value)=>{
      this.setState({
        bandRange:value
      })
    }
  
    handleDateChange = date => {
      this.setState({selectedDate:date});
    };
    handleDate2Change = date => {
      this.setState({selectedDate2:date});
    };
   useStyles = makeStyles({
    root: {
      width: 300,
    },
  });
  
    render() {
        return (
            <div>
               <Row>
                <Col md={3}>
                    <Card>
                      <CardBody>
                        <CardTitle style={{paddingBottom:'20px',paddingTop:'10px'}}>Provider Configuration 
                        <Button style={{float:'right',borderRadius:'20px',lineHeight:'normal'}}>&nbsp;Add&nbsp;</Button></CardTitle>
                        <div style={{paddingTop:'20px',paddingBottom:'20px'}}>
                          <CardSubtitle className='cstTitle'>Test_TC_Viasat</CardSubtitle>
                          <CardText>Priority:9</CardText>
                        </div>
                        <hr />
                        <div style={{paddingTop:'20px'}}>
                          <CardSubtitle className='cstTitle'>Test_TC_Viasat</CardSubtitle>
                          <CardText>Priority:1</CardText>
                        </div>
                        <hr />
                        <div style={{paddingTop:'20px'}}>
                          <CardSubtitle className='cstTitle'>Test_TC_1</CardSubtitle>
                          <CardText>Priority:1</CardText>
                        </div>
                        
                      </CardBody>
                    </Card>
                </Col>
                <Col md={9}>
                <Card width="100%" style={{padding:'5px'}}>
                <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '1' })}
            onClick={() => { this.toggle('1'); }}
          >
            Consumption
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.activeTab === '2' })}
            onClick={() => { this.toggle('2'); }}
          >
            Flat
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="1">
        <CardBody>
                <Container>
                    
                   
                    <div>
                        <Row form>
                            <Col md={4}>
                            <FormGroup style={{marginRight:'50%'}}>
                                <Label for="name">Consumption </Label>
                            </FormGroup>
                            <br />
                            <FormGroup>
                                <Label for="examplePassword">Region</Label>
                                <br />
                                &nbsp;&nbsp;<ButtonDropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle1.bind(this)}>
                                <DropdownToggle caret>
                                &nbsp;&nbsp;U.S.A&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >U.S.A</DropdownItem>
                                    <DropdownItem header> Italy</DropdownItem>
                                    <DropdownItem header>France</DropdownItem>
                                    <DropdownItem header>Singapore</DropdownItem>
                                    <DropdownItem header>Australia</DropdownItem>
                                    <DropdownItem header>China</DropdownItem>
                                    <DropdownItem header>Malaysia</DropdownItem>
                                    <DropdownItem header>Norway</DropdownItem>
                                    <DropdownItem header>U.K</DropdownItem>
                                    <DropdownItem header>Russia</DropdownItem>
                                    <DropdownItem header>Thailand</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </FormGroup>
                            </Col>
                            <Col md={8}>
                            <ButtonToolbar>
                                    <ButtonGroup>
                                    <Label for="examplePassword" style={{paddingTop: '16px'}}>Quota &nbsp;</Label>
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
                                <br />
                            <Label for="name">Term </Label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Choose From Date"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Choose To Date"
          value={this.state.selectedDate2}
          onChange={this.handleDate2Change}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
                           
                            </Col>
                            </Row>
                        <hr />
                        <Label for="name" style={{fontWeight:'700',paddingBottom:'5px'}}>SLA</Label>
                        <Row form>
                            <Col md={3} >
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Packet Loss &nbsp;</Label>
                                
                                <Input />
                            </InputGroup>
                            
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Latency &nbsp;</Label>
                                
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Uptime &nbsp;</Label>
                                <Input />
                            </InputGroup>
                            </Col>
                        </Row>
                        <br /><hr />
                        <Row> 
                        <Col md={3}><label style={{paddingTop:'7px'}}><b>Increment</b></label>
                            <span style={{fontSize:"11px",color:'#0dd00d'}}>&nbsp;0.05 $/MB
                            <i className= 'icon-arrow-up'>
                            </i>
                            </span></Col>
                            <Col md={3}><InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Credit &nbsp;</Label>
                                
                                <Input />
                            </InputGroup></Col>
                            <Col md={6}></Col>    
                        </Row>
                        <br />
                    
                    </div>
                   
                </Container>
              </CardBody>
        </TabPane>
        <TabPane tabId="2">
        <CardBody>
                <Container>
                    
                   
                    <div>
                        <Row form>
                            <Col md={4}>
                            <FormGroup style={{marginRight:'50%'}}>
                                <Label for="name">Flat </Label>
                                
                            </FormGroup>
                            <br />
                            <FormGroup>
                                <Label for="examplePassword">Region</Label>
                                <br />
                                &nbsp;&nbsp;<ButtonDropdown isOpen={this.state.dropdownOpen1} toggle={this.toggle1.bind(this)}>
                                <DropdownToggle caret>
                                &nbsp;&nbsp;U.S.A&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >U.S.A</DropdownItem>
                                    <DropdownItem header> Italy</DropdownItem>
                                    <DropdownItem header>France</DropdownItem>
                                    <DropdownItem header>Singapore</DropdownItem>
                                    <DropdownItem header>Australia</DropdownItem>
                                    <DropdownItem header>China</DropdownItem>
                                    <DropdownItem header>Malaysia</DropdownItem>
                                    <DropdownItem header>Norway</DropdownItem>
                                    <DropdownItem header>U.K</DropdownItem>
                                    <DropdownItem header>Russia</DropdownItem>
                                    <DropdownItem header>Thailand</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </FormGroup>
                            </Col>
                            <Col md={8}>
                            <ButtonToolbar>
                                    <ButtonGroup>
                                    <Label for="examplePassword" style={{paddingTop: '16px'}}>Quota &nbsp;</Label>
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
                                <br />
                            <Label for="name">Term </Label>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Choose From Date"
          value={this.state.selectedDate}
          onChange={this.handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Choose To Date"
          value={this.state.selectedDate2}
          onChange={this.handleDate2Change}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
                           
                            </Col>
                            </Row>
                        <hr />
                        <Label for="name" style={{fontWeight:'700',paddingBottom:'5px'}}>SLA</Label>
                        <Row form>
                            <Col md={3} >
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Packet Loss &nbsp;</Label>
                                
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Latency &nbsp;</Label>
                                
                                <Input />
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Uptime &nbsp;</Label>
                                <Input />
                            </InputGroup>
                            </Col>
                        </Row>
                        <br />
                        <hr />
                        <Row> 
                        <Col md={3}><label style={{paddingTop:'7px'}}><b>Increment</b></label>
                            <span style={{fontSize:"11px",color:'#0dd00d'}}>&nbsp;0.05 $/MB
                            <i className= 'icon-arrow-up'>
                            </i>
                            </span></Col>
                            <Col md={3}><InputGroup className="padding20">
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Credit &nbsp;</Label>
                                
                                <Input />
                            </InputGroup></Col>
                            <Col md={6}></Col>    
                        </Row>
                        <hr /><br />
                        <Row style={{fontSize:'12px'}}>
                            <Col md={3} >
                            <InputGroup>
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Upstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input value={this.state.priceRange[0]}/>
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup>
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Downstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input value={this.state.priceRange[1]}/>
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup>
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Upstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input value={this.state.bandRange[0]}/>
                            </InputGroup>
                            </Col>
                            <Col md={3}>
                            <InputGroup>
                            <Label for="examplePassword" style={{paddingTop: '5px'}}>Downstream &nbsp;</Label>
                                <InputGroupAddon addonType="prepend">
                                     <InputGroupText>kbps</InputGroupText>
                                </InputGroupAddon>
                                <Input value={this.state.bandRange[1]}/>
                            </InputGroup>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col md={6} className='cstSlider'>
                            <Slider
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        value={this.state.priceRange}
                        min = {100}
                        max={10000}
                        step={100}
                        onChange={this.handleSliderChange}
                    />
                                
                            </Col>
                            <Col md={6} className='cstSlider'>
                            <Slider
                          valueLabelDisplay="auto"
                          aria-labelledby="band-range-slider"
                          value={this.state.bandRange}
                          min = {100}
                          max={10000}
                          step={100}
                          onChange={this.handleSlider2Change}
                      />
                            </Col>
                        </Row>
                        <br />
                      
                    </div>
                   
                </Container>
              </CardBody>
        </TabPane>
      </TabContent>
              
              
            </Card>
                </Col>
              </Row>
            </div>
        )
    }
}

export default Provider;
