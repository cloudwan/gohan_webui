import React, {Component, PropTypes} from 'react';
import {Drawer, FontIcon, Divider} from 'material-ui';
import {Link} from 'react-router';
import SidebarMenuItem from '../components/SidebarMenuItem';

const iconStyles = {
  marginRight: 24
};
const drawerStyles = {
  width: 280
};
export default class SidebarMenu extends Component {
  render() {
    const {children} = this.props;
    const sidebarMenuItems = [];

    if (this.props.schemaReducer !== undefined) {
      this.props.schemaReducer.forEach((item, index) => {
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
      <div>
        <Drawer width={drawerStyles.width}>
          <div>
            <Link to={''}>
              <h2>Gohan icon place</h2>
            </Link>
          </div>
          <div>
            <FontIcon className="material-icons" style={iconStyles}>home icon</FontIcon>
          </div>
          <Divider/>
          {sidebarMenuItems}
        </Drawer>
        {children}
      </div>
    );
  }
}

SidebarMenu.propTypes = {
  schemaReducer: PropTypes.array
};

