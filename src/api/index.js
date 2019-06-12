import {ajax} from 'rxjs/observable/dom/ajax';
import {stringify as queryStringify} from 'query-string';
import {AjaxObservable} from 'rxjs/observable/dom/AjaxObservable';
import {Observable} from 'rxjs/Rx';

import {getTokenId} from './../auth/AuthSelectors';
import {
  getSchema,
  getCollectionUrl,
  getSingularUrl,
  hasSchemaProperty,
  getIsPublicExists
} from './../schema/SchemaSelectors';
import {
  isTenantFilterActive,
  getTenantId,
  getTenantFilterUseAnyOf
} from './../auth/AuthSelectors';
import {getGohanUrl} from './../config/ConfigSelectors';
import {getPageLimit, getPollingInterval, isPolling} from '../config/ConfigSelectors';

export const getPollingTimer = (state, until$) => {
  const pollingInterval = getPollingInterval(state);
  const polling = isPolling(state);

  return Observable.timer(0, pollingInterval)
    .takeWhile(i => i === 0 ? true : Boolean(polling))
    .takeUntil(until$);
};

export class GetCollectionObservable extends AjaxObservable {
  constructor(state, schemaId, urlParams, query) {
    const url = getCollectionUrl(state, schemaId, urlParams);
    const gohanUrl = getGohanUrl(state);
    const defaultPageLimit = getPageLimit(state);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': getTokenId(state)
    };
    const anyOf = getTenantFilterUseAnyOf(state);
    const isPublic = getIsPublicExists(state, schemaId);
    const isTenantFilterOn = isTenantFilterActive(state);

    super({
      method: 'GET',
      url: `${gohanUrl}${url}?${queryStringify({
        limit: defaultPageLimit,
        tenant_id: isTenantFilterOn && // eslint-disable-line camelcase
          hasSchemaProperty(state, schemaId, 'tenant_id') ?
          getTenantId(state) : undefined,
        is_public: isTenantFilterOn && isPublic ? isPublic : undefined, // eslint-disable-line camelcase
        any_of: isTenantFilterOn && isPublic ? anyOf : undefined, // eslint-disable-line camelcase
        ...query
      })}`,
      headers,
      crossDomain: true
    });
  }
}

export class GetSingularObservable extends AjaxObservable {
  constructor(state, schemaId, urlParams, query) {
    const url = getSingularUrl(state, schemaId, urlParams);
    const gohanUrl = getGohanUrl(state);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': getTokenId(state)
    };

    super({
      method: 'GET',
      url: `${gohanUrl}${url}${query ? `?${queryStringify({...query})}` : ''}`,
      headers,
      crossDomain: true
    });
  }
}

export const getCollection = (state, schemaId, urlParams, query) => {
  return new GetCollectionObservable(state, schemaId, urlParams, query)
    .map(response => ({
      totalCount: parseInt(response.xhr.getResponseHeader('X-Total-Count'), 10),
      payload: response.response[getSchema(state, schemaId).plural]
    }))
    .catch(error => {
      throw parseXHRError(error);
    });
};

export const getSingular = (state, schemaId, urlParams, query) =>
  new GetSingularObservable(state, schemaId, urlParams, query)
    .map(response => ({
      payload: response.response[getSchema(state, schemaId).singular]
    }))
    .catch(error => {
      throw parseXHRError(error);
    });


export const create = (state, schemaId, urlParams, body) => {
  const url = getCollectionUrl(state, schemaId, urlParams);
  const gohanUrl = getGohanUrl(state);
  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': getTokenId(state)
  };

  return new AjaxObservable({
    method: 'POST',
    url: `${gohanUrl}${url}`,
    body,
    headers,
    crossDomain: true
  })
    .map(response => ({
      payload: response.response[getSchema(state, schemaId).singular]
    }))
    .catch(error => {
      throw parseXHRError(error);
    });
};

export const update = (state, schemaId, urlParams, body) => {
  const url = getSingularUrl(state, schemaId, urlParams);
  const gohanUrl = getGohanUrl(state);
  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': getTokenId(state)
  };

  return new AjaxObservable({
    method: 'PUT',
    url: `${gohanUrl}${url}`,
    body,
    headers,
    crossDomain: true
  })
    .map(response => ({
      payload: response.response[getSchema(state, schemaId).singular]
    }))
    .catch(error => {
      throw parseXHRError(error);
    });
};

export const remove = (state, schemaId, urlParams) => {
  const url = getSingularUrl(state, schemaId, urlParams);
  const gohanUrl = getGohanUrl(state);
  const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': getTokenId(state)
  };

  return new AjaxObservable({
    method: 'DELETE',
    url: `${gohanUrl}${url}`,
    headers,
    crossDomain: true
  })
    .map(response => ({
      payload: response.response
    }))
    .catch(error => {
      throw parseXHRError(error);
    });
};

export const parseXHRError = error => {
  if (error) {
    if (error.xhr) {
      if (error.xhr.response) {
        const {response} = error.xhr;

        if (typeof response === 'object') {
          if (response.error) {
            const {error} = response;

            if (typeof error === 'object') {
              if (error.message) {
                if (typeof error.message === 'string') {
                  return error.message;
                }
              }
            } else if (typeof error === 'string') {
              return error;
            }
          }
        } else if (typeof response === 'string') {
          return response;
        }
      }
    } else if (error.message) {
      return error.message;
    }
  }
  return 'Unknown error!';
};

export const get = (url, headers, responseType) => {
  const requestOptions = {
    method: 'GET',
    url,
    headers,
    crossDomain: true,
  };

  if (responseType) {
    requestOptions.responseType = responseType;
  }

  return ajax(requestOptions);
};

export const post = (url, headers, body) => ajax({method: 'POST', url, body, headers, crossDomain: true});

export const put = (url, headers, body) => ajax({method: 'PUT', url, body, headers, crossDomain: true});

export const purge = (url, headers) => ajax({method: 'DELETE', url, headers, crossDomain: true});

export const createWebSocket = (url, events = {
    onOpen: () => {},
    onMessage: () => {},
    onClose: () => {},
    onError: () => {}
  }) => {

  if (
    typeof url === 'undefined' ||
    url === null ||
    url.length === 0 ||
    typeof url !== 'string' ||
    !(url.startsWith('http') || url.startsWith('ws'))
  ) {
    throw new Error(`Proper URL must be defined. Current URL: ${url}`);
  }

  if (url.startsWith('http')) {
    url = url.replace('http', 'ws'); // todo: add ^
  }

  const ws = new WebSocket(url); // eslint-disable-line

  ws.addEventListener('open', events.onOpen);
  ws.addEventListener('message', events.onMessage);
  ws.addEventListener('error', events.onError);
  ws.addEventListener('close', evt => {
    events.onClose(evt);

    ws.removeEventListener('open', events.onOpen);
    ws.removeEventListener('message', events.onMessage);
    ws.removeEventListener('close', events.onClose);
    ws.removeEventListener('error', events.onError);
  });

  return ws;
};
