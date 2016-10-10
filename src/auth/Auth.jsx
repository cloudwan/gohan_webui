import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Spinner from 'react-spinkit';
import {Paper} from 'material-ui';

import {login, selectTenant} from './AuthActions';
import Login from './components/Login';
import SelectTenant from './components/SelectTenant';

const style = {
  minWidth: 250,
  maxWidth: 450,
  padding: 20,
  margin: 'auto',
  textAlign: 'center',
  display: 'block',
};

class Auth extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.tokenId !== undefined && nextProps.tenant !== undefined) {
      this.context.router.push('/');
    }
  }

  render() {
    return (
      <Paper style={style} zDepth={2}>
        {(() => {
          if (this.props.tokenId === undefined) {
            return (<Login login={this.props.login}/>);
          } else if (this.props.tenant === undefined && this.props.tenants !== undefined) {
            return (<SelectTenant onTenantSubmit={this.props.selectTenant} tenants={this.props.tenants} />);
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
  tenants: PropTypes.array
};

function mapStateToProps(state) {
  return {
    tokenId: state.authReducer.tokenId,
    tokenExpires: state.authReducer.tokenExpires,
    tenant: state.authReducer.tenant,
    tenants: state.authReducer.tenants
  };
}

export default connect(mapStateToProps, {
  login,
  selectTenant
})(Auth);
