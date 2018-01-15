/* global*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {update} from '../breadcrumb/breadcrumbActions';

export class NotFound extends Component {
  componentDidMount() {
    const {updateBreadcrumb} = this.props;

    updateBreadcrumb([{
      title: 'Page not found',
    }]);
  }

  render() {
    return (
      <div className="pt-card pt-elevation-3">
        <h2>Occurred, a 404 error has...</h2>
        <p>Lost a page i have. How embarrassing...</p>
      </div>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  NotFound.propTypes = {
    updateBreadcrumb: PropTypes.func,
  };
}

export default connect(null, {
  updateBreadcrumb: update,
})(NotFound);
