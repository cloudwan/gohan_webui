import React, {Component} from 'react';

export default class SidebarMenu extends Component {
  render() {
    const {children} = this.props;

    return (
      <ul>
        {children}
      </ul>
    );
  }
}
