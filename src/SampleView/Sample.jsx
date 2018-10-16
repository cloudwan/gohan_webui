/* global*/
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {fetchAppVersion} from '../config/ConfigActions';
import {getCoreVersion, getAppVersion} from '../config/ConfigSelectors';

import {update} from '../breadcrumb/breadcrumbActions';
import Card from '../components/Card';

export class Sample extends Component {
  componentDidMount() {
    const {updateBreadcrumb} = this.props;

    this.props.fetchAppVersion();

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
            <p className="version inline">Gohan Core Version: {this.props.coreVersion}</p>
            <p className="version inline">App Version: {this.props.appVersion}</p>
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
    fetchAppVersion: PropTypes.func,
    appVersion: PropTypes.string,
    coreVersion: PropTypes.string
  };
}
export default connect(state => ({
  coreVersion: getCoreVersion(state),
  appVersion: getAppVersion(state)
}), {
  updateBreadcrumb: update,
  fetchAppVersion
})(Sample);
