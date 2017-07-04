import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Auth from './Auth';

export default function requestAuth(WrappedComponent) {
  class RequestAuthComponent extends Component {
    render() {
      const {logged} = this.props.authReducer;

      if (logged) {
        return (
          <WrappedComponent {...this.props} />
        );
      }
      return (
        <Auth onLoginSuccess={this.loginSuccess}/>
      );
    }
  }

  function mapStateToProps(state) {
    return {
      authReducer: state.authReducer,
    };
  }

  RequestAuthComponent.contextTypes = {
    router: PropTypes.object
  };

  RequestAuthComponent.propTypes = {
    authReducer: PropTypes.object.isRequired
  };

  return connect(mapStateToProps, {
  })(RequestAuthComponent);
}
