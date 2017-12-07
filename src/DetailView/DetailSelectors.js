import {
  createSelector,
} from 'reselect';

const isLoading = state => state.detailReducer.isLoading;
const data = state => state.detailReducer.data || {};
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
  const detailData = data(state);
  const propSchema = schema(state, id);
  const {properties} = propSchema.schema || {properties: {}};
  const propertiesNames = Object.keys(detailData);

  return propertiesNames
    .filter(prop => properties[prop] && properties[prop].relation)
    .reduce((result, prop) => {
      const {
        relation,
        relation_property: relationProperty
      } = properties[prop];
      const parentsIds = (detailData[relation] && detailData[relation].parents) ? detailData[relation].parents : [];
      const url = singularSchemaUrl(state, relation, {
        ...parentsIds,
        [`${relation}_id`]: detailData[prop],
      });
      return {
        ...result,
        [relationProperty || relation]: url,
      };
    }, {});
};

export const checkLoading = createSelector(
  [isLoading],
  isLoading => isLoading
);

export const getData = createSelector(
  [data, relationsUrls],
  (data, relationsUrls) => {

    if (Object.keys(relationsUrls).length === 0) {
      return data || {};
    }

    return Object.keys(relationsUrls).reduce((result, prop) => ({
      ...result,
      [prop]: {
        ...result[prop],
        url: relationsUrls[prop],
      }
    }), data);
  }
);
