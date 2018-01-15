/* global*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {update} from '../breadcrumb/breadcrumbActions';

export class Sample extends Component {
  componentDidMount() {
    const {updateBreadcrumb} = this.props;

    updateBreadcrumb([{
      title: 'Sample',
      url: '/',
    }]);
  }

  static onEnter() {
    console.log('onEnter');
  }

  static onLeave() {
    console.log('onLeave');
  }

  render() {
    return (
      <div className="sample-view">
        <h2>Sample Gohan webUI Component.</h2>
      </div>
    );
  }
}

Sample.contextTypes = {
};

if (process.env.NODE_ENV !== 'production') {
  Sample.propTypes = {
    updateBreadcrumb: PropTypes.func,
  };
}

export default connect(null, {
  updateBreadcrumb: update,
})(Sample);
