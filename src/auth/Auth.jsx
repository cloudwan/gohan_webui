import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  login,
  selectTenant,
  fetchTokenData,
  sessionStorageTransfer,
  transferStorage,
  changeTenantFilter
} from './AuthActions';
import {resetErrorMessage} from './../error/ErrorActions';
import LoadingIndicator from '../components/LoadingIndicator';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';
import {Toast} from '@blueprintjs/core';

import {getError} from './../error/ErrorSelectors';
import {
  getTokenId,
  getTokenExpires,
  getTenant,
  getTenants,
  getUser,
  getProgressState,
  getStoragePrefix
} from './AuthSelectors';

import {
  getUseKeystoneDomainState,
  getDomainName
} from './../config/ConfigSelectors';

export class Auth extends Component {
  constructor(props) {
    super(props);

    window.addEventListener('storage', props.sessionStorageTransfer, false); // eslint-disable-line no-undef

    props.transferStorage();
  }

  componentDidMount() {
    this.props.fetchTokenData();
  }

  handleLoginSubmit = (...params) => {
    this.props.resetErrorMessage();
    this.props.login(...params);
  };

  handleSelectTenantSubmit = (name, id, filterStatus) => {
    this.props.resetErrorMessage();
    this.props.selectTenant(name, id);
    this.props.changeTenantFilter(filterStatus);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tokenId !== undefined && nextProps.tenant !== undefined && nextProps.tenants !== undefined) {
      if (this.props.onLoginSuccess) {
        this.props.onLoginSuccess();
      }
    }
  }

  renderErrors = () => {
    if (this.props.errorMessage) {
      return (
        <Toast message={this.props.errorMessage} className={'pt-intent-danger'}
          iconName={'error'} timeout="0"
          onDismiss={this.props.resetErrorMessage}
        />
      );
    }
    return null;
  };

  render() {
    const {Login, SelectTenant, Loading, domainName, useDomain} = this.props;

    if (!this.props.inProgress && this.props.tokenId === undefined) {
      return (
        <Login key={0} onLoginSubmit={this.handleLoginSubmit}
          Error={this.renderErrors()} isDomainEnabled={useDomain && !domainName}
        />
      );
    } else if (this.props.tenant === undefined && this.props.tenants !== undefined) {
      return (
        <SelectTenant key={1} username={this.props.user.name}
          onTenantSubmit={this.handleSelectTenantSubmit} tenants={this.props.tenants}
          Error={this.renderErrors()}
        />
      );
    }
    return (
      <Loading key={2} />
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
    errorMessage: PropTypes.string,
    useDomain: PropTypes.bool,
    domainName: PropTypes.string
  };
}

function mapStateToProps(state) {
  return {
    tokenId: getTokenId(state),
    tokenExpires: getTokenExpires(state),
    tenant: getTenant(state),
    tenants: getTenants(state),
    user: getUser(state),
    inProgress: getProgressState(state),
    errorMessage: getError(state),
    storagePrefix: getStoragePrefix(state),
    useDomain: getUseKeystoneDomainState(state),
    domainName: getDomainName(state)
  };
}

export default connect(mapStateToProps, {
  login,
  selectTenant,
  fetchTokenData,
  resetErrorMessage,
  sessionStorageTransfer,
  transferStorage,
  changeTenantFilter
})(Auth);
