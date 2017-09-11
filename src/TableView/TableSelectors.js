import {createSelector} from 'reselect';

const schemaReducer = state => state.schemaReducer.data;
const plural = (state, props) => props.plural;
const pageLimit = state => state.configReducer.pageLimit;
const totalCount = (state, props) => {
  if (state.tableReducer[props.plural]) {
    return state.tableReducer[props.plural].totalCount;
  }
  return 0;
};
const limit = (state, props) => {
  if (state.tableReducer[props.plural]) {
    return state.tableReducer[props.plural].limit;
  }
  return 0;
};
const offset = (state, props) => {
  if (state.tableReducer[props.plural]) {
    return state.tableReducer[props.plural].offset;
  }
  return 0;
};
const data = (state, props) => {
  if (state.tableReducer && state.tableReducer[props.plural] && state.tableReducer[props.plural].data) {
    return state.tableReducer[props.plural].data;
  }

  return {};
};
const parentUrl = (state, props) => props.parentUrl;
const tableReducer = state => state.tableReducer;
const isLoading = (state, props) => {
  if (state.tableReducer && state.tableReducer[props.plural]) {
    return state.tableReducer[props.plural].isLoading;
  }

  return true;
};

export const getResourceTitle = createSelector(
  [(state, props) => getActiveSchema(state, props)],
  schema => schema.title
);

export const getActiveSchema = createSelector(
  [schemaReducer, plural],
  (schemas, plural) => schemas.find(object => object.plural === plural)
);

export const getLinkUrl = createSelector(
  [(state, props) => getActiveSchema(state, props), parentUrl],
  (schema, parentUrl) => {
    if (schema) {
      return `${(parentUrl || schema.prefix)}/${schema.plural}`;
    }

    return '';
  }
);

export const getHeaders = createSelector(
  [(state, props) => getActiveSchema(state, props)],
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
          return result;
        }

        if (property && property.view && !property.view.includes('list')) {
          return result;
        }

        const transformedItem = {
          id: item,
          title: schemaProperties[item].title,
          type: schemaProperties[item].type
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
  [tableReducer, plural],
  (tableReducer, plural) => {
    if (tableReducer && tableReducer[plural]) {
      return {
        sortKey: tableReducer[plural].sortKey,
        sortOrder: tableReducer[plural].sortOrder
      };
    }

    return {
      sortKey: '',
      sortOrder: 'asc'
    };
  }
);

export const getFilters = createSelector(
  [tableReducer, plural],
  (tableReducer, plural) => {
    if (tableReducer && tableReducer[plural]) {
      return tableReducer[plural].filters;
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
