import React from 'react';
import {Route} from 'react-router';

import App from './App';
import dynamicRoutes from '../dynamicRoutes/dynamicRoutes';
import requireAuthentication from '../auth/requireAuthentication';
import Login from '../auth/Auth';

export default (
  <div>
    <Route path="/login" component={Login} />
    <Route path="/" component={requireAuthentication(App)}>
      <Route path="*" component={dynamicRoutes()} />
    </Route>
  </div>
);
