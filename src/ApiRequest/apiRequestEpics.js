import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {
  FETCH,
} from './apiRequestActionTypes';
import {
  fetchSuccess,
  fetchFailure,
} from './apiRequestActions';

import {
  get,
  post,
  put,
  parseXHRError
} from './../api/index';

export const fetch = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(FETCH)
  .switchMap(({method, url, body}) => {
    const state = store.getState();
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId,
    };

    if (method === 'GET') {
      return call(get, url, headers)
        .flatMap(response => Observable.concat(
          Observable.of(fetchSuccess(response.response))
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(fetchFailure(parseXHRError(error)));
        });
    } else if (method === 'POST') {
      return call(post, url, headers, body)
        .flatMap(response => Observable.concat(
          Observable.of(fetchSuccess(response.response))
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(fetchFailure(parseXHRError(error)));
        });
      } else if (method === 'PUT') {
        return call(put, url, headers, body)
          .flatMap(response => Observable.concat(
            Observable.of(fetchSuccess(response.response))
          ))
          .catch(error => {
            console.error(error);
            return Observable.of(fetchFailure(parseXHRError(error)));
          });
      }
    return Observable.of(fetchFailure('Unknown error!'));
  });

export default combineEpics(
  fetch,
);
