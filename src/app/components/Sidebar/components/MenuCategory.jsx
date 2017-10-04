import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './menuCategory.css';

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
    } = this.props;

    const {
      isOpen,
    } = this.state;

    return (
      <div>
        <li className={`${styles.header} ${collapsible ? styles.collapsible : ''}`}
          onClick={this.handleCategoryToggle}>
          <h6>{title}</h6>
          {collapsible && <span className={styles[isOpen ? 'collapseIconOpen' : 'collapseIconClosed']}/>}
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
  };
}
