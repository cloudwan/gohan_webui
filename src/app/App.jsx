import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';
import Navbar from './components/Navbar';
import SidebarMenu from './components/SidebarMenu';
import {logout, selectTenant} from '../auth/AuthActions';
import {FocusStyleManager, Toaster, Position} from '@blueprintjs/core';
import {getSidebarMenuItems} from './components/SidebarSelectors';

FocusStyleManager.onlyShowFocusOnTabs();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openUserMenu: false,
      openSidebarMenu: false
    };
  }

  componentWillMount() {
    this.props.fetchSchema();
  }

  componentDidMount() {
    this.toaster = Toaster.create({
      position: Position.TOP
    });
  }

  componentWillUpdate(nextProps) {
    const {errorMessage} = nextProps;

    if (errorMessage) {
      this.toaster.show({
        message: errorMessage,
        className: 'pt-intent-danger',
        timeout: 0,
        onDismiss: this.handleDismissClick
      });
    }
  }

  handleDismissClick = event => {
    if (event) {
      event.preventDefault();
    }
    this.props.resetErrorMessage();
  };

  handleSidebarMenuRequestChange = open => {
    this.setState({openSidebarMenu: open, contentPaddingLeft: 14});
  };

  handleRequestLogout = () => {
    this.props.logout();
  };

  handleRequestChangeTenant = tenantId => {
    this.props.selectTenant(tenantId);
  };

  handleRequestShowMenu = () => {
    this.setState({openSidebarMenu: true, contentPaddingLeft: 270});
  };
  render() {
    const {children} = this.props;
    const {user, tenant, tenants} = this.props.authReducer;

    return (
      <div>
        <Navbar userName={user.username} tenants={tenants}
          activeTenant={tenant.name} onRequestLogout={this.handleRequestLogout}
          onRequestChangeTenant={this.handleRequestChangeTenant} onRequestShowMenu={this.handleRequestShowMenu}
        />
        <SidebarMenu open={this.state.openSidebarMenu} menuItems={this.props.sidebarMenuItems}
          onRequestChange={this.handleSidebarMenuRequestChange}
        />
        <div className="view-content">
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  schemaReducer: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
    sidebarMenuItems: getSidebarMenuItems(state),
    errorMessage: state.errorReducer,
    resetErrorMessage: PropTypes.func.isRequired,
    schemaReducer: state.schemaReducer,
    authReducer: state.authReducer
  };
}

export default connect(mapStateToProps, {
  resetErrorMessage,
  fetchSchema,
  logout,
  selectTenant
})(App);
