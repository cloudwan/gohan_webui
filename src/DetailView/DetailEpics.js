import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';
import {
  FETCH,
  FETCH_CANCELLED,
  FETCH_FAILURE,
  UPDATE,
  DELETE,
} from './DetailActionTypes';

import {getSchema} from './../schema/SchemaSelectors';

import {
  fetch,
  fetchSuccess,
  fetchError,
  fetchRelationError,
  fetchCancelled,
  updateSuccess,
  updateError,
  removeSuccess,
  removeError,
} from './DetailActions';
import {
  closeActiveDialog,
  showError,
} from '../Dialog/DialogActions.js';
import {
  update,
  remove,
  getPollingTimer,
  getSingular,
} from './../api/index';
import {getFollowableRelationsState} from './../config/ConfigSelectors';

export const getRelationData = (prop, id, state, data = {}, call = (fn, ...args) => fn(...args)) => {
  return call(getSingular, state, prop.id, {[`${prop.id}_id`]: id})
    .mergeMap(({payload}) => {
      if (Object.keys(data).length === 0 && payload.name) {
        data.name = payload.name;
      }

      if (prop.parent) {
        const parentSchema = getSchema(state, prop.parent);
        data[`${prop.parent}_id`] = payload[`${prop.parent}_id`];

        if (parentSchema.parent) {
          return getRelationData(
            parentSchema,
            payload[`${prop.parent}_id`],
            state,
            data,
            call,
          );
        }
      }

      return Observable.of(data);
    });
};

export const fetchEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(FETCH).mergeMap(({schemaId, params}) => getPollingTimer(
    store.getState(),
    action$.filter(
      action => [FETCH, FETCH_CANCELLED, FETCH_FAILURE].includes(action.type)
    )
  )
    .mergeMap(() => call(getSingular, store.getState(), schemaId, params)
      .mergeMap(response => {
        const {payload} = response;
        const state = store.getState();

        if (getFollowableRelationsState(state)) {
          const properties = getSchema(state, schemaId).schema.properties;
          const relationProperties = Object.keys(properties)
            .filter(key => Boolean(properties[key].relation) && Boolean(payload[key]))
            .map(key => ({key: properties[key].relation, id: payload[key]}))
            .filter(({key}) => !payload[key]);

          if (relationProperties.length !== 0) {
            return Observable.zip(
              ...relationProperties
                .map(({key, id}) => {
                  const relationProperty = getSchema(state, key);

                  if (relationProperty && id) {
                    return getRelationData(relationProperty, id, state);
                  }

                  console.error(`Cannot find schema for ${key}`);

                  return new Promise(resolve => {
                    resolve('Unknown error.');
                  });
                })
            ).flatMap(value => {
              const errors = value.filter(v => typeof v === 'string');

              relationProperties.forEach(({key}, index) => {
                if (typeof value[index] === 'object') {
                  payload[key] = value[index];
                }
              });

              return Observable.concat(
                Observable.of(fetchSuccess(payload)),
                ...errors.map(error => Observable.of(fetchRelationError(error)))
              );
            });
          }
        }
        return Observable.of(fetchSuccess(payload));
      })
      .takeUntil(
        action$.filter(action => [FETCH, FETCH_CANCELLED, FETCH_FAILURE].includes(action.type))
      ))
    .catch(error => Observable.of(fetchError(error)))
  );

export const updateEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(UPDATE).mergeMap(({schemaId, params, data}) =>
    call(update, store.getState(), schemaId, params, data)
      .mergeMap(() => Observable.concat(
        Observable.of(updateSuccess(schemaId, params)),
        Observable.of(closeActiveDialog()),
        Observable.of(fetch(schemaId, params)())
      ))
      .catch(error => Observable.concat(
        Observable.of(updateError()),
        Observable.of(showError(error)),
      ))
  );
export const removeEpic = (action$, store, call = (fn, ...args) => fn(...args)) =>
  action$.ofType(DELETE).mergeMap(({schemaId, params}) =>
    call(remove, store.getState(), schemaId, params)
      .mergeMap(() => Observable.concat(
        Observable.of(removeSuccess()),
        Observable.of(fetchCancelled())
      ))
      .catch(error => Observable.of(removeError(error)))
  );

export default combineEpics(
  fetchEpic,
  updateEpic,
  removeEpic,
);
