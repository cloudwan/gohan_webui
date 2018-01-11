import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FocusStyleManager} from '@blueprintjs/core';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ErrorToaster from './../Error/ErrorToaster';
import TokenRenewal from './../Auth/components/TokenRenewal';

FocusStyleManager.onlyShowFocusOnTabs();

export default class App extends Component {
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
      children
    } = this.props;

    return (
      <div>
        <TokenRenewal/>
        <Navbar onToggleSidebar={this.handleToggleSidebar}
          isSidebarOpen={this.state.openSidebar}
        />
        <Sidebar open={this.state.openSidebar}/>
        <ErrorToaster/>
        <div className={`view-content ${this.state.contentClassNames}`}>
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};
