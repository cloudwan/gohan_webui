import {createSelector} from 'reselect';

const schemaReducer = (state) => state.schemaReducer.data;
const plural = (state, props) => props.route.plural;
const pageLimit = (state) => state.configReducer.pageLimit;
const totalCount = (state, props) => {
  if (state.tableReducer[props.route.plural]) {
    return state.tableReducer[props.route.plural].totalCount;
  }
  return 0;
};
const limit = (state, props) => {
  if (state.tableReducer[props.route.plural]) {
    return state.tableReducer[props.route.plural].limit;
  }
  return 0;
};
const offset = (state, props) => {
  if (state.tableReducer[props.route.plural]) {
    return state.tableReducer[props.route.plural].offset;
  }
  return 0;
};

export const getActiveSchema = createSelector(
  [schemaReducer, plural],
  (schemas, plural) => {
    return schemas.find(
      object => object.plural === plural
    );
  }
);

export const getHeaders = createSelector(
  [(state, props) => getActiveSchema(state, props)],
  (schema) => {
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

        if (property && property.view && !property.view.includes('list')) {
          return result;
        }

        result.push(item);

        return result;
      }, []);
    }

    return [];
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
