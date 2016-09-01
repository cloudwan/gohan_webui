/* global window, document */
import React from 'react';
import {render} from 'react-dom';
import {hashHistory} from 'react-router';

import Root from './app/Root';
import createStore from './app/store';
import {fetchConfig} from './config/ConfigActions';

const store = createStore(window.devToolsExtension && window.devToolsExtension());

store.dispatch(fetchConfig());

render(
  <Root store={store} history={hashHistory} />,
  document.getElementById('root')
);
