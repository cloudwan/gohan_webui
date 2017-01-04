import React, {Component, PropTypes} from 'react';
import {Breadcrumb} from '@blueprintjs/core';

class BreadcrumbComponent extends Component {
  render() {
    const crumbs = this.props.breadcrumbs.map((item, index, array) => {
      const optionalClass = index === array.length - 1 ? 'pt-breadcrumb-current' : '';

      return <li key={index}><Breadcrumb className={optionalClass} text={item}/></li>;
    });
    return (
      <ul className="pt-breadcrumbs">
        <li>
          <Breadcrumb className={'pt-breadcrumbs-collapsed'} href="#"/>
        </li>
        {crumbs}
      </ul>
    );
  }
}

BreadcrumbComponent.propTypes = {
  breadcrumbs: PropTypes.array.isRequired
};

export default BreadcrumbComponent;
