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

const store = createStore(window.devToolsExtension && window.devToolsExtension());

injectTapEventPlugin();
store.dispatch(fetchConfig());

render(
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <Root store={store} history={hashHistory} />
  </MuiThemeProvider>,
  document.getElementById('root')
);
