import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import {
  login,
  selectTenant,
  fetchTokenData,
  sessionStorageTransfer,
  transferStorage,
  changeTenantFilter,
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
  getTenantsByDomain,
  getUser,
  getProgressState,
  getStoragePrefix,
  getUnscopedToken,
  isUserAdmin,
  getLoggedState,
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
    this.props.selectTenant({id, name});
    if (this.props.useDomain) {
      this.props.changeTenantFilter(this.props.isAdmin && id !== 'all');
    } else {
      this.props.changeTenantFilter(filterStatus);
    }
  };

  componentWillReceiveProps({loggedState}) {
    if (loggedState && !this.props.loggedState && this.props.onLoginSuccess) {
      this.props.onLoginSuccess();
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
    const {
      Login,
      SelectTenant,
      Loading,
      domainName,
      useDomain,
      loggedState,
      tenant,
      tenantsByDomain,
      unscopedToken,
      inProgress,
      user,
      isAdmin,
    } = this.props;

    if (!inProgress && unscopedToken === undefined) {
      return (
        <Login key={0} onLoginSubmit={this.handleLoginSubmit}
          Error={this.renderErrors()} isDomainEnabled={useDomain && !domainName}
        />
      );
    } else if (!inProgress && !loggedState && !isEmpty(tenantsByDomain) && (!tenant || !isEmpty(tenant))) {
      return (
        <SelectTenant key={1}
          username={user.name}
          onTenantSubmit={this.handleSelectTenantSubmit}
          tenantsByDomain={tenantsByDomain}
          Error={this.renderErrors()}
          useDomain={useDomain}
          isAdmin={isAdmin}
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
    tenantsByDomain: PropTypes.object,
    errorMessage: PropTypes.string,
    useDomain: PropTypes.bool,
    domainName: PropTypes.string,
    loggedState: PropTypes.bool,
  };
}

function mapStateToProps(state) {
  return {
    tokenId: getTokenId(state),
    tokenExpires: getTokenExpires(state),
    tenant: getTenant(state),
    tenantsByDomain: getTenantsByDomain(state),
    user: getUser(state),
    inProgress: getProgressState(state),
    errorMessage: getError(state),
    storagePrefix: getStoragePrefix(state),
    useDomain: getUseKeystoneDomainState(state),
    domainName: getDomainName(state),
    unscopedToken: getUnscopedToken(state),
    isAdmin: isUserAdmin(state),
    loggedState: getLoggedState(state),
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
