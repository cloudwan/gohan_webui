/* global window, document, gohanVersion */
import React from 'react';
import {render} from 'react-dom';

import '../css/blueprint/blueprint.scss';
import '../css/bootstrap/bootstrap.scss';
import '../css/codemirror.scss';
import '../css/main.scss';

import history from './location/history';

import Root from './app/Root';
import createStore from './app/store';
import {fetchConfig} from './config/ConfigActions';
import {fetchUiSchema} from './uiSchema/UiSchemaActions';
import {updateLocation} from './location/LocationActions';

const store = createStore(window.devToolsExtension && window.devToolsExtension());

updateLocation(store)({pathname: history.location.pathname});
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
