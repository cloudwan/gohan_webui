import {createSelector} from 'reselect';

import {getSchema} from './../schema/SchemaSelectors';

const totalCount = (state, id) => {
  if (state.tableReducer && state.tableReducer[id]) {
    return state.tableReducer[id].totalCount || 0;
  }

  return 0;
};

const limit = (state, id) => {
  if (state.tableReducer && state.tableReducer[id]) {
    return state.tableReducer[id].limit;
  }
  return undefined;
};

const offset = (state, id) => {
  if (state.tableReducer && state.tableReducer[id]) {
    return state.tableReducer[id].offset;
  }
  return 0;
};

const id = (state, id) => id;
const data = (state, id) => {
  if (state.tableReducer && state.tableReducer[id] && state.tableReducer[id].data) {
    return state.tableReducer[id].data;
  }

  return [];
};
const tableReducer = state => state.tableReducer;
const isLoading = (state, id) => {
  if (state.tableReducer && state.tableReducer[id]) {
    return state.tableReducer[id].isLoading;
  }

  return true;
};

export const getResourceTitle = createSelector(
  [getSchema],
  schema => schema.title
);

export const getHeaders = createSelector(
  [(state, id) => getSchema(state, id)],
  schema => {
    if (schema) {
      const parentProperty = `${schema.parent}_id`;
      const schemaProperties = schema.schema.properties;
      const schemaPropertiesOrder = schema.schema.propertiesOrder;
      let exclude = ['id'];

      return schemaPropertiesOrder.reduce((result, item) => {
        const property = schemaProperties[item];
        if (exclude.includes(item)) {
          return result;
        }
        if (property === undefined) {
          return result;
        }

        if (property.view && !property.view.includes('list') || item === parentProperty) {
          return result;
        }

        if (item.includes(`${property.relation}_id`)) {
          const transformedItem = {
            id: property.relation_property || `${property.relation}_id`, // eslint-disable-line camelcase
            title: property.title,
            type: property.type,
            propKey: item,
            hasRelation: true
          };

          result.push(transformedItem);

          return result;
        }

        const transformedItem = {
          id: item,
          title: property.title,
          type: property.type,
          hasRelation: property.relation_property !== undefined || property.relation !== undefined
        };

        result.push(transformedItem);

        return result;
      }, []);
    }

    return [];
  }
);

export const getData = createSelector(
  [data],
  data => data
);
export const getOffset = createSelector(
  [offset],
  offset => offset || 0
);

export const getActivePage = createSelector(
  [offset, limit],
  (offset, limit) => (limit !== undefined && limit !== 0) ? Math.ceil(offset / limit) : 0
);

export const getPageCount = createSelector(
  [totalCount, limit],
  (totalCount, limit) => (totalCount !== 0 && limit !== 0) ? Math.ceil(totalCount / limit) : 0
);

export const getSortOptions = createSelector(
  [tableReducer, id],
  (tableReducer, id) => {
    if (tableReducer && tableReducer[id]) {
      return {
        sortKey: tableReducer[id].sortKey,
        sortOrder: tableReducer[id].sortOrder
      };
    }

    return {
      sortKey: '',
      sortOrder: ''
    };
  }
);

export const getFilters = createSelector(
  [tableReducer, id],
  (tableReducer, id) => {
    if (tableReducer && tableReducer[id]) {
      return tableReducer[id].filters;
    }

    return [];
  }
);

export const getLimit = createSelector(
  [limit],
  limit => limit
);

export const getTotalCount = createSelector(
  [totalCount],
  totalCount => totalCount
);

export const getIsLoading = createSelector(
  [isLoading],
  isLoading => isLoading
);
