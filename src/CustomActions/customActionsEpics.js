import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {
  EXECUTE
} from './customActionsActionTypes';

import {
  executeSuccess,
  executeFailure,
} from './customActionsActions';

import {
  closeActiveDialog
} from './../Dialog/dialogActions';

import {
  post,
  purge,
  put,
  get,
  parseXHRError
} from './../api/index';


export const execute = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(EXECUTE)
  .switchMap(({url, data, method}) => {
    const state = store.getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    if (method === 'GET') {
      return call(get, `${gohanUrl}${url}`, headers)
        .flatMap(response => Observable.concat(
          Observable.of(executeSuccess(response.response, Boolean(data))),
          Observable.of(closeActiveDialog())
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(executeFailure(parseXHRError(error), Boolean(data)));
        });
    } else if (method === 'POST') {
      return call(post, `${gohanUrl}${url}`, headers, data)
        .flatMap(response => Observable.concat(
          Observable.of(executeSuccess(response.response, Boolean(data))),
          Observable.of(closeActiveDialog())
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(executeFailure(parseXHRError(error), Boolean(data)));
        });
    } else if (method === 'PUT') {
      return call(put, `${gohanUrl}${url}`, headers, data)
        .flatMap(response => Observable.concat(
          Observable.of(executeSuccess(response.response, Boolean(data))),
          Observable.of(closeActiveDialog())
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(executeFailure(parseXHRError(error), Boolean(data)));
        });
    } else if (method === 'DELETE') {
      return call(purge, `${gohanUrl}${url}`, headers)
        .flatMap(response => Observable.concat(
          Observable.of(executeSuccess(response.response, Boolean(data))),
          Observable.of(closeActiveDialog())
        ))
        .catch(error => {
          console.error(error);
          return Observable.of(executeFailure(parseXHRError(error), Boolean(data)));
        });
    }
    return Observable.of(executeFailure('Unknown error!', Boolean(data)));
  });

export default combineEpics(
  execute,
);
