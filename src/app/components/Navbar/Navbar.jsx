import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {logout, selectTenant} from './../../../auth/AuthActions';
import {
  getUserName,
  getTenantName,
  getTenants,
} from './../../../auth/AuthSelectors';

import Button from '../../../components/Button';
import NavContainer from './components/NavContainer';
import NavbarGroup from './components/NavbarGroup';
import TenantMenuItem from './components/TenantMenuItem';
import Breadcrumb from '../../../breadcrumb/Breadcrumb';

import {
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position
} from '@blueprintjs/core';

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

  render() {
    const {
      tenants,
      tenant,
      userName,
    } = this.props;

    return (
      <NavContainer>
        <NavbarGroup isRight={false}>
          <Button iconName={'menu'}
            isMinimal={true}
            onClick={this.handleMenuButtonClick}
          />
          <span className="navbar-title">Gohan UI</span>
          <Breadcrumb />
        </NavbarGroup>
        <NavbarGroup isRight={true}>
          <Popover content={
            <Menu>
              {tenants.map(item => (
                <TenantMenuItem key={item.id}
                  id={item.id}
                  text={item.name}
                  onClick={this.handleChangeTenantClick}
                />
              ))}
            </Menu>
          } interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM}>
            <Button isMinimal={true}
              iconName={'projects'}
              rightIconName="caret-down"
              text={tenant}
            />
          </Popover>

          <Popover content={
            <Menu>
              <MenuItem text={'Log Out'}
                iconName={'log-out'}
                onClick={this.handleLogoutClick}
              />
            </Menu>
          }
            interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM_RIGHT}>
            <Button isMinimal={true}
              iconName={'user'}
              rightIconName="caret-down"
              text={userName}
            />
          </Popover>
        </NavbarGroup>
      </NavContainer>
    );
  }
}

Navbar.defaultProps = {
  tenants: [],
  onToggleSidebar: () => {},
  isSidebarOpen: false,
};

if (process.env.NODE_ENV !== 'production') {
  Navbar.propTypes = {
    userName: PropTypes.string.isRequired,
    tenant: PropTypes.string.isRequired,
    tenants: PropTypes.array,
    onToggleSidebar: PropTypes.func,
    isSidebarOpen: PropTypes.bool,
  };
}


export const mapStateToProps = state => ({
  userName: getUserName(state),
  tenant: getTenantName(state),
  tenants: getTenants(state),
});

export default connect(mapStateToProps, {
  logout,
  selectTenant,
})(Navbar);
