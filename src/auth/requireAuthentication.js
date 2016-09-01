import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

export default function requireAuthentication(ChildComponent) {
  class Authenticated extends Component {
    checkCredentials(tokenId, tokenExpires) {
      if (tokenId === undefined && tokenExpires === undefined) {
        this.context.router.push('/login');
      }
    }

    componentWillMount() {
      this.checkCredentials(this.props.tokenId, this.props.tokenExpires);
    }

    componentWillReceiveProps(nextProps) {
      this.checkCredentials(nextProps.tokenId, nextProps.tokenExpires);
    }

    render() {
      return (
        <div>
          {this.props.tokenId ? <ChildComponent {...this.props}/> : null}
        </div>
      );
    }
  }

  Authenticated.contextTypes = {
    router: PropTypes.object
  };

  Authenticated.propTypes = {
    tokenId: PropTypes.string,
    tokenExpires: PropTypes.string,
  };

  function mapStateToProps(state) {
    return {
      tokenId: state.authReducer.tokenId,
      tokenExpires: state.authReducer.tokenExpires
    };
  }

  return connect(mapStateToProps, {})(Authenticated);
}
