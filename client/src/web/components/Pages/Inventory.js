import React from 'react';
import { Card, CardImg, CardText, CardBody,Row,Col,
    CardTitle, CardSubtitle, Button,Jumbotron,Badge,
    ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

import { Link } from 'react-router-dom';

class Inventory extends React.Component {
    render() {
        return (
            <div>
              <Jumbotron>
                <Row style={{backgroundColor: '#fafafa',margin:'5px'}}>
                  <Col md={6}>
                    <h1 className="display-3 inventoryHead">Inventory</h1>
                  </Col>
                  <Col md={6}>
                    <Button outline color="secondary inventoryBtn"><i class="icon-refresh"></i></Button>{' '}
                  </Col>
                </Row>
        
                <Row>
                  <Col><p className="lead">The following resources are currently in use on the vessal</p></Col>
                  
                </Row>
                <Row>
                  <Col md={6}>
                  
                  <ListGroup className='cstListGrp'>
                    <ListGroupItem>
                      <ListGroupItemHeading ><Link to="/antennas" className="navbar-brand" style={{padding:'25px',color:'#6083c8',fontSize:'25px'}}> Antennas</Link>
                      <Badge className="cstBadge">2</Badge></ListGroupItemHeading>
                    </ListGroupItem>
                  </ListGroup>
                  </Col>
                  <Col md={6}>
                  <ListGroup className='cstListGrp'>
                    <ListGroupItem>
                      <ListGroupItemHeading ><Link to="/modems" className="navbar-brand" style={{padding:'25px',color:'#6083c8',fontSize:'25px'}}>Modems</Link>
                      <Badge className="cstBadge">5</Badge></ListGroupItemHeading>
                    </ListGroupItem>
                  </ListGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                  
                  <ListGroup className='cstListGrp'>
                    <ListGroupItem>
                      <ListGroupItemHeading ><Link to="/antennas" className="navbar-brand" style={{padding:'25px',color:'#6083c8',fontSize:'25px'}}> Arbitrators</Link>
                      <Badge className="cstBadge">2</Badge></ListGroupItemHeading>
                    </ListGroupItem>
                  </ListGroup>
                  </Col>
                  <Col md={6}>
                  <ListGroup className='cstListGrp'>
                    <ListGroupItem>
                      <ListGroupItemHeading ><Link to="/modems" className="navbar-brand" style={{padding:'25px',color:'#6083c8',fontSize:'25px'}}>Spectrum Analyzers</Link>
                      <Badge className="cstBadge">4</Badge>
                      </ListGroupItemHeading>
                    </ListGroupItem>
                  </ListGroup>
                  </Col>
                </Row>
            </Jumbotron>
          </div>
        )
    }
}

export default Inventory;
