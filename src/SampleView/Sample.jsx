/* global*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {update} from '../breadcrumb/breadcrumbActions';
import Card from '../components/Card';

export class Sample extends Component {
  componentDidMount() {
    const {updateBreadcrumb} = this.props;

    updateBreadcrumb([{
      title: 'Home',
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
      <div>
        <div className="detail-container">
          <Card>
            <h1>Gohan Web UI</h1>
            <p>Gohan Web UI is javascript based webui project for Gohan.</p>
            <p><a href="https://github.com/cloudwan/gohan">Gohan Github Page</a></p>
            <p><a href="https://github.com/cloudwan/gohan_webui">Gohan Web UI Github Page</a></p>
          </Card>
        </div>
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
