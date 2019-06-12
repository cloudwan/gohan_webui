import {createSelector} from 'reselect';

const schemas = state => state.schemaReducer.data;
const schema = (state, id) => state.schemaReducer.data.find(item => item.id === id);
const actions = (state, id) => {
  const resourceSchema = schema(state, id);
  return (resourceSchema && resourceSchema.actions) ? resourceSchema.actions : {};
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
        `${result}${(index === 0) ? parent.prefix : ''}` +
        (params[`${parent.id}_id`] ? `/${parent.plural}/${params[`${parent.id}_id`]}` : '')
      ),
    ''
  );
};

const collectionSchemaUrl = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce(
    (result, parent, index, array) => (
      `${result}${(index === 0) ? `${parent.prefix}` : ''}` +
      `${(params[`${parent.id}_id`] && (index !== array.length - 1)) ?
        `/${parent.plural}/${params[`${parent.id}_id`]}` : (index === array.length - 1) ? `/${parent.plural}` : ''}`
    ),
    ''
  );
};

const breadcrumb = (state, id, params) => {
  const parents = schemaParents(state, id);

  return parents.reduce((result, item) => {
    if (item.parent === '') {
      result.push({
        title: item.title,
        url: `${item.url}`
      });
    }
    const singularLink = singularSchemaUrl(state, item.id, params);

    result.push({
      singular: item.singular,
      requestUrl: singularLink,
      url: singularLink
    });

    return result;
  }, []);
};

const selectedParents = (state, id, lastParent) => {
  const parents = schemaParents(state, id);
  const index = parents
    .map(parent => parent.id)
    .indexOf(lastParent);

  return parents.slice(index, parents.length - 1);
};

const hasProperty = (state, id, property) => {
  const selectedSchema = schema(state, id);

  if (!selectedSchema) {
    return false;
  }

  return Object.keys(selectedSchema.schema.properties).includes(property);
};

export const getSingularUrl = createSelector(
  [singularSchemaUrl],
  url => url
);

export const getCollectionUrl = createSelector(
  [collectionSchemaUrl],
  url => url
);

export const getSidebarMenuItems = createSelector(
  [schemas],
  schemas => {
    if (schemas !== undefined && Array.isArray(schemas)) {
      return schemas.filter(item => (!item.parent && item.metadata.type !== 'metaschema')).map(item => (
        {
          title: item.title,
          path: '#' + item.url
        }
      ));
    }
    return [];
  }
);

export const getSchema = createSelector(
  [schema],
  schema => {
    return schema;
  }
);

export const getAllSchemas = createSelector(
  [schemas],
  schemas => schemas
);

export const hasReadPermission = createSelector(
  [schema],
  schema => Boolean(schema && schema.schema && schema.schema.permission.includes('read'))
);

export const hasCreatePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('create')
);

export const hasUpdatePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('update')
)
;
export const hasDeletePermission = createSelector(
  [schema],
  schema => schema.schema.permission.includes('delete')
);

export const getBreadcrumb = createSelector(
  [breadcrumb],
  breadcrumb => breadcrumb
);

export const isValidFieldName = createSelector(
  [schema, (state, id, name) => name],
  (schema, name) => Boolean(schema !== undefined && schema.schema.properties[name])
);

export const getSelectedParents = createSelector(
  [selectedParents],
  selectedParents => selectedParents
);

export const hasSchemaProperty = createSelector(
  [hasProperty],
  hasProperty => hasProperty
);

export const getActions = createSelector(
  [actions],
  actions => actions
);

export const getSingularActions = createSelector(
  [actions],
  actions => Object.keys(actions).reduce((result, action) => {
    if ((/\/\:id\//).test(actions[action].path)) {
      result[action] = actions[action];
    }

    return result;
  }, {})
);

export const getCollectionActions = createSelector(
  [actions],
  actions => Object.keys(actions).reduce((result, action) => {
    if (!(/\/\:id\//).test(actions[action].path)) {
      result[action] = actions[action];
    }

    return result;
  }, {})
);

export const getIsPublicExists = createSelector(
  [schema],
  schema => schema.schema.properties.is_public !== undefined
);
