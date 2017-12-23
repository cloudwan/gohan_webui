/* global*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {update} from '../breadcrumb/breadcrumbActions';
import Card from '../components/Card';

export class NotFound extends Component {
  componentDidMount() {
    const {updateBreadcrumb} = this.props;

    updateBreadcrumb([{
      title: 'Page not found',
    }]);
  }

  render() {
    return (
      <div className="detail-container">
        <Card>
          <h2>We can't seem to find the page you're looking for...</h2>
          <a href="#/">Go to Top Page</a>
        </Card>
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
