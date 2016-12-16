/* global window, document */
import 'material-design-icons/iconfont/material-icons.css';
import React from 'react';
import {render} from 'react-dom';
import {hashHistory} from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Root from './app/Root';
import createStore from './app/store';
import {fetchConfig} from './config/ConfigActions';

import {updateLocation} from './location/LocationActions';

import '../css/sass/main.scss';

const store = createStore(window.devToolsExtension && window.devToolsExtension());
store.unsubscribeHistory = hashHistory.listen(updateLocation(store));

const muiTheme = getMuiTheme({
  palette: {
  },
  appBar: {
    height: 50
  },
  zIndex: {
    menu: 1000,
    appBar: 1100,
    leftNavOverlay: 1200,
    leftNav: 1300,
    dialogOverlay: 1400,
    dialog: 1500,
    layer: 2000,
    popover: 2100,
    snackbar: 2900,
    tooltip: 3000
  }
});

injectTapEventPlugin();
store.dispatch(fetchConfig()).then(() => {

  render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Root store={store} history={hashHistory} />
    </MuiThemeProvider>,
    document.getElementById('root')
  );
});
