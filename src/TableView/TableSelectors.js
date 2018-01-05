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

const schema = (state, id) => {
  if (!state.schemaReducer || !state.schemaReducer.data) {
    return {};
  }

  return state.schemaReducer.data.find(item => item.id === id);
};

const schemaParents = (state, id) => {
  const result = [];

  let parentSchema = schema(state, id);

  result.unshift(parentSchema);

  while (parentSchema.parent) {
    parentSchema = schema(state, parentSchema.parent);
    result.unshift(parentSchema);
  }
  return result;
};

const singularSchemaUrl = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce(
    (result, parent, index) => (
      `${result}${(index === 0) ? parent.prefix : ''}/${parent.plural}/${params[`${parent.id}_id`]}`
    ),
    ''
  );
};

const relationsUrls = (state, id) => {
  const detailData = data(state, id);

  const propSchema = schema(state, id);
  const {properties} = propSchema.schema || {properties: {}};
  const propertiesNames = detailData.length > 0 ? Object.keys(detailData[0]) : [];

  return detailData.map(d => {
    return propertiesNames
      .filter(prop => properties[prop] && properties[prop].relation)
      .reduce((result, prop) => {
        const {
          relation,
          relation_property: relationProperty
        } = properties[prop];
        const parentsIds = (d[relation] && d[relation].parents) ? d[relation].parents : [];
        const url = singularSchemaUrl(state, relation, {
          ...parentsIds,
          [`${relation}_id`]: d[prop],
        });
        return {
          ...result,
          [relationProperty || relation]: url,
        };
      }, {});
  });
};

export const getResourceTitle = createSelector(
  [getSchema],
  schema => schema.title
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
            id: property.relation_property || property.relation, // eslint-disable-line camelcase
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
          type: property.type || 'relation'
        };

        result.push(transformedItem);

        return result;
      }, []);
    }

    return [];
  }
);

export const getData = createSelector(
  [data, relationsUrls],
  (data, relationsUrls) => {

    if (Object.keys(relationsUrls).length === 0) {
      return data || {};
    }

    return data.map((d, i) => {
      return Object.keys(relationsUrls[i]).reduce((result, name) => ({
        ...result,
        [name]: {
          ...result[name],
          url: relationsUrls[i][name],
        }
      }), d);
    });
  }
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
