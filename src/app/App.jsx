import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';

import Navbar from './components/Navbar';

import SidebarMenu from './components/SidebarMenu';
import Alert from '../components/Alert';
import {logout, selectTenant} from '../auth/AuthActions';

const contentStyle = {
  paddingTop: 64,
  minHeight: 400,
  paddingRight: 14
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openUserMenu: false,
      openSidebarMenu: false,
      contentPaddingLeft: 14,
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

  renderErrorMessage() {
    const {errorMessage} = this.props;

    if (!errorMessage) {
      return null;
    }

    return (
      <Alert message={errorMessage} dismissClick={this.handleDismissClick} />
    );
  }

  render() {
    const {children} = this.props;
    const {user, tenant, tenants} = this.props.authReducer;

    return (
      <div>
        {this.renderErrorMessage()}
        <Navbar userName={user.username} tenants={tenants}
          activeTenant={tenant.name} onRequestLogout={this.handleRequestLogout}
          onRequestChangeTenant={this.handleRequestChangeTenant} onRequestShowMenu={this.handleRequestShowMenu}
        />
        <SidebarMenu open={this.state.openSidebarMenu} schemaReducer={this.props.schemaReducer}
          onRequestChange={this.handleSidebarMenuRequestChange}
        />
        <div style={{paddingLeft: this.state.contentPaddingLeft, ...contentStyle}}>
          {children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  schemaReducer: PropTypes.object,
  children: PropTypes.node
};

function mapStateToProps(state) {
  return {
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
