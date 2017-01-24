import {createSelector} from 'reselect';

const schemaReducer = (state) => state.schemaReducer.data;
const plural = (state) => state.tableReducer.plural;
const pageLimit = (state) => state.configReducer.pageLimit;
const totalCount = (state) => state.tableReducer.totalCount;
const limit = (state) => state.tableReducer.limit;
const offset = (state) => state.tableReducer.offset;

export const getActiveSchema = createSelector(
  [schemaReducer, plural],
  (schemas, name) => {

    return schemas.find(
      object => object.plural === name
    );
  }
);

export const getHeaders = createSelector(
  [state => getActiveSchema(state)],
  (schema) => {
    if (schema) {
      let exclude = ['id'];
      let headers = [];
      const schemaProperties = schema.schema.properties;
      const schemaPropertiesOrder = schema.schema.propertiesOrder;

      schemaPropertiesOrder.forEach(item => {
        const property = schemaProperties[item];

        if (property && property.view && !property.view.includes('list')) {
          return;
        }

        if (exclude && exclude.length) {
          if (exclude.includes(item)) {
            return;
          }
        }

        headers.push(item);
      });

      return headers;
    }
    return null;
  }
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
