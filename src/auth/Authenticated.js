import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LoadingIndicator from '../components/LoadingIndicator';

import {Router} from 'react-router';


import createRoutes from '../routes/createRoutes';

import {fetchSchema} from './../schema/SchemaActions';

import Auth from './Auth';

class Authenticated extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false
    };
  }

  shouldComponentUpdate() {
    return !(!this.props.schemaReducer.isLoading && this.state.isLogged);
  }

  loginSuccess = () => {
    this.setState({isLogged: true});
    this.props.fetchSchema();
  };

  render() {
    const {isLogged} = this.state;
    const {isLoading} = this.props.schemaReducer;
    if (!isLogged) {
      return (
        <Auth onLoginSuccess={this.loginSuccess}/>
      );
    }
    if (isLogged && isLoading) {
      return (
        <LoadingIndicator />
      );
    }
    if (isLogged && !isLoading) {
      const routes = createRoutes(this.props.store);

      return (
        <Router history={this.props.history} routes={routes} />
      );
    }
    return (
      <div>Happy Error</div>
    );
  }
}

Authenticated.contextTypes = {
  router: PropTypes.object
};

Authenticated.propTypes = {
  tokenId: PropTypes.string,
  tokenExpires: PropTypes.string,
  schemaReducer: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer
  };
}

export default connect(mapStateToProps, {
  fetchSchema
})(Authenticated);
