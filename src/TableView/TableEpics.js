/* globals parseInt*/
import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';

import {
  getPollingTimer,
  getCollection,
  create,
  update,
  remove,
} from './../api/index';

import {
  isValidFieldName
} from './../schema/SchemaSelectors';
import {
  getPageLimit,
  getDefaultSortKey,
  getDefaultSortOrder
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
  FETCH_CANCELLED,
  FETCH_FAILURE,
} from './TableActionTypes';
import {
  fetch,
  fetchSuccess,
  fetchFailure,
  createSuccess,
  createFailure,
  updateSuccess,
  updateFailure,
  purgeSuccess,
  purgeFailure
} from './TableActions';
import {closeDialog} from './../Dialog/DialogActions';

export const fetchEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(FETCH).mergeMap(({schemaId, params, options = {}}) => getPollingTimer(
    store.getState(),
    action$.filter(
      action => [FETCH, FETCH_CANCELLED, FETCH_FAILURE].includes(action.type) && action.schemaId === schemaId
    )
  )
    .mergeMap(() => {
      const state = store.getState();
      const defaultPageLimit = getPageLimit(state);
      const defaultSortKey = getDefaultSortKey(state);
      const defaultSortOrder = getDefaultSortOrder(state);
      const sortOptions = getSortOptions(state, schemaId);
      const filters = getFilters(state, schemaId);


      const query = {
        sort_key: isValidFieldName(state, schemaId, defaultSortKey) ? defaultSortKey : undefined, // eslint-disable-line
        sort_order: defaultSortOrder, // eslint-disable-line camelcase
        limit: defaultPageLimit,
        offset: undefined
      };

      if (options.sortKey !== undefined) {
        if (options.sortKey === '') {
          query.sort_key = undefined; // eslint-disable-line camelcase
        } else {
          query.sort_key = options.sortKey; // eslint-disable-line camelcase
        }
      } else if (sortOptions.sortKey !== '') {
        query.sort_key = sortOptions.sortKey; // eslint-disable-line camelcase
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
      } else if (sortOptions.sortOrder !== '') {
        query.sort_order = sortOptions.sortOrder; // eslint-disable-line camelcase
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
      } else if (defaultPageLimit !== undefined) {
        if (defaultPageLimit === 0) {
          query.limit = undefined;
        } else {
          query.limit = defaultPageLimit;
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

      return call(getCollection, state, schemaId, params, query)
        .map(response => fetchSuccess({
          schemaId,
          sortKey: query.sort_key || '',
          sortOrder: query.sort_order || '',
          limit: query.limit || 0,
          offset: query.offset || 0,
          filters: options.filters || filters || [],
          totalCount: response.totalCount,
          payload: response.payload
        }))
        .takeUntil(
          action$.filter(
            action => [FETCH, FETCH_CANCELLED, FETCH_FAILURE].includes(action.type) && action.schemaId === schemaId
          )
        );
    })
    .catch(error => Observable.of(fetchFailure(error)))
  );

export const createEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(CREATE).mergeMap(({schemaId, params, data}) =>
    call(create, store.getState(), schemaId, params, data)
      .mergeMap(() => Observable.concat(
        Observable.of(createSuccess()),
        Observable.of(closeDialog(`${schemaId}_create`)()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.of(createFailure(error)))
  );

export const updateEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(UPDATE).mergeMap(({schemaId, params, data, id}) =>
    call(update, store.getState(), schemaId, {...params, [`${schemaId}_id`]: id}, data)
      .mergeMap(() => Observable.concat(
        Observable.of(updateSuccess()),
        Observable.of(closeDialog(`${schemaId}_update`)()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.of(updateFailure(error)))
  );

export const removeEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(PURGE).mergeMap(({schemaId, params, id, options}) => {

    if (Array.isArray(id)) {
      const id$ = Observable.of(id);

      return id$.mergeMap(ids => Observable.forkJoin(
        ...ids.map(id => call(remove, store.getState(), schemaId, {...params, [`${schemaId}_id`]: id}))
      ))
        .flatMap(() => Observable.concat(
          Observable.of(purgeSuccess()),
          Observable.of(fetch(schemaId, params)(options))
        ))
        .catch(error => Observable.concat(
          Observable.of(purgeFailure(error)),
          Observable.of(fetch(schemaId, params)(options))
        ));
    }

    return call(remove, store.getState(), schemaId, {...params, [`${schemaId}_id`]: id})
      .mergeMap(() => Observable.concat(
        Observable.of(purgeSuccess()),
        Observable.of(fetch(schemaId, params)(options))
      ))
      .catch(error => Observable.concat(
        Observable.of(purgeFailure(error)),
        Observable.of(fetch(schemaId, params)(options))
      ));
    }
  );

export default combineEpics(
  fetchEpic,
  createEpic,
  updateEpic,
  removeEpic
);
