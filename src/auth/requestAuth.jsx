import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Auth from './Auth';

import {getLoggedState} from './AuthSelectors';

export default function requestAuth(WrappedComponent, AuthComponent = Auth) {
  class RequestAuthComponent extends PureComponent {
    render() {
      const {logged} = this.props;

      if (logged) {
        return (
          <WrappedComponent {...this.props} />
        );
      }
      return (
        <AuthComponent onLoginSuccess={this.loginSuccess}/>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      logged: getLoggedState(state),
    };
  }

  RequestAuthComponent.propTypes = {
    logged: PropTypes.bool.isRequired
  };

  return connect(mapStateToProps, {
  })(RequestAuthComponent);
}
