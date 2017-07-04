import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  PopoverInteractionKind,
  Position
} from '@blueprintjs/core';

export default class Navbar extends Component {

  handleMenuButtonClick = () => {
    this.props.onToggleSidebar();
  };

  handleTenantClick = tenantId => {
    this.props.onRequestChangeTenant(tenantId);
  };

  render() {
    const iconMenuMode = this.props.openSidebar ? 'closed' : 'open';
    let popoverContent = (
      <Menu>
        {this.props.tenants.map(item => (
          <MenuItem key={item.id} text={item.name}
            onClick={() => this.handleTenantClick(item.name)}
          />
        ))}
      </Menu>
    );

    return (
      <nav className="pt-navbar pt-fixed-top">
        <div className="pt-navbar-group pt-align-left">
          <Button className={`pt-button pt-minimal pt-icon-menu-${iconMenuMode}`}
            onClick={this.handleMenuButtonClick}>
            Gohan WebUI
          </Button>
        </div>

        <div className="pt-navbar-group pt-align-right">
          <Popover content={popoverContent} interactionKind={PopoverInteractionKind.CLICK}
            position={Position.BOTTOM} useSmartPositioning={false}>
            <Button className="pt-button pt-minimal pt-icon-projects" rightIconName="caret-down">
              {this.props.activeTenant}
            </Button>
          </Popover>
          <Button className="pt-button pt-minimal pt-icon-user">
            {this.props.userName}
          </Button>
          <span className="pt-navbar-divider"/>
          <Button className="pt-button pt-minimal pt-icon-log-out" onClick={this.props.onRequestLogout}/>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  tenants: PropTypes.array.isRequired,
  activeTenant: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  onRequestLogout: PropTypes.func.isRequired,
  onRequestChangeTenant: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func,
  openSidebar: PropTypes.bool
};
