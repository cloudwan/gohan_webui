import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {logout, selectTenant, changeTenantFilter} from './../../../auth/AuthActions';
import {isTenantFilterActive} from './../../../auth/AuthSelectors';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle, faBars} from '@fortawesome/fontawesome-free-solid';

import {
  getUserName,
  getTenantName,
  getTenants,
} from './../../../auth/AuthSelectors';

import NavContainer from './components/NavContainer';
import NavbarGroup from './components/NavbarGroup';
import TenantMenuItem from './components/TenantMenuItem';
import Breadcrumb from '../../../breadcrumb/Breadcrumb';

import {
  Menu,
  MenuItem,
  MenuDivider,
  Button
} from '@blueprintjs/core';

import {Popover2} from '@blueprintjs/labs';

export class Navbar extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  handleMenuButtonClick = () => {
    this.props.onToggleSidebar();
  };

  handleLogoutClick = () => {
    this.props.logout();
  };

  handleChangeTenantClick = (tenantName, tenantId) => {
    this.props.selectTenant(tenantName, tenantId);
  };

  handleFilterByTenantClick = () => {
    this.props.changeTenantFilter(!this.props.isTenantFilter);
  };

  render() {
    const {
      tenants,
      tenant,
      userName,
      brand,
    } = this.props;

    return (
      <NavContainer>
        <NavbarGroup isRight={false}>
          <Button className="pt-minimal"
            onClick={this.handleMenuButtonClick}>
            <FontAwesomeIcon className="faicon-menu" icon={faBars} />
          </Button>
          <a href="#/" className="brand-link">{brand}</a>
          <Breadcrumb />
        </NavbarGroup>
        <NavbarGroup isRight={true}>
          <Popover2 content={
            <Menu>
              {tenants.map(item => (
                <TenantMenuItem key={item.id}
                  id={item.id}
                  text={item.name}
                  onClick={this.handleChangeTenantClick}
                />
              ))}
              <MenuDivider title={'View Options'}/>
              <MenuItem text={'Filter by tenant'}
                {...{iconName: this.props.isTenantFilter ? 'small-tick' : undefined}}
                onClick={this.handleFilterByTenantClick}
              />
            </Menu>
          } placement="bottom-end"
            minimal={true}
            inheritDarkTheme={false}>
            <Button type="button" rightIconName="caret-down"
              className="pt-minimal tenant">
              Tenant: {tenant}
            </Button>
          </Popover2>

          <Popover2 content={
            <Menu>
              <MenuItem text={'Log Out'}
                onClick={this.handleLogoutClick}
              />
            </Menu>
          }
            placement="bottom-end"
            minimal={true}
            inheritDarkTheme={false}>
            <Button type="button" rightIconName="caret-down"
              className="pt-minimal user">
              <FontAwesomeIcon className="faicon" icon={faUserCircle} />{userName}
            </Button>
          </Popover2>
        </NavbarGroup>
      </NavContainer>
    );
  }
}

Navbar.defaultProps = {
  tenants: [],
  onToggleSidebar: () => {},
  isSidebarOpen: false,
  brand: <span className="brand-title pt-button pt-minimal">Gohan Web UI</span>
};

if (process.env.NODE_ENV !== 'production') {
  Navbar.propTypes = {
    userName: PropTypes.string.isRequired,
    tenant: PropTypes.string.isRequired,
    isTenantFilter: PropTypes.bool.isRequired,
    tenants: PropTypes.array,
    onToggleSidebar: PropTypes.func,
    isSidebarOpen: PropTypes.bool,
    brand: PropTypes.node.isRequired
  };
}


export const mapStateToProps = state => ({
  userName: getUserName(state),
  tenant: getTenantName(state),
  tenants: getTenants(state),
  isTenantFilter: isTenantFilterActive(state)
});

export default connect(mapStateToProps, {
  logout,
  selectTenant,
  changeTenantFilter
})(Navbar);
