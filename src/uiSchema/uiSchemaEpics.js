/* global navigator */
import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {
  get,
  parseXHRError,
} from '../api';
import {FETCH} from './UiSchemaActionTypes';
import {
  fetchSuccess,
  fetchFailure
} from './UiSchemaActions';

export const fetch = (action$, store, call = (fn, ...args) => fn(...args)) => action$
  .ofType(FETCH)
  .switchMap(() => {
    const language = navigator.language.toLocaleLowerCase();
    const url = `/locales/${language}/uiSchema.json`;
    const headers = {
      'Content-Type': 'application/json',
    };

    return call(get, url, headers)
      .mergeMap(({response: data}) => Observable.of(fetchSuccess(data)))
      .catch(error => {
        console.error(error);
        return Observable.of(fetchFailure(parseXHRError(error)));
      });
  });

const uiSchemaEpics = combineEpics(
  fetch,
);

export default uiSchemaEpics;
