import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Breadcrumb as BlueprintBreadcrumb} from '@blueprintjs/core';

import {getBreadcrumbContent} from './breadcrumbSelectors';

import styles from './styles.css';

class Breadcrumb extends Component {
  static defaultProps = {
    elements: [],
    className: '',
  };

  render() {
    const {
      className,
      elements,
    } = this.props;

    return (
      <ul className={`${styles.breadcrumbs} ${className ? ` ${className}` : ''}`}>
        {
          elements.map((element, index) => {
            const breadcrumbClassName = styles[(index === elements.length - 1) ? 'breadcrumbCurrent' : 'breadcrumb'];

            return (
              <li key={`breadcrumb-${index}`}>
                <BlueprintBreadcrumb className={breadcrumbClassName}
                  text={element.title}
                  href={`#${element.url}`}
                />
              </li>
            );
          })
        }
      </ul>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  Breadcrumb.propTypes = {
    elements: PropTypes.array,
    className: PropTypes.string,
  };
}

export const mapStateToProps = state => ({
  elements: getBreadcrumbContent(state),
});


export default connect(mapStateToProps, {})(Breadcrumb);
