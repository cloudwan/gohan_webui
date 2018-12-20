import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {logout, selectTenant, changeTenantFilter} from './../../../auth/AuthActions';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle, faBars} from '@fortawesome/fontawesome-free-solid';

import {
  getUserName,
  getTenantName,
  getTenantId,
  isUserAdmin,
  getTenantsByDomain,
  isTenantFilterActive,
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
    this.props.changeTenantFilter(tenantId !== 'all');

    if (tenantId === 'all') {
      this.props.selectTenant();
    } else {
      this.props.selectTenant({
        id: tenantId,
        name: tenantName,
      });
    }
  };

  renderMenuItems = () => {
    const {tenantId, tenantsByDomain, isAdmin} = this.props;

    const initialValue = isAdmin ? [
      <TenantMenuItem key="all"
        id="all"
        text="All"
        onClick={this.handleChangeTenantClick}
        iconName={(!this.props.isTenantFilter && this.props.isAdmin) ? 'pt-icon-small-tick' : undefined}
      />
    ] : [];

    return Object.keys(tenantsByDomain).reduce((result, domainId, index) => {
      if (isAdmin || index > 0) {
        result.push(<MenuDivider key={domainId} title={tenantsByDomain[domainId].name}/>);
      }

      tenantsByDomain[domainId].tenants.forEach(item => {
        const isSelected = tenantId.toLowerCase() === item.id.toLowerCase();
        result.push(
          <TenantMenuItem key={item.id}
            id={item.id}
            text={item.name}
            onClick={this.handleChangeTenantClick}
            iconName={isSelected ? 'pt-icon-small-tick' : undefined}
          />
        );
      });

      return result;
    }, initialValue);
  }

  render() {
    const {
      tenantName,
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
              {this.renderMenuItems()}
            </Menu>
          } placement="bottom-end"
            minimal={true}
            inheritDarkTheme={false}>
            <Button type="button" rightIconName="caret-down"
              className="pt-minimal tenant">
              Tenant: {tenantName || 'All'}
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
  tenantsByDomain: {},
  onToggleSidebar: () => {},
  isSidebarOpen: false,
  brand: <span className="brand-title pt-button pt-minimal">Gohan Web UI</span>
};

if (process.env.NODE_ENV !== 'production') {
  Navbar.propTypes = {
    userName: PropTypes.string.isRequired,
    tenantName: PropTypes.string.isRequired,
    tenantId: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    tenantsByDomain: PropTypes.object,
    onToggleSidebar: PropTypes.func,
    isSidebarOpen: PropTypes.bool,
    brand: PropTypes.node.isRequired
  };
}


export const mapStateToProps = state => ({
  userName: getUserName(state),
  tenantName: getTenantName(state),
  tenantId: getTenantId(state),
  tenantsByDomain: getTenantsByDomain(state),
  isAdmin: isUserAdmin(state),
  isTenantFilter: isTenantFilterActive(state),
});

export default connect(mapStateToProps, {
  logout,
  selectTenant,
  changeTenantFilter
})(Navbar);
