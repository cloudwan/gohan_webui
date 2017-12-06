import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
  login,
  selectTenant,
  fetchTokenData,
  sessionStorageTransfer,
  transferStorage
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

  handleSelectTenantSubmit = (...params) => {
    this.props.resetErrorMessage();
    this.props.selectTenant(...params);
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
          iconName={'error'} onDismiss={this.props.resetErrorMessage}
        />
      );
    }
    return null;
  };

  getActiveStep() {
    const {Login, SelectTenant, Loading} = this.props;

    if (!this.props.inProgress && this.props.tokenId === undefined) {
      return (
        <Login key={0} onLoginSubmit={this.handleLoginSubmit}
          Error={this.renderErrors()}
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
      <Loading key={2}/>
    );
  }
  render() {
    return (
      <ReactCSSTransitionGroup transitionName="gohan-auth"
        transitionEnter={true} transitionEnterTimeout={200}
        transitionLeave={true} transitionLeaveTimeout={100}>
        {this.getActiveStep()}
      </ReactCSSTransitionGroup>
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
    tokenId: getTokenId(state),
    tokenExpires: getTokenExpires(state),
    tenant: getTenant(state),
    tenants: getTenants(state),
    user: getUser(state),
    inProgress: getProgressState(state),
    errorMessage: getError(state),
    storagePrefix: getStoragePrefix(state)
  };
}

export default connect(mapStateToProps, {
  login,
  selectTenant,
  fetchTokenData,
  resetErrorMessage,
  sessionStorageTransfer,
  transferStorage
})(Auth);
