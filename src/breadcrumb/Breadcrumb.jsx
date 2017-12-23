import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Breadcrumb as BlueprintBreadcrumb} from '@blueprintjs/core';
import {getBreadcrumbContent} from './breadcrumbSelectors';

class Breadcrumb extends Component {
  static defaultProps = {
    elements: [],
  };

  render() {
    const {
      elements,
    } = this.props;

    return (
      <ul className="pt-breadcrumbs">
        {
          elements.map((element, index) => {
            const breadcrumbClassName = (index === elements.length - 1) ?
              'pt-button pt-minimal current' : 'pt-button pt-minimal';

            return (
              <li key={`breadcrumb-${index}`}>
                <BlueprintBreadcrumb className={breadcrumbClassName}
                  text={element.title}
                  href={`#${element.url}`}
                  disabled={!element.url}
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
  };
}

export const mapStateToProps = state => ({
  elements: getBreadcrumbContent(state),
});


export default connect(mapStateToProps, {})(Breadcrumb);
