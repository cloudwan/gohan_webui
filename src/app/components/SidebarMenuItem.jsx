import React, {Component} from 'react';
import {Link} from 'react-router';
import {MenuItem} from 'material-ui';

const linkStyles = {
  textDecoration: 'none',
  color: 'black'
};

export default class SidebarMenuItem extends Component {
  render() {
    const {item} = this.props;

    return (
      <Link to={'/' + item.plural}
        style={linkStyles}>
        <MenuItem primaryText={item.title} />
      </Link>
    );
  }
}
