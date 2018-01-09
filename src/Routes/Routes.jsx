import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  Router,
  Route,
  Switch
} from 'react-router-dom';

import NotFound from './../NotFoundView';
import Auth from './../Auth/Auth';
import requestAuth from './../Auth/RequestAuth';
import components from './componentsList';
import createRoutes from './createRoutes';

import {getAllSchemas} from './../schema/schemaSelectors';
import {fetchSchema} from './../schema/schemaActions';

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
      const Application = requestAuth(components.App);
      const routes = createRoutes(this.props.store, components);
      return (
        <Router history={this.props.history}>
          <Switch>
            <Application>
              <Switch>
                {routes}
                <Route path={''} component={NotFound}/>
              </Switch>
            </Application>
          </Switch>
        </Router>
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
