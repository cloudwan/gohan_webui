/* global VERSION */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {AppBar, IconButton, FontIcon} from 'material-ui';
import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';
import SidebarMenu from './components/SidebarMenu';
import UserMenu from './components/UserMenu';
import Alert from '../components/Alert';
import {logout} from '../auth/AuthActions';

const contentStyle = {
  paddingTop: 64,
  minHeight: 400,
  paddingRight: 14
};

const appBar = {
  position: 'fixed',
  top: 0
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

    console.log('Gohan version:', VERSION.version, ', repo tag:', VERSION.tag);
  }

  handleDismissClick = event => {
    if (event) {
      event.preventDefault();
    }
    this.props.resetErrorMessage();
  };

  handleRightDrawerRequestChange = open => {
    this.setState({openUserMenu: open});
  };

  handleSidebarMenuRequestChange = open => {
    this.setState({openSidebarMenu: open, contentPaddingLeft: 14});
  };

  handleRequestLogout = () => {
    this.props.logout();
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
        <SidebarMenu open={this.state.openSidebarMenu} schemaReducer={this.props.schemaReducer}
          onRequestChange={this.handleSidebarMenuRequestChange}
        />
        <UserMenu open={this.state.openUserMenu} onRequestChange={this.handleRightDrawerRequestChange}
          user={user} tenant={tenant}
          tenants={tenants} onRequestLogout={this.handleRequestLogout}
        />
        <AppBar style={appBar} title="Gohan webui"
          onLeftIconButtonTouchTap={() => this.setState({openSidebarMenu: true, contentPaddingLeft: 270})}
          iconElementRight={
            <IconButton onTouchTap={() => this.setState({openUserMenu: true})}>
              <FontIcon className="material-icons">account_circle</FontIcon>
            </IconButton>
          }
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
  logout
})(App);
