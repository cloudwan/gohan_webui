/* global window, document */
import React from 'react';
import {render} from 'react-dom';
import {hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Root from './app/Root';
import createStore from './app/store';
import {fetchConfig} from './config/ConfigActions';

import {updateLocation} from './routes/LocationActions';

const store = createStore(window.devToolsExtension && window.devToolsExtension());
store.unsubscribeHistory = hashHistory.listen(updateLocation(store));



injectTapEventPlugin();
store.dispatch(fetchConfig()).then(() => {

  render(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <Root store={store} history={hashHistory} />
    </MuiThemeProvider>,
    document.getElementById('root')
  );
});
