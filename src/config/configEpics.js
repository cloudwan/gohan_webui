/* global location */
import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {
  get,
  parseXHRError,
} from '../api';
import {FETCH} from './ConfigActionTypes';
import {
  fetchSuccess,
  fetchFailure,
} from './ConfigActions';
import {
  fetch as fetchUiSchema,
} from '../uiSchema/UiSchemaActions';

export const fetch = (action$, store, call = (fn, ...args) => fn(...args)) => action$
  .ofType(FETCH)
  .switchMap(() => {
    const url = './config.json';
    const headers = {
      'Content-Type': 'application/json',
    };

    return call(get, url, headers)
      .mergeMap(({response: data}) => {
        if (data.authUrl.includes('__HOST__')) {
          data.authUrl = data.authUrl.replace(
            '__HOST__', location.hostname);
        }

        if (data.gohan.url.includes('__HOST__')) {
          data.gohan.url = data.gohan.url.replace(
            '__HOST__', location.hostname);
        }

        console.log('configEpics data:', data);
        return Observable.concat(
          Observable.of(fetchSuccess(data)),
          Observable.of(fetchUiSchema()),
        );
      })
      .catch(error => {
        console.error(error);
        return Observable.of(fetchFailure(parseXHRError(error)));
      });
  });

const configEpics = combineEpics(
  fetch,
);

export default configEpics;
