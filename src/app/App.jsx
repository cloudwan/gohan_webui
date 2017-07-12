import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FocusStyleManager} from '@blueprintjs/core';

import {fetchSchema} from './../schema/SchemaActions';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ErrorToaster from './../error/ErrorToaster';

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openUserMenu: false,
      openSidebar: true,
      contentClassNames: ''
    };
  }

  componentWillMount() {
    this.props.fetchSchema();
  }

  handleDismissClick = event => {
    if (event) {
      event.preventDefault();
    }
    this.props.resetErrorMessage();
  };

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
    const {children} = this.props;

    return (
      <div>
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

function mapStateToProps() {
  return {
  };
}

export default connect(mapStateToProps, {
  fetchSchema,
})(App);
