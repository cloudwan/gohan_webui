/* globals parseInt*/
import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';
import {stringify as queryStringify} from 'query-string';

import {
  get,
  post,
  put,
  purge,
  parseXHRError
} from './../api/index';

import {
  getCollectionUrl,
  getSchema,
} from './../schema/SchemaSelectors';
import {getTokenId} from './../auth/AuthSelectors';
import {
  getGohanUrl,
  getPageLimit,
  getPollingInterval,
  isPolling
} from './../config/ConfigSelectors';
import {
  getLimit,
  getOffset,
  getSortOptions,
  getFilters
} from './TableSelectors';
import {
  CREATE,
  UPDATE,
  PURGE,
  FETCH,
  FETCH_PARENTS,
  FETCH_CANCELLED,
  FETCH_FAILURE,
} from './TableActionTypes';
import {
  fetch,
  fetchParents,
  fetchSuccess,
  fetchFailure,
  createSuccess,
  createFailure,
  updateSuccess,
  updateFailure,
  purgeSuccess,
  purgeFailure
} from './TableActions';
import {
  closeDialog
} from './../Dialog/DialogActions';

export const fetchEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(FETCH).mergeMap(({schemaId, params, options = {}}) => {
      const state = store.getState();
      const gohanUrl = getGohanUrl(state);
      const pollingInterval = getPollingInterval(state);
      const polling = isPolling(state);
      const pageLimit = getPageLimit(state);

      return Observable.timer(0, pollingInterval)
        .startWith(0)
        .takeWhile(i => i === 0 ? true : Boolean(polling))
        .takeUntil(
          action$.filter(action => {
            return [FETCH, FETCH_CANCELLED, FETCH_FAILURE, ].includes(action.type) && action.schemaId === schemaId;

          })
        )
        .mergeMap(() => {
          const state = store.getState();
          const schema = getSchema(state, schemaId);
          const {properties} = schema.schema;
          const url = getCollectionUrl(state, schemaId, params);
          const query = {};
          const sortOptions = getSortOptions(state, schemaId);
          const filters = getFilters(state, schemaId);

          if (options.sortKey !== undefined) {
            query.sort_key = options.sortKey; // eslint-disable-line camelcase
          } else if (sortOptions.sortKey !== undefined) {
            if (sortOptions.sortKey === '') {
              query.sort_key = undefined; // eslint-disable-line camelcase
            } else {
              query.sort_key = sortOptions.sortKey; // eslint-disable-line camelcase
            }
          }

          if (options.sortKey !== undefined) {
            if (options.sortKey === '') {
              query.sort_key = undefined; // eslint-disable-line camelcase
            } else {
              query.sort_key = options.sortKey; // eslint-disable-line camelcase
            }
          } else if (sortOptions.sortKey !== undefined) {
            if (sortOptions.sortKey === '') {
              query.sort_key = undefined; // eslint-disable-line camelcase
            } else {
              query.sort_key = sortOptions.sortKey; // eslint-disable-line camelcase
            }
          }

          if (options.sortOrder !== undefined) {
            if (options.sortOrder === '') {
              query.sort_order = undefined; // eslint-disable-line camelcase
            } else {
              if (!(options.sortOrder === 'asc' || options.sortOrder === 'desc')) {
                throw new Error('Wrong \'sortOrder\' value! Can be only \'asc\' or \'desc\'!');
              }
              query.sort_order = options.sortOrder; // eslint-disable-line camelcase
            }
          } else if (sortOptions.sortOrder !== undefined) {
            if (sortOptions.sortOrder === '') {
              query.sort_order = undefined; // eslint-disable-line camelcase
            } else {
              query.sort_order = sortOptions.sortOrder; // eslint-disable-line camelcase
            }
          }

          if (options.limit !== undefined) {
            if (options.limit === 0) {
              query.limit = undefined;
            } else {
              query.limit = options.limit;
            }
          } else if (getLimit(state, schemaId) !== undefined) {
            if (getLimit(state, schemaId) === 0) {
              query.limit = undefined;
            } else {
              query.limit = getLimit(state, schemaId);
            }
          } else if (pageLimit !== undefined) {
            if (pageLimit === 0) {
              query.limit = undefined;
            } else {
              query.limit = pageLimit;
            }
          }
          if (options.offset !== undefined) {
            if (options.offset === 0) {
              query.offset = undefined;
            } else {
              query.offset = options.offset;
            }
          } else if (getOffset(state, schemaId) !== undefined) {
            if (getOffset(state, schemaId) === 0) {
              query.offset = undefined;
            } else {
              query.offset = getOffset(state, schemaId);
            }
          }

          if (options.filters && Array.isArray(options.filters)) {
            options.filters.forEach(filter => {
              query[filter.key] = filter.value;
            });
          } else if (filters && Array.isArray(filters)) {
            filters.forEach(filter => {
              query[filter.key] = filter.value;
            });
          }

          const headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': getTokenId(state)
          };
          const urlQuery = queryStringify(query);


          return call(get, `${gohanUrl}${url}${urlQuery !== '' ? `?${urlQuery}` : ''}`, headers)
            .mergeMap(({response, xhr}) => {
              const data = response[Object.keys(response)[0]];
              console.log('data:', data);
              const withParents = data.map(d => {
                return Object.keys(d).reduce((result, prop) => {
                  const {
                    relation,
                    relation_property: relationProperty
                  } = properties[prop] || {};
                  const relationSchema = getSchema(state, relation);

                  if (relation && relationSchema.parent) {
                    return {
                      ...result,
                      [relation]: {
                        url: relationSchema.url,
                        relationName: relationProperty || relation,
                        childSchemaId: relationProperty || relation,
                        parent: relationSchema.parent,
                        id: d[prop],
                      }
                    };
                  }

                  return result;
                }, {});
              }).filter(item => (Object.keys(item).length > 0) && item.id !== null);
              console.log('withParents:', withParents);

              const resultData = {
                schemaId,
                sortKey: query.sort_key || '',
                sortOrder: query.sort_order || '',
                limit: query.limit || 0,
                offset: query.offset || 0,
                filters: options.filters || filters || [],
                totalCount: parseInt(xhr.getResponseHeader('X-Total-Count'), 10),
                payload: response[Object.keys(response)[0]]
              };

              // console.log('filtered withParents', withParents.filter(item => (Object.keys(item).length > 0) && item.id !== null));
              if (withParents.length === 0) {
                return Observable.of(fetchSuccess(resultData));
              }

              return Observable.of(fetchParents(resultData, withParents));
            })
            .takeUntil(
              action$.filter(action => {
                return [FETCH, FETCH_CANCELLED, FETCH_FAILURE].includes(action.type) && action.schemaId === schemaId;

              })
            );
        }).catch(error => Observable.of(fetchFailure(parseXHRError(error))));
    });

export const fetchWithParents = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(FETCH_PARENTS)
  .mergeMap(({data, withParents}) => {
    const state = store.getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    console.log('fetchWithPatents urls:',
      withParents.reduce((result, d) => [
        ...result,
        ...Object.keys(d).map(prop => {
          const propData = d[prop];

          return `${gohanUrl}${propData.url}/${propData.id}`;
        })
      ], [])
    );

    if (Object.keys(withParents).length > 0) {
      return Observable.zip(
        ...withParents.reduce((result, d) => [
          ...result,
          ...Object.keys(d).map(prop => {
            const propData = d[prop];

            return call(
              (url, headers) => get(url, headers),
              `${gohanUrl}${propData.url}/${propData.id}`,
              headers,
            );
          })
        ], [])
      ).mergeMap(responseArray => {
        console.log('responseArray:', responseArray);

        // if (Object.keys(propsWithParents).length > 0) {
        //   return Observable.of(fetchParents(dataWithParents, propsWithParents));
        // }

        return Observable.of(fetchSuccess(data));
      })
      .catch(error => {
        console.error(error);
        return Observable.of(fetchFailure(parseXHRError(error)));
      });
    }
  });

export const createEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(CREATE).mergeMap(({schemaId, params, data}) => {
    const state = store.getState();
    const gohanUrl = getGohanUrl(state);
    const url = getCollectionUrl(state, schemaId, params);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': getTokenId(state)
    };

    return call(post, `${gohanUrl}${url}`, headers, data)
      .mergeMap(() => Observable.concat(
        Observable.of(createSuccess()),
        Observable.of(closeDialog(`${schemaId}_create`)()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.of(createFailure(parseXHRError(error))));
  });

export const updateEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(UPDATE).mergeMap(({schemaId, params, data, id}) => {
    const state = store.getState();
    const gohanUrl = getGohanUrl(state);
    const url = getCollectionUrl(state, schemaId, params);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': getTokenId(state)
    };

    return call(put, `${gohanUrl}${url}/${id}`, headers, data)
      .flatMap(() => Observable.concat(
        Observable.of(updateSuccess()),
        Observable.of(closeDialog(`${schemaId}_update`)()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.of(updateFailure(parseXHRError(error))));
  });

export const purgeEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(PURGE).mergeMap(({schemaId, params, id}) => {
    const state = store.getState();
    const gohanUrl = getGohanUrl(state);
    const url = getCollectionUrl(state, schemaId, params);
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': getTokenId(state)
    };

    if (Array.isArray(id)) {
      const id$ = Observable.of(id);

      return id$.mergeMap(ids => Observable.forkJoin(...ids.map(id => call(purge, `${gohanUrl}${url}/${id}`, headers))))
        .flatMap(() => Observable.concat(
          Observable.of(purgeSuccess()),
          Observable.of(fetch(schemaId, params)())
        ))
        .catch(error => Observable.concat(
          Observable.of(purgeFailure(parseXHRError(error))),
          Observable.of(fetch(schemaId, params)())
        ));
    }
    return call(purge, `${gohanUrl}${url}/${id}`, headers)
      .flatMap(() => Observable.concat(
        Observable.of(purgeSuccess()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.of(purgeFailure(parseXHRError(error))));
  });
export default combineEpics(
  fetchEpic,
  fetchWithParents,
  createEpic,
  updateEpic,
  purgeEpic
);
