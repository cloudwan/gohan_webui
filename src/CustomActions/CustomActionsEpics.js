import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';

import {stringify as queryStringify} from 'query-string';

import {
  EXECUTE
} from './CustomActionsActionTypes';

import {
  executeSuccess,
  executeFailure,
} from './CustomActionsActions';

import {
  closeActiveDialog
} from './../Dialog/DialogActions';

import {
  post,
  purge,
  put,
  get,
  parseXHRError
} from './../api/index';

const executeAjaxResponseSuccess = ({response, xhr}) => {
  const responseFormat = xhr.getResponseHeader('Content-Type').includes('text/html') ? 'html' : 'auto';

  return Observable.concat(
    Observable.of(executeSuccess(
      response,
      xhr.responseURL,
      responseFormat
    )),
    Observable.of(closeActiveDialog())
  );
};

const executeAjaxResponseFailure = (error, data) => {
  console.error(error);

  return Observable.of(executeFailure(parseXHRError(error), Boolean(data)));
};

const executeWebSocketSuccess = ({responseFormat, url}) => {
  return Observable.concat(
    Observable.of(
      executeSuccess(
        null,
        url,
        responseFormat
      )
    ),
    Observable.of(closeActiveDialog())
  );
};

export const execute = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(EXECUTE)
  .switchMap(({url, data, method, responseFormat}) => {
    const state = store.getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    const requestUrl = `${gohanUrl}${url}`;

    if (method === 'GET') {
      return call(get, requestUrl, headers, responseFormat)
        .flatMap(executeAjaxResponseSuccess)
        .catch(error => executeAjaxResponseFailure(error, data));
    } else if (method === 'POST') {
      return call(post, requestUrl, headers, data)
        .flatMap(executeAjaxResponseSuccess)
        .catch(error => executeAjaxResponseFailure(error, data));
    } else if (method === 'PUT') {
      return call(put, requestUrl, headers, data)
        .flatMap(executeAjaxResponseSuccess)
        .catch(error => executeAjaxResponseFailure(error, data));
    } else if (method === 'DELETE') {
      return call(purge, requestUrl, headers)
        .flatMap(executeAjaxResponseSuccess)
        .catch(error => executeAjaxResponseFailure(error, data));
    } else if (method === 'WEBSOCKET') {
      const query = queryStringify(data);

      return executeWebSocketSuccess({url: `${requestUrl}?${query}`, responseFormat});
}
    return Observable.of(executeFailure('Unknown error!', Boolean(data)));
  });

export default combineEpics(
  execute,
);
