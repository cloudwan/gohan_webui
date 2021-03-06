import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {
  get,
  parseXHRError
} from './../api';

import {UPDATE} from './breadcrumbActionTypes.js';
import {
  updateFulfilled,
  updateFailure,
} from './breadcrumbActions.js';

export const updateBreadcrumb = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(UPDATE)
  .mergeMap(({data: elements}) => {
    const state = store.getState();
    const query = '?_fields=id&_fields=name';
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId,
    };
    const {title} = state.configReducer;

    if (!elements) {
      return Observable.of(updateFulfilled([], title));
    }

    const elementsWithoutTitle = elements
      .map((element, index) => ({...element, index}))
      .filter(element => !element.title);

    if (elementsWithoutTitle.length === 0) {
      return Observable.of(updateFulfilled(elements, title));
    }

    return Observable.zip(
      ...elementsWithoutTitle.map(
        element => call(
          get,
          `${state.configReducer.gohan.url}${element.requestUrl}${query}`,
          headers,
        )
      )
    ).map(responseArray => {
      const updatedElements = responseArray.reduce((result, item, index) => {
        const element = elementsWithoutTitle[index];
        result[element.index] = {
          title: item.response[element.singular].name || item.response[element.singular].id,
          url: element.url,
        };
        return result;
      }, {});

      return updateFulfilled([
        ...elements.map((element, index) => (updatedElements[index] !== undefined) ? updatedElements[index] : element)
      ], title);
    }).catch(error => {
      console.error(error);
      return Observable.of(updateFailure(parseXHRError(error), title));
  });
});

export default combineEpics(
  updateBreadcrumb,
);
