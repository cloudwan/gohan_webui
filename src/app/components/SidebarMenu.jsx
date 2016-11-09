import React, {Component, PropTypes} from 'react';
import {AppBar, Drawer, Menu} from 'material-ui';
import SidebarMenuItem from '../components/SidebarMenuItem';

const drawerStyles = {
  width: 260,
  float: 'left'
};

export default class SidebarMenu extends Component {
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
      <Drawer style={drawerStyles}>
        <AppBar title="Gohan webui" />
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

