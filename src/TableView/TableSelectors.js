import {createSelector} from 'reselect';

const selectedSchema = (state, id) => state.schemaReducer.data.find(schema => schema.id === id);
const totalCount = (state, id) => {
  if (state.tableReducer[id]) {
    return state.tableReducer[id].totalCount;
  }
  return 0;
};
const pageLimit = state => state.configReducer.pageLimit;
const limit = (state, id) => {
  if (state.tableReducer[id]) {
    return state.tableReducer[id].limit;
  }
  return 0;
};
const offset = (state, id) => {
  if (state.tableReducer[id]) {
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
const url = (state, id) => {
  if (state.tableReducer[id]) {
    return state.tableReducer[id].url;
  }
  return '';
};
const tableReducer = state => state.tableReducer;
const isLoading = (state, id) => {
  if (state.tableReducer && state.tableReducer[id]) {
    return state.tableReducer[id].isLoading;
  }

  return true;
};

export const getResourceTitle = createSelector(
  [(state, props) => getSchema(state, props)],
  schema => schema.title
);

export const getSchema = createSelector(
  [selectedSchema],
  selectedSchema => selectedSchema
);

export const getLinkUrl = createSelector(
  [url],
  url => url
);

export const getHeaders = createSelector(
  [(state, id) => getSchema(state, id)],
  schema => {
    if (schema) {
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

        if (item.includes(`${property.relation}_id`)) {
          const transformedItem = {
            id: property.relation_property, // eslint-disable-line camelcase
            title: property.title,
            type: property.type
          };

          result.push(transformedItem);

          return result;
        }

        if (property && property.view && !property.view.includes('list')) {
          return result;
        }

        const transformedItem = {
          id: item,
          title: property.title,
          type: property.type
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

export const getActivePage = createSelector(
  [offset, limit, pageLimit],
  (offset, limit, pageLimit) => {
    return Math.ceil(offset / (limit || pageLimit));
  }
);

export const getPageCount = createSelector(
  [totalCount, limit, pageLimit],
  (totalCount, limit, pageLimit) => {
    return Math.ceil(totalCount / (limit || pageLimit));
  }
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
      sortOrder: 'asc'
    };
  }
);

export const getFilters = createSelector(
  [tableReducer, id],
  (tableReducer, id) => {
    if (tableReducer && tableReducer[id]) {
      return tableReducer[id].filters;
    }

    return {};
  }
);

export const getPageLimit = createSelector(
  [pageLimit],
  pageLimit => pageLimit
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
