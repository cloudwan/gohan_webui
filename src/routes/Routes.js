import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Router} from 'react-router';

import Auth from '../auth/Auth';
import components from './componentsList';
import createRoutes from './createRoutes';

import {fetchSchema} from './../schema/SchemaActions';

class Routes extends Component {
  shouldComponentUpdate(props) {
    return !(
      props.schemaReducer.data.length === this.props.schemaReducer.data.length && props.schemaReducer.data.length !== 0
    );
  }

  loginSuccess = () => {
    this.props.fetchSchema();
  };

  render() {
    if (this.props.schemaReducer.data.length !== 0) {
      const routes = createRoutes(this.props.store, components);

      return (
        <Router history={this.props.history} routes={routes} />
      );
    }
    return (
      <Auth onLoginSuccess={this.loginSuccess}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    schemaReducer: state.schemaReducer,
  };
}

export default connect(mapStateToProps, {
  fetchSchema
})(Routes);

Routes.contextTypes = {
  router: PropTypes.object
};

Routes.propTypes = {
  schemaReducer: PropTypes.object
};
