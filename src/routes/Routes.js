import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Router} from 'react-router';

import Auth from '../auth/Auth';
import components from './componentsList';
import createRoutes from './createRoutes';

import {getAllSchemas} from './../schema/SchemaSelectors';
import {fetchSchema} from './../schema/SchemaActions';

class Routes extends Component {
  shouldComponentUpdate(props) {
    return !(
      props.schemas.length === this.props.schemas.length && props.schemas.length !== 0
    );
  }

  loginSuccess = () => {
    this.props.fetchSchema();
  };

  render() {
    if (this.props.schemas.length !== 0) {
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
    schemas: getAllSchemas(state),
  };
}

export default connect(mapStateToProps, {
  fetchSchema
})(Routes);

Routes.contextTypes = {
  router: PropTypes.object
};

Routes.propTypes = {
  schemas: PropTypes.array
};
