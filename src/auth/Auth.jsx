import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {login, selectTenant, fetchTokenData} from './AuthActions';
import {resetErrorMessage} from './../error/ErrorActions';
import LoadingIndicator from '../components/LoadingIndicator';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';
import {Toast} from '@blueprintjs/core';

export class Auth extends Component {
  componentWillMount() {
    this.props.fetchTokenData();
  }

  handleLoginSubmit = (...params) => {
    this.props.resetErrorMessage();
    this.props.login(...params);
  };

  handleSelectTenantSubmit = (...params) => {
    this.props.resetErrorMessage();
    this.props.selectTenant(...params);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tokenId !== undefined && nextProps.tenant !== undefined) {
      if (this.props.onLoginSuccess) {
        this.props.onLoginSuccess();
      }
    }
  }

  renderErrors = () => {
    if (this.props.errorMessage) {
      return (
        <Toast message={this.props.errorMessage} className={'pt-intent-danger'}
          iconName={'error'} onDismiss={this.props.resetErrorMessage}
        />
      );
    }
    return null;
  };

  render() {
    const {Login, SelectTenant, Loading} = this.props;

    if (!this.props.inProgress && this.props.tokenId === undefined) {
      return (
        <Login onLoginSubmit={this.handleLoginSubmit} Error={this.renderErrors()}/>
      );
    } else if (this.props.tenant === undefined && this.props.tenants !== undefined) {
      return (
        <SelectTenant username={this.props.user.name} onTenantSubmit={this.handleSelectTenantSubmit}
          tenants={this.props.tenants} Error={this.renderErrors()}
        />
      );
    }
    return (
      <Loading/>
    );
  }
}

Auth.defaultProps = {
  Login,
  SelectTenant,
  Loading: LoadingIndicator
};

Auth.contextTypes = {
  router: PropTypes.object
};

if (process.env.NODE_ENV !== 'production') {
  Auth.propTypes = {
    Login: PropTypes.oneOfType([
      PropTypes.func
    ]),
    SelectTenant: PropTypes.oneOfType([
      PropTypes.func
    ]),
    Loading: PropTypes.oneOfType([
      PropTypes.func
    ]),
    tokenId: PropTypes.string,
    tokenExpires: PropTypes.string,
    tenant: PropTypes.object,
    tenants: PropTypes.array,
    errorMessage: PropTypes.string
  };
}

function mapStateToProps(state) {
  return {
    tokenId: state.authReducer.tokenId,
    tokenExpires: state.authReducer.tokenExpires,
    tenant: state.authReducer.tenant,
    tenants: state.authReducer.tenants,
    user: state.authReducer.user,
    inProgress: state.authReducer.inProgress,
    errorMessage: state.errorReducer
  };
}

export default connect(mapStateToProps, {
  login,
  selectTenant,
  fetchTokenData,
  resetErrorMessage
})(Auth);
