/* global window */
import React,{ useState }  from 'react';
import { Col, Nav, NavItem, Dropdown, DropdownMenu, DropdownToggle, DropdownItem} from 'reactstrap';
import { Link } from 'react-router-dom';

class SidebarNavItems extends React.Component {

    state={
        dropdownOpen:false,
        dropdown2Open:false,
    }
   toggle = () => this.setState({dropdownOpen:!this.state.dropdownOpen});
   toggle2 = () => this.setState({dropdown2Open:!this.state.dropdown2Open});

    render() {
        return(
    <NavItem>
        <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname === '/' && 'active'}`} to="/">
                <i className="icon-home" />
                {' '}
                <span>Dashboard</span>
            </Link>
        </NavItem>
        <NavItem >
          <a className="nav-link  d-flex" nav onClick={this.toggle.bind(this)}>
          <i className="icon-settings"  onClick={this.props.openSidebar}/>
                {' '}
          <span>Configuration</span>
          {this.state.dropdownOpen && <span className="icon-arrow-up side-arrow align-self-center"></span>}
          { !this.state.dropdownOpen && <span className="icon-arrow-down side-arrow align-self-center"></span>}
          </a>
          {
            this.props.sidebarOpened && this.state.dropdownOpen && (
                <NavItem >
                <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/channel') && 'active'}`} to="/channel">
                        {' '}
                        <span>Channel</span>
                    </Link>
                    <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/appgroup') && 'active'}`} to="/appgroup">
                        {' '}
                        <span>App Group</span>
                    </Link>
                    <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/provider') && 'active'}`} to="/provider">
                        {' '}
                        <span>Provider</span>
                    </Link>
                </NavItem>
            )
          }

        </NavItem>

        {/* <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/data_pricing') && 'active'}`} to="/data_pricing">
                <i className="icon-wallet" />
                {' '}
                <span>Data Pricing</span>
            </Link>
        </NavItem> */}
        {/* <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/trafficdistrib') && 'active'}`} to="/trafficdistrib">
                <i className="icon-directions" />
                {' '}
                <span>Traffic Disrtibution</span>
            </Link>
        </NavItem> */}
        <NavItem>
            <a className="nav-link  d-flex" nav onClick={this.toggle2.bind(this)}>
          <i className="icon-chart"  onClick={this.props.openSidebar}/>
                {' '}
          <span>Reporting</span>
          {this.state.dropdown2Open && <span className="icon-arrow-up side-arrow align-self-center"></span>}
          { !this.state.dropdown2Open && <span className="icon-arrow-down side-arrow align-self-center"></span>}
          </a>
          {
            this.props.sidebarOpened && this.state.dropdown2Open && (
                <NavItem >
                <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/performance') && 'active'}`} to="/performance">
                        {' '}
                        <span>Performance</span>
                    </Link>
                    <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/blockage') && 'active'}`} to="/blockage">
                        {' '}
                        <span>Blockage</span>
                    </Link>
                    <Link style={{paddingLeft:"40px"}} className={`nav-link d-flex ${window.location.pathname.startsWith('/slacredits') && 'active'}`} to="/slacredits">
                        {' '}
                        <span>SLA Credits</span>
                    </Link>
                </NavItem>
            )
          }

        </NavItem>


        <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/procurement') && 'active'}`} to="/procurement">
                <i className="icon-tag" />
                {' '}
                <span>Procurement</span>
            </Link>
        </NavItem>
        <NavItem>
        <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/configurations') && 'active'}`} to="/configurations">
        <i className="icon-rocket" />
                        {' '}
                        <span>DMTS Simulator</span>
                    </Link>
        </NavItem>

        <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/inventory') && 'active'}`} to="/inventory">
                <i className="icon-layers" />
                {' '}
                <span>Inventory</span>
            </Link>
        </NavItem>

        <NavItem>
            <Link className={`nav-link d-flex ${window.location.pathname.startsWith('/eSim') && 'active'}`} to="/eSim">
                <i className="icon-screen-smartphone" />
                {' '}
                <span>eSim</span>
            </Link>
        </NavItem>

      </NavItem>


    )
        }
    }

class Sidebar extends React.Component {
    state={
        collapsed:true
    }
    toggleSidebar = ()=>{
        this.setState({
            collapsed:!this.state.collapsed
        })
    }
    openSidebar = ()=>{
        this.setState({
            collapsed:false
        })
    }
    render() {
        return <div className={this.state.collapsed?"sidebar-toggle":"sidebar-toggle expanded" } style={{position:'relative'}}>
            <div className="" style={{position:'fixed'}}>
                <div>
                    <button role="button" className="sidenav-toggle" aria-expanded="false" onClick={this.toggleSidebar.bind(this)}>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                </div>
                <Nav vertical>
                    <SidebarNavItems sidebarOpened={!this.state.collapsed} openSidebar={this.openSidebar}></SidebarNavItems>
                </Nav>
            </div>
        </div>
    }
}

export { Sidebar, SidebarNavItems };
