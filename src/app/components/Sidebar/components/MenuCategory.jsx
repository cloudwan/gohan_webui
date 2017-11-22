import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MenuCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
    };
  }

  handleCategoryToggle = () => this.setState(prevState => ({
    isOpen: !prevState.isOpen
  }))

  render() {
    const {
      children,
      title,
      collapsible,
      className,
    } = this.props;

    const {
      isOpen,
    } = this.state;

    return (
      <div className={`menu-category${(className === '') ? '' : ` ${className}`}`}>
        <li className={`pt-menu-header menu-category-header${collapsible ? ' menu-category-header-collapsible' : ''}`}
          onClick={this.handleCategoryToggle}>
          <h6>{title}</h6>
          {collapsible && <span className={`pt-icon-standard pt-icon-chevron-${isOpen ? 'up' : 'down'}`}/>}
        </li>
        <div>
          {isOpen && children}
        </div>
      </div>
    );
  }
}

export default MenuCategory;

MenuCategory.defaultProps = {
  collapsible: true,
  className: '',
};

if (process.env.NODE_ENV !== 'production') {
  MenuCategory.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    collapsible: PropTypes.bool,
    className: PropTypes.string,
  };
}
