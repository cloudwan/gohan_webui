import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';
import {
  FETCH,
  FETCH_CANCELLED,
  FETCH_FAILURE,
} from './DetailActionTypes';

import {getSingularUrl} from './../schema/SchemaSelectors';

import {fetchSuccess, fetchError} from './DetailActions';
import {
  get,
  parseXHRError
} from './../api/index';

export const fetch = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(FETCH)
  .switchMap(({schemaId, params}) => {
    const state = store.getState();
    const {pollingInterval, polling} = state.configReducer;
    const {url: gohanUrl} = state.configReducer.gohan;
    const url = getSingularUrl(state, schemaId, params);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    return Observable.timer(0, pollingInterval)
    .startWith(0)
    .takeWhile(i => i === 0 ? true : Boolean(polling))
    .takeUntil(
      Observable.merge(
        action$.ofType(FETCH),
        action$.ofType(FETCH_FAILURE),
        action$.ofType(FETCH_CANCELLED),
      )
    )
    .mergeMap(() => call(get, `${gohanUrl}${url}`, headers)
      .map(response => fetchSuccess(response.response[Object.keys(response.response)[0]]))
      .catch(error => {
        console.error(error);
        return Observable.of(fetchError(parseXHRError(error)));
      })
    );
  });

export default combineEpics(
  fetch,
);
