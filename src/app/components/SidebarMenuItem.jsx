import React, {Component} from 'react';
import {Link} from 'react-router';

export default class SidebarMenuItem extends Component {
  render() {
    const {title, url} = this.props;

    return (
      <li>
        <Link to={url}>{title}</Link>
      </li>
    );
  }
}
