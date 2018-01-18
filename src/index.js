/* global window, document, gohanVersion */
import React from 'react';
import {render} from 'react-dom';

import '../css/sass/main.scss';

import history from './location/history';

import Root from './app/Root';
import createStore from './app/store';
import {fetch} from './config/ConfigActions';
import {updateLocation} from './location/LocationActions';

const store = createStore(window.devToolsExtension && window.devToolsExtension());

console.log(`Gohan version: ${gohanVersion.version}, repo tag: ${gohanVersion.tag}`);

store.unsubscribeHistory = history.listen(updateLocation(store));
store.dispatch(fetch());

const unsubscribe = store.subscribe((() => {
  if (!store.getState().uiSchemaReducer.isLoading) {
    unsubscribe();
    render(
      (
        <Root store={store} history={history}/>
      ),
      document.getElementById('root')
    );
  }
}));
