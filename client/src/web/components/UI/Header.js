import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  Navbar,
  Collapse,
  DropdownMenu,
  DropdownItem,
  NavbarToggler,Input,InputGroupText,
  DropdownToggle,InputGroup,InputGroupAddon,
  UncontrolledDropdown,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import Config from '../../../constants/config';
import { SidebarNavItems } from './Sidebar';

class Header extends Component {
  static propTypes = {
    member: PropTypes.shape({
      firstName: PropTypes.string,
      email: PropTypes.string,
    }),
    logout: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    member: {},
  }

  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = { isOpen: false };
  }

  onLogout = () => {
    const { logout, history } = this.props;
    logout().then(() => history.push('/login'));
  }

  toggleDropDown = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  render() {
    const { member } = this.props;
    const { isOpen } = this.state;
    const loggedIn = !!(member && member.email);

    return (
      <header>
        <Navbar dark color="dark" expand="sm" className="fixed-top">
          <Link to="/" className="navbar-brand" style={{ color: '#f9f5f5' }}>
            <img src="../../../assets/images/espacelogo.svg" style={{width:50, marginTop: -7}} />&nbsp;espace
          </Link>
          <InputGroup style={{width:'40%',paddingLeft:'60px'}}>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText><i className="icon-magnifier" /></InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="" />
                    </InputGroup>
          <NavbarToggler onClick={this.toggleDropDown} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" color="black" navbar>
              <div className="d-block d-sm-none">
                <SidebarNavItems></SidebarNavItems>
              </div>
              <Link to="/" className="navbar-brand" style={{ color: 'black' }}>
                <img src="../../../assets/images/mail.svg" style={{width:25}} />
              </Link>
              <Link to="/" className="navbar-brand" style={{ color: 'black' }}>
                <img src="../../../assets/images/settings.svg" style={{width:25}} />
              </Link>
              <Link to="/" className="navbar-brand" style={{ color: 'black' }}>
                <img src="../../../assets/images/notification.svg" style={{width:22}} />
              </Link>
              <UncontrolledDropdown nav color="black">
                <DropdownToggle nav caret >
                  {loggedIn ? `Hi, ${member.firstName}` : 'My Account'}
                </DropdownToggle>
                <DropdownMenu>
                  {!loggedIn
                    && (
                    <div color="black">
                      <DropdownItem tag={Link} to="/login">
                          Login
                      </DropdownItem>
                      <DropdownItem tag={Link} to="/sign-up">
                        Sign Up
                      </DropdownItem>
                    </div>
                    )
                  }
                  {loggedIn
                    && (
                    <div>
                      <DropdownItem tag={Link} to="/update-profile">
                        Update Profile
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem tag="button" onClick={this.onLogout}>
                        Logout
                      </DropdownItem>
                    </div>
                    )
                  }
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}

export default withRouter(Header);
