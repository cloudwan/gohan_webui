import React, {Component} from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';

import {getSidebarCategories} from './SidebarSelectors';
import {getPathname} from '../../../location/LocationSelectors';

import Container from './components/Container';
import Search from './components/Search';
import Menu from './components/Menu';
import MenuItem from './components/MenuItem';
import MenuCategory from './components/MenuCategory';

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
      open = true,
      categories,
      pathname
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
            (categories && categories.length > 0) && categories.map((category, categoryIndex) => {
              const filteredItems = category.items.filter(item => searchRegExp.test(item.title));

              return (filteredItems.length > 0) && (
                <MenuCategory key={`${category.title}-${categoryIndex}`}
                  title={category.title}
                  items={filteredItems}>
                  {
                    filteredItems.map((item, index) => (
                      <MenuItem key={`${item.title}-${index}`}
                        text={item.title}
                        href={item.path}
                        isActive={item.path.replace('#', '') === pathname}
                      />
                    ))
                  }
                </MenuCategory>
              );
            })
          }
        </Menu>
      </Container>
    );
  }
}

export const mapStateToProps = state => ({
  categories: getSidebarCategories(state),
  pathname: getPathname(state),
});

Sidebar.defaultProps = {
  pathname: '',
  categories: [],
  open: false,
};

if (process.env.NODE_ENV !== 'production') {
  Sidebar.propTypes = {
    open: PropTypes.bool,
    categories: PropTypes.array,
    pathname: PropTypes.string.isRequired,
  };
}

export default connect(mapStateToProps, {})(Sidebar);
