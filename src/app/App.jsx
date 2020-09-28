import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FocusStyleManager} from '@blueprintjs/core';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ErrorToaster from './../error/ErrorToaster';
import SuccessToaster from '../SuccessToaster';
import TokenRenewal from './../auth/components/TokenRenewal';
import Footer from '../components/Footer';
import {getIcpNumber} from '../config/ConfigSelectors';

FocusStyleManager.onlyShowFocusOnTabs();

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openUserMenu: false,
      openSidebar: true,
      contentClassNames: ''
    };
  }

  handleToggleSidebar = () => {
    if (this.state.openSidebar) {
      this.setState({
        openSidebar: false,
        contentClassNames: 'sidebar-hidden'
      });
    } else {
      this.setState({
        openSidebar: true,
        contentClassNames: ''
      });
    }
  };

  render() {
    const {
      children,
      icpNumber
    } = this.props;

    return (
      <div className="gohan-app">
        <TokenRenewal/>
        <Navbar onToggleSidebar={this.handleToggleSidebar}
          isSidebarOpen={this.state.openSidebar}
        />
        <Sidebar open={this.state.openSidebar}/>
        <ErrorToaster/>
        <SuccessToaster />
        <div className={`view-content ${this.state.contentClassNames}`}>
          <div className="view-content-body">
            {children}
          </div>
          <Footer className="view-content-footer">{icpNumber}</Footer>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  icpNumber: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    icpNumber: getIcpNumber(state),
  };
}

export default connect(mapStateToProps, {})(App);
