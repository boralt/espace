import 'date-fns';
import React from 'react';
import { Card, CardImg, 
        CardText, CardBody,
        InputGroupText,Input,
        CardTitle, CardSubtitle, 
        Button, Col, Jumbotron,
        Row,Badge,
        FormGroup,Label,
        DropdownToggle,ButtonDropdown,
        DropdownMenu,ButtonToolbar,ButtonGroup,
        DropdownItem, 
        InputGroup,InputGroupAddon, CardFooter } from 'reactstrap';
    
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { Link, withRouter } from 'react-router-dom';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

class ServiceProcurement extends React.Component {

    toggle1 = () => this.setState({dropdownOpen1:!this.state.dropdownOpen1});
    toggle2 = () => this.setState({dropdownOpen2:!this.state.dropdownOpen2});
    toggle3 = () => this.setState({dropdownOpen3:!this.state.dropdownOpen3});
    state = {
        priceRange:[1200,2500],
        bandRange:[3500,5300],
        selectedDate:new Date('2019-12-18T21:11:54'),
        selectedDate2:new Date('2019-12-19T21:11:54'),
        dropdownOpen1:false,
        dropdownOpen2:false,
        dropdownOpen3:false
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
    render() {
        let data = [
            {
              "company": "Viasat, Inc.",
              "price": "$2,636.25",
              "rating": 4.5,
              "reviews": 51,
              "img":"../../../assets/images/brand1.png"
            },
            // {
            //   "company": "Comtech Telecommunications Corp.",
            //   "price": "$1,407.88",
            //   "rating": 4.4,
            //   "reviews": 159,
            //   "img":"../../../assets/images/brand2.jpg"
            // },
            {
              "company": "Inmarsat",
              "price": "$3,404.72",
              "rating": 3.5,
              "reviews": 384,
              "img":"../../../assets/images/brand3.png"
            },
            {
              "company": "Panasonic",
              "price": "$3,253.64",
              "rating": 2.9,
              "reviews": 145,
              "img":"../../../assets/images/brand4.png"
            },
            {
              "company": "Global Eagle",
              "price": "$2,797.18",
              "rating": 4.6,
              "reviews": 35,
              "img":"../../../assets/images/brand5.png"
            },
            {
              "company": "Telespazio S.p.A",
              "price": "$1,797.18",
              "rating": 4.2,
              "reviews": 15,
              "img":"../../../assets/images/telespazio.jpg"
            },
            {
              "company": "Globecast",
              "price": "$3,101.18",
              "rating": 4.7,
              "reviews": 60,
              "img":"../../../assets/images/globecast.png"
            },
            {
              "company": "Optus",
              "price": "$2,309.18",
              "rating": 4.6,
              "reviews": 25,
              "img":"../../../assets/images/optus.png"
            },
            {
              "company": "SingleTel Satellite",
              "price": "$797.18",
              "rating": 3.6,
              "reviews": 49,
              "img":"../../../assets/images/singtel.png"
            },
            {
              "company": "Thaicom Public Compant Ltd",
              "price": "$1,009.18",
              "rating": 4.3,
              "reviews": 55,
              "img":"../../../assets/images/thaicom.jpg"
            },
            {
              "company": "Encompass Digital Media",
              "price": "$3,119.18",
              "rating": 4.8,
              "reviews": 7,
              "img":"../../../assets/images/encompasslogo.jpg"
            },
            {
              "company": "Hispasat",
              "price": "$2,309.18",
              "rating": 4.1,
              "reviews": 64,
              "img":"../../../assets/images/hispasat.png"
            },
            {
              "company": "Arqiva ",
              "price": "$2,123.18",
              "rating": 4.6,
              "reviews": 11,
              "img":"../../../assets/images/arqiva.png"
            },
            {
              "company": "Russian Satellite Communications Company ",
              "price": "$2,654.18",
              "rating": 4.6,
              "reviews": 33,
              "img":"../../../assets/images/rscc.png"
            },
            {
              "company": "Globecomm ",
              "price": "$2,999.18",
              "rating": 4.7,
              "reviews": 27,
              "img":"../../../assets/images/globecomm.jpg"
            },
            {
              "company": "AsiaSat  ",
              "price": "$2,321.18",
              "rating": 3.6,
              "reviews": 22,
              "img":"../../../assets/images/asiasat.png"
            },
            {
              "company": "MEASAT  ",
              "price": "$2,777.18",
              "rating": 4.6,
              "reviews": 55,
              "img":"../../../assets/images/measat.png"
            },
            {
              "company": "Intelsat S. A  ",
              "price": "$2,103.18",
              "rating": 4.3,
              "reviews": 27,
              "img":"../../../assets/images/intelsat.jpg"
            },
            {
              "company": "Eutelsat ",
              "price": "$2,443.18",
              "rating": 4.4,
              "reviews": 20,
              "img":"../../../assets/images/eutelsat.jpg"
            },
            {
              "company": "Telenor Satellite  ",
              "price": "$2,103.18",
              "rating": 4.3,
              "reviews": 27,
              "img":"../../../assets/images/telenor.png"
            },
            {
              "company": "Speedcast ",
              "price": "$2,103.18",
              "rating": 4.3,
              "reviews": 27,
              "img":"../../../assets/images/speedcast.png"
            }
          ]; 
        return (
            <div>
                <Row>
                 <Col  md={3}>
                    <Card width="100%">
                    <CardTitle style={{paddingLeft:'15px',paddingTop:'10px'}}>Procurement </CardTitle>
                    <CardBody>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="icon-magnifier" /></InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="search" />
                    </InputGroup>
                    <CardTitle style={{paddingTop:'10px'}}>Band </CardTitle>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>Ku</Label>
                    </FormGroup>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>Ka</Label>
                    </FormGroup>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>C</Label>
                    </FormGroup>
                    <CardTitle style={{paddingTop:'10px'}}>Price </CardTitle>
                    <Slider
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        value={this.state.priceRange}
                        min = {100}
                        max={10000}
                        step={100}
                        onChange={this.handleSliderChange}
                    />
                    <div style={{textAlign:'center'}}><span>${this.state.priceRange[0]}</span> to <span>${this.state.priceRange[1]}</span></div>
                    <CardTitle style={{paddingTop:'10px'}}>Provider Ratings </CardTitle>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>4★ & above</Label>
                    </FormGroup>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>3★ & above</Label>
                    </FormGroup>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>2★ & above</Label>
                    </FormGroup>
                    <FormGroup style={{paddingLeft:'20px'}}>
                        <Input type="checkbox" name="check" id="exampleCheck"/>
                        <Label for="exampleCheck" check>1★ & above</Label>
                    </FormGroup>
                    <FormGroup>
                      <CardTitle style={{paddingTop:'10px'}}>CIR </CardTitle>
                                &nbsp;&nbsp;
                                <ButtonDropdown 
                                  isOpen={this.state.dropdownOpen1} 
                                  toggle={this.toggle1.bind(this)} 
                                  className="cstBtngrp">
                                <DropdownToggle caret>
                                &nbsp;&nbsp;Choose CIR&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >10-20</DropdownItem>
                                    <DropdownItem header> 20-30</DropdownItem>
                                    <DropdownItem header>30-40</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </FormGroup>
                            <FormGroup>
                      <CardTitle style={{paddingTop:'10px'}}>MIR </CardTitle>
                                &nbsp;&nbsp;<ButtonDropdown isOpen={this.state.dropdownOpen3} toggle={this.toggle3.bind(this)} className="cstBtngrp">
                                <DropdownToggle caret>
                                &nbsp;&nbsp;Choose MIR&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >10-20</DropdownItem>
                                    <DropdownItem header> 20-30</DropdownItem>
                                    <DropdownItem header>30-40</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </FormGroup>
                            <FormGroup>
                      <CardTitle style={{paddingTop:'10px'}}>Teleport Region </CardTitle>
                                &nbsp;&nbsp;<ButtonDropdown isOpen={this.state.dropdownOpen2} toggle={this.toggle2.bind(this)} className="cstBtngrp">
                                <DropdownToggle caret>
                                &nbsp;&nbsp;Choose Region&nbsp;&nbsp;
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem >U.S.A</DropdownItem>
                                    <DropdownItem header>Italy</DropdownItem>
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
                    </CardBody>
                    </Card>
                </Col>
                <Col md={9}>
                  <Jumbotron>
                    <Row>
                        <Col md={4}>
                        <p style={{paddingTop:'10px'}}>Bandwidth </p>
                          <Slider
                          valueLabelDisplay="auto"
                          aria-labelledby="band-range-slider"
                          value={this.state.bandRange}
                          min = {100}
                          max={10000}
                          step={100}
                          onChange={this.handleSlider2Change}
                      />
                       <div style={{textAlign:'center'}}><span>{this.state.bandRange[0]} Mbps</span> to <span>{this.state.bandRange[1]} Mbps</span></div>
                        </Col>
                        <Col md={8}> <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
    </MuiPickersUtilsProvider></Col>
                       
                      </Row>
                  </Jumbotron>
                  <br />

                 {data.map((item,index)=>{
                    return(
                    <Card key={index} style={{marginBottom:'5px',boxShadow:'1px 1px 1px 1px #dadada',
                                            borderRadius:'10px'}}>
                    <Link to="/ProviderConfig" className="navbar-brand" style={{ color: 'black' }}>                       
                    <Row>
                        <Col md={2} className="custImg">
                        
                        <CardImg right src={item.img} alt="Traffic distribution" style={{paddingLeft:'10px',paddingTop:'10px'}}/>  
                        </Col>
                        <Col md={5}>
                        <CardTitle style={{paddingLeft:'15px',paddingTop:'20px'}}>
                        {item.company}</CardTitle>
                        </Col>
                        <Col md={2}>
                        <CardTitle style={{paddingLeft:'15px',paddingTop:'10px'}}></CardTitle>
                        </Col>
                        <Col md={3} style={{paddingLeft:'15px',paddingTop:'10px'}}>
                        <CardTitle style={{marginBottom:'0px'}}>Excellent&nbsp;<Badge href="#" color="secondary">{item.rating}</Badge></CardTitle>
                        <small>{item.reviews}+ Reviews</small>
                        </Col>
                    </Row>
                    <CardBody style={{padding:'0.5rem'}}>
                    
                    <CardText>
                        <Row>
                            <Col md={9}>
                            <Row>
                              <Col md={3}>
                              <CardSubtitle style={{paddingLeft:'10px'}}>Bandwidth :98%</CardSubtitle>
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
                                <p style={{marginBottom:'0px'}}>{item.price}</p>
                                <small>+$ 137 taxes and charges</small>
                            </Col>
                        </Row></CardText>
                    
                    </CardBody>
                    </Link>
                    </Card>
               
                    )
                })} 
                 </Col>
                </Row>
          </div>
          
        )
    }
}

export default ServiceProcurement;
