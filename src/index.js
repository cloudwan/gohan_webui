/* global window, document, gohanVersion */
import React from 'react';
import {render} from 'react-dom';

import '../css/sass/main.scss';

import history from './location/history';

import Root from './App/Root';
import createStore from './App/store';
import {fetchConfig} from './config/configActions';
import {fetchUiSchema} from './uiSchema/uiSchemaActions';
import {updateLocation} from './location/locationActions';

const store = createStore(window.devToolsExtension && window.devToolsExtension());

store.unsubscribeHistory = history.listen(updateLocation(store));

console.log(`Gohan version: ${gohanVersion.version}, repo tag: ${gohanVersion.tag}`);

store.dispatch(fetchConfig()).then(() => {
  store.dispatch(fetchUiSchema()).then(() => {
    render(
      (
        <Root store={store} history={history}/>
      ),
      document.getElementById('root')
    );
  });
});
