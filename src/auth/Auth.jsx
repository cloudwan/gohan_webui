import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
import {Paper} from 'material-ui';

import {login, selectTenant, fetchTokenData} from './AuthActions';
import {resetErrorMessage} from './../error/ErrorActions';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';
import Alert from './../alert/Alert';

const style = {
  minWidth: 250,
  maxWidth: 450,
  padding: 20,
  margin: 'auto',
  textAlign: 'center',
  display: 'block',
};

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
      this.props.onLoginSuccess();
    }
  }

  render() {
    const {errorMessage} = this.props;
    let error = errorMessage ? errorMessage : '';

    return (
      <Paper style={style} zDepth={2}>
        {error && <Alert message={error} dismissClick={this.handleDismissClick}/> }
        {(() => {
          if (this.props.tokenId === undefined) {
            return (<Login onLoginSubmit={this.handleLoginSubmit}/>);
          } else if (this.props.tenant === undefined && this.props.tenants !== undefined) {
            return (<SelectTenant onTenantSubmit={this.handleSelectTenantSubmit} tenants={this.props.tenants} />);
          }
          return (<Spinner spinnerName='double-bounce' />);
        })()}
      </Paper>
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
