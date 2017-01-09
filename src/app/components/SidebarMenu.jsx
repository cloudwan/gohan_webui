import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem} from '@blueprintjs/core';

export default class SidebarMenu extends Component {
  render() {
    const sidebarMenuItems = [];

    if (this.props.schemaReducer !== undefined) {
      this.props.schemaReducer.data.forEach((item, index) => {
        if (!item.parent && item.metadata.type !== 'metaschema') {
          sidebarMenuItems.push(
            <MenuItem item={item}
              key={index}
              text={item.title}
              href={'#/' + item.plural}
              className="item"
            />
          );
        }
      });
    }

    return (
      <Menu className="pt-menu pt-large pt-elevation-2 pt-fixed-top sidebar">
        {sidebarMenuItems}
      </Menu>
    );
  }
}

SidebarMenu.propTypes = {
  schemaReducer: PropTypes.object
};

