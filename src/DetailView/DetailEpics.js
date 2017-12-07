import {combineEpics} from 'redux-observable';
import {Observable} from 'rxjs';
import {
  FETCH,
  FETCH_PARENTS,
  FETCH_CANCELLED,
  FETCH_FAILURE,
} from './DetailActionTypes';

import {
  getSingularUrl,
  getSchema
} from './../schema/SchemaSelectors';

import {
  fetchParents,
  fetchSuccess,
  fetchError
} from './DetailActions';
import {
  get,
  parseXHRError
} from './../api/index';

export const fetch = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(FETCH)
  .switchMap(({schemaId, params}) => {
    const state = store.getState();
    const schema = getSchema(state, schemaId);
    const {properties} = schema.schema;
    const {
      pollingInterval,
      polling,
    } = state.configReducer;
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
      .mergeMap(({response}) => {
        const data = response[Object.keys(response)[0]];
        const withParents = Object.keys(data).reduce((result, prop) => {
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
                id: data[prop]
              }
            };
          }

          return result;
        }, {});

        if (Object.keys(withParents).length === 0) {
          return Observable.of(fetchSuccess(data));
        }

        return Observable.of(fetchParents(data, withParents));
      })
      .catch(error => {
        console.error(error);
        return Observable.of(fetchError(parseXHRError(error)));
      })
    );
  });

export const fetchWithParents = (action$, store, call = (fn, ...args) => fn(...args)) => action$.ofType(FETCH_PARENTS)
  .mergeMap(({data, withParents}) => {
    const state = store.getState();
    const {url: gohanUrl} = state.configReducer.gohan;
    const headers = {
      'Content-Type': 'application/json',
      'X-Auth-Token': state.authReducer.tokenId
    };

    if (Object.keys(withParents).length > 0) {
      return Observable.zip(
        ...Object.keys(withParents).map(prop => {
          const propData = withParents[prop];

          return call(
            (url, headers) => get(url, headers),
            `${gohanUrl}/${propData.url}/${propData.id}`,
            headers,
          );
        })
      ).mergeMap(responseArray => {
        const currentParents = responseArray.map(({response}) => {
          const prop = Object.keys(response)[0];
          const propData = withParents[prop];

          return {
            relationName: propData.relationName,
            childSchemaId: propData.childSchemaId,
            schemaId: propData.parent,
            id: response[prop][`${propData.parent}_id`],
          };
        });

        const dataWithParents = currentParents.reduce((result, parent) => {
          const props = data[parent.childSchemaId] || {};

          return {
            ...result,
            [parent.relationName]: {
              ...props,
              parents: {
                ...props.parents,
                [`${parent.schemaId}_id`]: parent.id,
              },
            }
          };
        }, data);

        const propsWithParents = currentParents.reduce((result, prop) => {
          const propSchema = getSchema(state, prop.schemaId);

          if (propSchema.parent) {
            return {
              ...result,
              [prop.schemaId]: {
                url: propSchema.url,
                relationName: prop.relationName,
                childSchemaId: prop.childSchemaId,
                parent: propSchema.parent,
                id: prop.id
              }
            };
          }

          return result;
        }, {});

        if (Object.keys(propsWithParents).length > 0) {
          return Observable.of(fetchParents(dataWithParents, propsWithParents));
        }

        return Observable.of(fetchSuccess(dataWithParents));
      })
      .catch(error => {
        console.error(error);
        return Observable.of(fetchError(parseXHRError(error)));
      });
    }

    return Observable.of(fetchSuccess(data));
  });

export default combineEpics(
  fetch,
  fetchWithParents,
);
