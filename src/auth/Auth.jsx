import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {login, selectTenant, fetchTokenData} from './AuthActions';
import {resetErrorMessage} from './../error/ErrorActions';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';

import {Toaster, Position} from '@blueprintjs/core';

class Auth extends Component {
  constructor(props) {
    super(props);

    this.props.fetchTokenData(); // its temporary :D
  }

  handleDismissClick = event => {
    if (event) {
      event.preventDefault();
    }

    this.props.resetErrorMessage();
  };

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

  componentWillUpdate(nextProps) {
    const {errorMessage} = nextProps;

    if (errorMessage) {
      this.toaster.show({message: errorMessage, className: 'pt-intent-danger', timeout: 0});
    }
  }

  componentDidMount() {
    this.toaster = Toaster.create({
      position: Position.TOP
    });
  }

  render() {
    return (
      <div className="pt-card pt-elevation-3 auth-card">
        {(() => {
          if (this.props.tokenId === undefined) {
            return (<Login onLoginSubmit={this.handleLoginSubmit}/>);
          } else if (this.props.tenant === undefined && this.props.tenants !== undefined) {
            return (
              <SelectTenant onTenantSubmit={this.handleSelectTenantSubmit} tenants={this.props.tenants}/>
            );
          }
          return null;
        })()}
      </div>
    );
  }
}

Auth.contextTypes = {
  router: PropTypes.object
};

Auth.propTypes = {
  tokenId: PropTypes.string,
  tokenExpires: PropTypes.string,
  tenant: PropTypes.object,
  tenants: PropTypes.array,
  errorMessage: PropTypes.string
};

function mapStateToProps(state) {
  return {
    tokenId: state.authReducer.tokenId,
    tokenExpires: state.authReducer.tokenExpires,
    tenant: state.authReducer.tenant,
    tenants: state.authReducer.tenants,
    errorMessage: state.errorReducer
  };
}

export default connect(mapStateToProps, {
  login,
  selectTenant,
  fetchTokenData,
  resetErrorMessage
})(Auth);
