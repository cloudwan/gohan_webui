import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {AppBar, IconButton, FontIcon} from 'material-ui';
import {resetErrorMessage} from './../error/ErrorActions';
import {fetchSchema} from './../schema/SchemaActions';
import SidebarMenu from './components/SidebarMenu';
import UserMenu from './components/UserMenu';
import {logout, selectTenant} from '../auth/AuthActions';
import {Toaster, Position} from '@blueprintjs/core';

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

  handleRightDrawerRequestChange = open => {
    this.setState({openUserMenu: open});
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

  render() {
    const {children} = this.props;
    const {user, tenant, tenants} = this.props.authReducer;

    return (
      <div>
        <SidebarMenu open={this.state.openSidebarMenu} schemaReducer={this.props.schemaReducer}
          onRequestChange={this.handleSidebarMenuRequestChange}
        />
        <UserMenu open={this.state.openUserMenu} onRequestChange={this.handleRightDrawerRequestChange}
          user={user} tenant={tenant}
          tenants={tenants} onRequestLogout={this.handleRequestLogout}
          onRequestChangeTenant={this.handleRequestChangeTenant}
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
  logout,
  selectTenant
})(App);
