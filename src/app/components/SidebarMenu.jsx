import React, {Component, PropTypes} from 'react';
import {Menu, MenuItem} from '@blueprintjs/core';

export default class SidebarMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: ''
    };
  }

  handleSearchChange = event => {
    const searchQuery = event.target.value.replace(/[\(\)\[\]]/g, '\\$&');

    this.setState({searchQuery});
  };

  buildMenuItems() {
    if (this.props.menuItems !== undefined) {
      const {menuItems} = this.props;
      const {searchQuery} = this.state;
      const searchQueryRE = new RegExp(searchQuery, 'i');
      const filteredMenuItems = [];

      menuItems.forEach((item) => {
        if (searchQuery === '' || searchQueryRE.test(item.title)) {
          filteredMenuItems.push(
            <MenuItem key={item.index}
              text={item.title}
              href={item.path}
              className="item"
            />
          );
        }
      });

      return filteredMenuItems;
    }
  }

  render() {
    const sidebarOpenClass = this.props.open ? '' : 'sidebar-hidden';

    return (
      <div className={`pt-elevation-2 pt-fixed-top sidebar ${sidebarOpenClass}`}>
        <div className="sidebar-search">
          <label className="pt-label">
            <input type="text" className="pt-input"
              placeholder="Search" onChange={this.handleSearchChange}
            />
          </label>
        </div>
        <Menu className="pt-menu pt-large">
          {this.buildMenuItems()}
        </Menu>
      </div>
    );
  }
}

SidebarMenu.propTypes = {
  menuItems: PropTypes.array,
  open: PropTypes.bool
};
