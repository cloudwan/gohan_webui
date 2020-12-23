import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';
import {logout, selectTenant, changeTenantFilter} from './../../../auth/AuthActions';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {faUserCircle, faBars, faCheckSquare, faSquare} from '@fortawesome/fontawesome-free-solid';

import {
  getUserName,
  getTenantName,
  getTenantId,
  isUserAdmin,
  getTenantsByDomain,
  isTenantFilterActive,
} from './../../../auth/AuthSelectors';
import {
  setSubstringSearchEnabled
} from './../../../config/ConfigActions';

import {
  getUseKeystoneDomainState,
  isSubstringSearchEnabled
} from '../../../config/ConfigSelectors';

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
    if (this.props.useDomain && this.props.isAdmin) {
      this.props.changeTenantFilter(tenantId !== 'all');
    }

    this.props.selectTenant({
      id: tenantId,
      name: tenantName,
    });
  };

  handleFilterByTenantClick = () => {
    this.props.changeTenantFilter(!this.props.isTenantFilter);
  };

  handleSubstringSearchEnabledClick = () => {
    this.props.setSubstringSearchEnabled(!this.props.substringSearchEnabled);
  };

  renderMenuItems = () => {
    const {tenantId, tenantsByDomain, isAdmin, isTenantFilter, useDomain} = this.props;
    const domainsIds = Object.keys(tenantsByDomain);
    const initialValue = isAdmin && useDomain ? [
      <TenantMenuItem key="all"
        id="all"
        text="All"
        onClick={this.handleChangeTenantClick}
        iconName={tenantId.toLowerCase() === 'all' ? 'pt-icon-small-tick' : undefined}
      />
    ] : [];

    return domainsIds.reduce((result, domainId, index) => {
      if (useDomain && (isAdmin || index > 0)) {
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

      const tenantsCount = domainsIds.reduce((result, id) => result + tenantsByDomain[id].tenants.length, 0);

      if (!useDomain && tenantsCount > 1) {
        result.push(
          <MenuDivider key="view-options" title={'View Options'}/>
        );
        result.push(
          <MenuItem key="tenant-filter"
            onClick={this.handleFilterByTenantClick}
            text={(
              <span>
                <FontAwesomeIcon className={`faicon tenant-filter${isTenantFilter ? ' checked' : ''}`}
                  icon={isTenantFilter ? faCheckSquare : faSquare}
                />Filter by Tenant
              </span>
            )}
          />
        );
      }

      return result;
    }, initialValue);
  }

  render() {
    const {
      tenantName,
      userName,
      brand,
      substringSearchEnabled
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
            <Menu className="tenant-menu">
              {this.renderMenuItems()}
            </Menu>
          } placement="bottom-end"
            minimal={true}
            inheritDarkTheme={false}>
            <Button type="button" rightIconName="caret-down"
              className="pt-minimal tenant">
              Tenant: {tenantName}
            </Button>
          </Popover2>

          <Popover2 content={
            <Menu>
              <MenuItem onClick={this.handleSubstringSearchEnabledClick}
                text={(
                  <span>
                    <FontAwesomeIcon className={`faicon tenant-filter${substringSearchEnabled ? ' checked' : ''}`}
                      icon={substringSearchEnabled ? faCheckSquare : faSquare}
                    />Substring search
                  </span>
                )}
              />
              <MenuDivider/>
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
    brand: PropTypes.node.isRequired,
    substringSearchEnabled: PropTypes.bool.isRequired,
    setSubstringSearchEnabled: PropTypes.func
  };
}


export const mapStateToProps = state => ({
  userName: getUserName(state),
  tenantName: getTenantName(state),
  tenantId: getTenantId(state),
  tenantsByDomain: getTenantsByDomain(state),
  isAdmin: isUserAdmin(state),
  isTenantFilter: isTenantFilterActive(state),
  useDomain: getUseKeystoneDomainState(state),
  substringSearchEnabled: isSubstringSearchEnabled(state)
});

export default connect(mapStateToProps, {
  logout,
  selectTenant,
  changeTenantFilter,
  setSubstringSearchEnabled
})(Navbar);
