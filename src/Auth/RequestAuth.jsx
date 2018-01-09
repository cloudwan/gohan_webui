import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Auth from './Auth';

import {getLoggedState} from './authSelectors';

export default function requestAuth(WrappedComponent) {
  class RequestAuthComponent extends PureComponent {
    render() {
      const {logged} = this.props;

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
      logged: getLoggedState(state),
    };
  }

  RequestAuthComponent.propTypes = {
    logged: PropTypes.bool.isRequired
  };

  return connect(mapStateToProps, {
  })(RequestAuthComponent);
}
