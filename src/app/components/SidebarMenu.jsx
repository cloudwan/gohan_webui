import React, {Component, PropTypes} from 'react';
import {AppBar, Drawer, Menu} from 'material-ui';
import SidebarMenuItem from '../components/SidebarMenuItem';

const drawerStyles = {
  width: 260,
  float: 'left'
};

export default class SidebarMenu extends Component {
  onLeftIconButtonTouchTap = () => {
    this.props.onRequestChange(false);
  };

  render() {
    const sidebarMenuItems = [];

    if (this.props.schemaReducer !== undefined) {
      this.props.schemaReducer.data.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          sidebarMenuItems.push(
            <SidebarMenuItem item={item}
              key={index}
            />
          );
        }
      });
    }

    return (
      <Drawer style={drawerStyles} open={this.props.open}
        containerStyle={{overflowX: 'hidden'}}>
        <AppBar title="Gohan webui" onLeftIconButtonTouchTap={this.onLeftIconButtonTouchTap} />
        <Menu>
          {sidebarMenuItems}
        </Menu>
      </Drawer>
    );
  }
}

SidebarMenu.propTypes = {
  schemaReducer: PropTypes.object
};

