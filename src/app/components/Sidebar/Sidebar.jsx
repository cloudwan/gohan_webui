import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEqual from 'lodash/isEqual';


import {getSidebarItems} from './SidebarSelectors';
import {getPathname} from './../../../location/LocationSelectors';

import Container from './components/Container';
import Search from './components/Search';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';

export class Sidebar extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

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

  render() {
    const {
      menuItems,
      pathname,
      open,
    } = this.props;
    const {
      searchQuery,
    } = this.state;
    const searchRegExp = new RegExp(searchQuery, 'i');

    return (
      <Container isOpen={open}>
        <Search value={searchQuery}
          onChange={this.handleSearchChange}
        />
        <Menu>
          {
            menuItems
              .filter(item => searchRegExp.test(item.title))
              .map((item, index) => (
                <MenuItem key={index}
                  text={item.title}
                  href={item.path}
                  isActive={item.path.replace('#', '') === pathname}
                />
              ))
          }
        </Menu>
      </Container>
    );
  }
}

Sidebar.defaultProps = {
  pathname: '',
  menuItems: [],
  open: false,
};

if (process.env.NODE_ENV !== 'production') {
  Sidebar.propTypes = {
    pathname: PropTypes.string,
    menuItems: PropTypes.array,
    open: PropTypes.bool
  };
}

export const mapStateToProps = state => ({
  pathname: getPathname(state),
  menuItems: getSidebarItems(state),
});

export default connect(mapStateToProps, {})(Sidebar);
