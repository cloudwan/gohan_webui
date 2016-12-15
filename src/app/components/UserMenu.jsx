import React, {Component, PropTypes} from 'react';
import {Drawer, Divider, FontIcon, Menu, MenuItem, DropDownMenu} from 'material-ui';

const drawerStyles = {
  width: 200,
};
const iconStyles = {
  fontSize: 50
};

export default class UserMenu extends Component {
  render() {
    return (
      <Drawer style={drawerStyles} openSecondary={true}
        open={this.props.open} docked={false}
        onRequestChange={this.props.onRequestChange} containerStyle={{overflowX: 'hidden'}}>
        <div style={{margin: 16}}>
          <FontIcon className="material-icons" style={iconStyles}>account_circle</FontIcon>
          <div style={{fontSize: 14, fontWeight: 'bolder'}}>{this.props.user.username}</div>
        </div>
        <Divider />
        <DropDownMenu value={this.props.tenant.id} autoWidth={false}
          style={{width: '100%', marginLeft: -8}}>
          {(() => {
            if (this.props.tenants) {
              return this.props.tenants.map((tenant, key) => (
                <MenuItem key={key} value={tenant.id}
                  primaryText={`Tenant: ${tenant.name}`}
                />
              ));
            }
          })()}
        </DropDownMenu>
        <Menu>
          {(() => {
            if (this.props.onRequestLogout) {
              return (
                <MenuItem onTouchTap={this.props.onRequestLogout}>Log out</MenuItem>
              );
            }
          })()}
        </Menu>
      </Drawer>
    );
  }
}

UserMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestChange: PropTypes.func.isRequired,
  onRequestLogout: PropTypes.func
};
